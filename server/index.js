import { createPool } from "./db.js";
import { createApp } from "./app.js";

const pool = createPool();
pool.on("error", (error) =>
  console.error("Idle database connection error:", error.code),
);

const isSQLite = pool._isSQLite;
if (isSQLite) {
  // Auto-migrate SQLite on startup
  const { autoMigrateSQLite } = await import("./db.js");
  console.log("⬡ Using local SQLite database (zero-config mode)");
  console.log(`  Database file: ${pool._dbPath}`);
  await autoMigrateSQLite(pool);
} else {
  await pool.query("SELECT 1 FROM schema_migrations LIMIT 1");
  console.log("⬡ Connected to PostgreSQL");
}

const app = createApp(pool);
const port = Number(process.env.PORT || 3000);
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`\n🌍 Wanderlock listening on port ${port}`);
  console.log(`   Open http://localhost:${port} to play\n`);
});

for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () =>
    server.close(async () => {
      await pool.end();
      process.exit(0);
    }),
  );
