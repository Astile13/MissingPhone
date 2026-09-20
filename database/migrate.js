import { readdir, readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { createPool } from "../server/db.js";
export async function migrate(pool) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(78145021)");
    await client.query(
      "CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())",
    );
    const folder = new URL("./migrations/", import.meta.url);
    for (const name of (await readdir(folder))
      .filter((n) => n.endsWith(".sql"))
      .sort()) {
      const exists = await client.query(
        "SELECT 1 FROM schema_migrations WHERE name=$1",
        [name],
      );
      if (exists.rowCount) continue;
      await client.query(await readFile(new URL(name, folder), "utf8"));
      await client.query("INSERT INTO schema_migrations(name) VALUES($1)", [
        name,
      ]);
      console.log(`Applied ${name}`);
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const pool = createPool();
  try {
    await migrate(pool);
  } finally {
    await pool.end();
  }
}
