import pg from "pg";
import { DatabaseSync } from "node:sqlite";
import { readdir, readFile } from "node:fs/promises";
import { mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * SQLitePool: a pg.Pool-compatible adapter backed by Node 24's built-in SQLite.
 * Translates PostgreSQL $1/$2 params to SQLite ?, handles JSON columns as TEXT,
 * and provides connect/release/begin/commit/rollback for the store's transaction pattern.
 */
class SQLitePool extends EventTarget {
  constructor(dbPath) {
    super();
    this.db = new DatabaseSync(dbPath);
    this.db.exec("PRAGMA journal_mode = WAL");
    this.db.exec("PRAGMA foreign_keys = ON");
    this._closed = false;
  }

  /** Convert PostgreSQL $1, $2 placeholders to SQLite ? placeholders. */
  _translate(sql, params = []) {
    // Replace $N with ? and reorder params accordingly
    const paramMap = [];
    const translated = sql.replace(/\$(\d+)/g, (_, n) => {
      paramMap.push(Number(n) - 1);
      return "?";
    });
    const orderedParams = paramMap.map((i) => {
      let v = params[i];
      // SQLite doesn't have jsonb; store objects as JSON strings
      if (v !== null && v !== undefined && typeof v === "object" && !(v instanceof Date))
        v = JSON.stringify(v);
      if (v instanceof Date) v = v.toISOString();
      if (v === undefined) v = null;
      return v;
    });
    return { sql: translated, params: orderedParams };
  }

  /** Parse JSON columns back to objects if they look like JSON. */
  _parseRow(row) {
    if (!row) return row;
    const parsed = { ...row };
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string" && (value.startsWith("{") || value.startsWith("["))) {
        try { parsed[key] = JSON.parse(value); } catch { /* keep string */ }
      }
    }
    return parsed;
  }

  query(sql, params = []) {
    // Skip PostgreSQL-specific statements
    const trimmed = sql.trim().toUpperCase();
    if (trimmed.startsWith("SELECT PG_ADVISORY")) {
      return { rows: [], rowCount: 0 };
    }

    const { sql: translatedSql, params: translatedParams } = this._translate(sql, params);

    // Adapt PostgreSQL-specific SQL syntax for SQLite
    let sqliteSql = translatedSql
      // Remove PostgreSQL type casts
      .replace(/::[\w]+/g, "")
      // timestamptz -> TEXT
      .replace(/\btimestamptz\b/gi, "TEXT")
      // jsonb -> TEXT
      .replace(/\bjsonb\b/gi, "TEXT")
      // jsonb_array_length -> json_array_length
      .replace(/\bjsonb_array_length\b/gi, "json_array_length")
      // varchar(N) -> TEXT
      .replace(/\bvarchar\(\d+\)/gi, "TEXT")
      // uuid -> TEXT
      .replace(/\buuid\b/gi, "TEXT")
      // DEFAULT now() -> DEFAULT (datetime('now'))
      .replace(/DEFAULT\s+now\(\)/gi, "DEFAULT (datetime('now'))")
      // Remove FOR UPDATE (SQLite uses file-level locking)
      .replace(/\bFOR\s+UPDATE\b/gi, "")
      // Remove WHERE clause from CREATE INDEX if it has conditions
      .replace(/(CREATE\s+INDEX\s+\w+\s+ON\s+\w+\([^)]+\))\s+WHERE\s+.*/gi, "$1")
      // RETURNING * support - handled separately below
      ;

    const isSelect = trimmed.startsWith("SELECT") || trimmed.startsWith("WITH");
    const isReturning = /\bRETURNING\b/i.test(sqliteSql);

    if (trimmed === "BEGIN" || trimmed === "BEGIN TRANSACTION") {
      this.db.exec("BEGIN");
      return { rows: [], rowCount: 0 };
    }
    if (trimmed === "COMMIT") {
      this.db.exec("COMMIT");
      return { rows: [], rowCount: 0 };
    }
    if (trimmed === "ROLLBACK") {
      try { this.db.exec("ROLLBACK"); } catch { /* ignore if no transaction */ }
      return { rows: [], rowCount: 0 };
    }

    // Handle DDL statements (CREATE TABLE, CREATE INDEX)
    if (trimmed.startsWith("CREATE")) {
      this.db.exec(sqliteSql);
      return { rows: [], rowCount: 0 };
    }

    if (isSelect) {
      const stmt = this.db.prepare(sqliteSql);
      const rows = stmt.all(...translatedParams).map((r) => this._parseRow(r));
      return { rows, rowCount: rows.length };
    }

    if (isReturning) {
      // SQLite's RETURNING support: prepare and use all()
      const cleanSql = sqliteSql;
      try {
        const stmt = this.db.prepare(cleanSql);
        const rows = stmt.all(...translatedParams).map((r) => this._parseRow(r));
        return { rows, rowCount: rows.length };
      } catch {
        // Fallback: run without RETURNING, then query the table
        const withoutReturning = cleanSql.replace(/\s+RETURNING\s+.*/i, "");
        const stmt = this.db.prepare(withoutReturning);
        stmt.run(...translatedParams);
        return { rows: [], rowCount: 1 };
      }
    }

    // INSERT / UPDATE / DELETE without RETURNING
    const stmt = this.db.prepare(sqliteSql);
    const result = stmt.run(...translatedParams);
    return { rows: [], rowCount: Number(result.changes) };
  }

  /** Return a client-like object for transaction support (used by store.js and migrate.js). */
  async connect() {
    const self = this;
    return {
      query: (sql, params) => self.query(sql, params),
      release: () => { /* no-op for SQLite */ },
    };
  }

  async end() {
    if (!this._closed) {
      this._closed = true;
      this.db.close();
    }
  }

  on(event, handler) {
    // Compatibility stub for pool.on("error", ...)
  }
}

/**
 * Auto-migrate SQLite database on first use.
 * Runs the same migration files as PostgreSQL but with SQLite-compatible SQL.
 */
export async function autoMigrateSQLite(pool) {
  pool.query(
    "CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT (datetime('now')))"
  );
  const migrationsDir = fileURLToPath(new URL("../database/migrations/", import.meta.url));
  try {
    const files = (await readdir(migrationsDir)).filter((n) => n.endsWith(".sql")).sort();
    for (const name of files) {
      const exists = pool.query("SELECT 1 FROM schema_migrations WHERE name=?", [name]);
      if (exists.rowCount) continue;
      const sql = await readFile(join(migrationsDir, name), "utf8");
      // Split multi-statement SQL and execute each
      for (const stmt of sql.split(";").map((s) => s.trim()).filter(Boolean)) {
        pool.query(stmt + ";");
      }
      pool.query("INSERT INTO schema_migrations(name) VALUES(?)", [name]);
      console.log(`  Applied migration: ${name}`);
    }
  } catch (error) {
    console.error("SQLite migration error:", error.message);
  }
}

export function createPool(url = process.env.DATABASE_URL) {
  // If DATABASE_URL is not set or explicitly set to "sqlite", use SQLite
  if (!url || url === "sqlite") {
    const dataDir = fileURLToPath(new URL("../data/", import.meta.url));
    if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
    const dbPath = join(dataDir, "wanderlock.db");
    const pool = new SQLitePool(dbPath);
    pool._isSQLite = true;
    pool._dbPath = dbPath;
    return pool;
  }
  return new pg.Pool({
    connectionString: url,
    max: 5,
    connectionTimeoutMillis: 5000,
    statement_timeout: 10000,
  });
}
