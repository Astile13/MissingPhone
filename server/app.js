import express from "express";
import { rateLimit } from "express-rate-limit";
import { fileURLToPath } from "node:url";
import { createSession, getSession, getRow, mutateSession } from "./store.js";
import { GameError, scramble } from "./game.js";
import { loadDestinations } from "./data/validate.js";
export function createApp(
  pool,
  { destinations = loadDestinations(), limit = 120 } = {},
) {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", Number(process.env.TRUST_PROXY || 0));
  app.use((req, res, next) => {
    res.set({
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "Content-Security-Policy":
        "default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
    });
    next();
  });
  app.use("/api", (req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  app.get("/api/health", async (req, res) => {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "ok" });
  });
  app.use(
    "/api",
    rateLimit({
      windowMs: 60000,
      limit,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: {
        error: {
          code: "RATE_LIMIT",
          message: "Take a short break, then try again.",
        },
      },
    }),
  );
  app.use(express.json({ limit: "4kb" }));
  const token = (req) => req.get("authorization")?.replace(/^Bearer /, "");
  app.post("/api/sessions", async (req, res) =>
    res.status(201).json(await createSession(pool, destinations)),
  );
  app.get("/api/session", async (req, res) =>
    res.json({ session: await getSession(pool, token(req)) }),
  );
  for (const kind of ["answer", "hint", "nickname"])
    app.post(`/api/session/${kind}`, async (req, res) =>
      res.json(await mutateSession(pool, token(req), kind, req.body)),
    );
  app.post("/api/session/shuffle", async (req, res) => {
    const row = await getRow(pool, token(req));
    if (row.state.current === 5)
      throw new GameError(409, "COMPLETE", "This journey is complete.");
    res.json({ scramble: scramble(row.puzzles[row.state.current].answer) });
  });
  app.get("/api/leaderboard", async (req, res) => {
    const { rows } = await pool.query(
      'SELECT nickname,score,completed_at AS "completedAt" FROM sessions WHERE completed_at IS NOT NULL AND nickname IS NOT NULL ORDER BY score DESC,completed_at ASC,token_hash ASC LIMIT 10',
    );
    res.json({ entries: rows.map((row, i) => ({ rank: i + 1, ...row })) });
  });
  app.use("/api", (req, res) =>
    res
      .status(404)
      .json({
        error: { code: "NOT_FOUND", message: "API endpoint not found." },
      }),
  );
  app.use(
    express.static(fileURLToPath(new URL("../client/dist/", import.meta.url))),
  );
  app.use((req, res) => res.status(404).send("Page not found."));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const malformed =
      error.type === "entity.parse.failed" || error.type === "entity.too.large";
    const status =
      error.status && error instanceof GameError
        ? error.status
        : malformed
          ? 400
          : 503;
    if (status === 503)
      console.error("Request failed:", error.code || error.name); // Do not log tokens/connection strings.
    res
      .status(status)
      .json({
        error: {
          code:
            error instanceof GameError
              ? error.code
              : malformed
                ? "INVALID_JSON"
                : "UNAVAILABLE",
          message:
            error instanceof GameError
              ? error.message
              : malformed
                ? "Send a small, valid JSON request."
                : "The journey could not be saved. Please retry in a moment.",
        },
      });
  });
  return app;
}
