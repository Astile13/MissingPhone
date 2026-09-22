import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import pg from "pg";
import { migrate } from "../database/migrate.js";
import { createApp } from "../server/app.js";
import { createSession, getSession } from "../server/store.js";
import { loadDestinations } from "../server/data/validate.js";
let pool, admin, server, base, schema;
const puzzles = loadDestinations();
before(async () => {
  if (!process.env.TEST_DATABASE_URL)
    throw new Error(
      "Set TEST_DATABASE_URL to a disposable PostgreSQL database. Integration tests are not silently skipped.",
    );
  schema = `test_${randomUUID().replaceAll("-", "")}`;
  admin = new pg.Pool({ connectionString: process.env.TEST_DATABASE_URL });
  await admin.query(`CREATE SCHEMA ${schema}`);
  pool = new pg.Pool({
    connectionString: process.env.TEST_DATABASE_URL,
    options: `-c search_path=${schema}`,
    max: 5,
  });
  await migrate(pool);
  await migrate(pool);
  server = createApp(pool, { limit: 10000 }).listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  if (pool) await pool.end();
  if (admin) {
    if (schema) await admin.query(`DROP SCHEMA ${schema} CASCADE`);
    await admin.end();
  }
});
async function request(path, token, body) {
  const res = await fetch(`${base}/api${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { ...(await res.json()), status: res.status };
}
const action = (s, extra = {}) => ({
  requestId: randomUUID(),
  version: s.version,
  levelId: s.puzzle?.id,
  ...extra,
});
async function fresh() {
  return request("/sessions", null, {});
}
test("health and invalid session contract", async () => {
  assert.equal((await request("/health")).status, 200);
  assert.equal((await request("/session", "bad")).status, 401);
  assert.equal((await request("/absent")).status, 404);
});
test("atomic duplicate hints and wrong guesses cannot apply twice", async () => {
  const { token, session } = await fresh();
  const body = action(session);
  const responses = await Promise.all([
    request("/session/hint", token, body),
    request("/session/hint", token, body),
  ]);
  assert.deepEqual(
    responses.map((r) => r.status),
    [200, 200],
  );
  assert.equal(responses.filter((r) => r.replayed).length, 1);
  let s = (await request("/session", token)).session;
  assert.equal(s.hintsRemaining, 2);
  assert.equal(s.version, 1);
  const wrong = action(s, { answer: "AAAAA" });
  await Promise.all([
    request("/session/answer", token, wrong),
    request("/session/answer", token, wrong),
  ]);
  s = (await request("/session", token)).session;
  assert.equal(s.puzzle.wrongAnswers, 1);
  assert.equal(s.puzzle.potentialScore, 70);
});
test("different IDs using one version reject double-click; ID reuse is rejected", async () => {
  const { token, session } = await fresh();
  const a = action(session),
    b = action(session);
  const pair = await Promise.all([
    request("/session/hint", token, a),
    request("/session/hint", token, b),
  ]);
  assert.deepEqual(pair.map((r) => r.status).sort(), [200, 409]);
  assert.equal((await request("/session", token)).session.hintsRemaining, 2);
  const winner = pair[0].status === 200 ? a : b;
  assert.equal(
    (await request("/session/answer", token, { ...winner, answer: "PARIS" }))
      .error.code,
    "REUSED_REQUEST",
  );
});
test("complete API journey persists, ranks once and replays without advancing twice", async () => {
  const created = await fresh();
  const token = created.token;
  let s = created.session;
  assert.equal(
    (
      await request(
        "/session/nickname",
        token,
        action(s, { nickname: "Early" }),
      )
    ).error.code,
    "NOT_COMPLETE",
  );
  assert.equal(
    (await request("/session/answer", token, action(s, { answer: "PAR" })))
      .status,
    400,
  );
  assert.equal((await request("/session", token)).session.version, 0);
  let firstBody;
  for (const p of puzzles) {
    const body = action(s, { answer: p.answer, score: 999999 });
    if (!firstBody) firstBody = body;
    const pair = await Promise.all([
      request("/session/answer", token, body),
      request("/session/answer", token, body),
    ]);
    assert.ok(pair.every((r) => r.status === 200));
    s = (await request("/session", token)).session;
  }
  assert.equal(s.solvedCount, 5);
  assert.equal(s.totalScore, 500);
  assert.equal(s.breakdown.length, 5);
  const old = await request("/session/answer", token, firstBody);
  assert.equal(old.replayed, true);
  assert.equal(old.session.solvedCount, 5);
  const invalid = await request(
    "/session/nickname",
    token,
    action(s, { nickname: "<script>" }),
  );
  assert.equal(invalid.status, 400);
  const name = action(s, { nickname: "API Traveller" });
  const both = await Promise.all([
    request("/session/nickname", token, name),
    request("/session/nickname", token, name),
  ]);
  assert.ok(both.every((r) => r.status === 200));
  const entries = (await request("/leaderboard")).entries;
  assert.equal(entries.filter((e) => e.nickname === "API Traveller").length, 1);
  assert.ok(entries.every((e) => !("token" in e) && !("token_hash" in e)));
  // A new pool simulates a different process reading durable progress.
  const other = new pg.Pool({
    connectionString: process.env.TEST_DATABASE_URL,
    options: `-c search_path=${schema}`,
  });
  try {
    assert.equal((await getSession(other, token)).nickname, "API Traveller");
  } finally {
    await other.end();
  }
  assert.notEqual((await fresh()).token, token);
});
test("config edits affect new sessions, never an existing snapshot", async () => {
  const old = await createSession(pool, puzzles);
  const changed = structuredClone(puzzles);
  changed[0] = {
    ...changed[0],
    id: "rome",
    answer: "ROME",
    clue: "Capital of Italy",
  };
  const newer = await createSession(pool, changed);
  assert.equal((await getSession(pool, old.token)).puzzle.id, "paris");
  assert.equal(newer.session.puzzle.id, "rome");
  assert.equal(
    (
      await request(
        "/session/answer",
        old.token,
        action(old.session, { answer: "PARIS" }),
      )
    ).result.type,
    "correct",
  );
});
test("third wrong guess reveals clue; hint exhaustion and shuffle stay correct", async () => {
  const { token, session } = await fresh();
  let s = session;
  for (let i = 0; i < 3; i++) {
    s = (
      await request("/session/answer", token, action(s, { answer: "AAAAA" }))
    ).session;
    assert.equal(Boolean(s.puzzle.extraClue), i === 2);
  }
  for (let i = 0; i < 3; i++)
    s = (await request("/session/hint", token, action(s))).session;
  assert.equal((await request("/session/hint", token, action(s))).status, 422);
  const shuffled = await request("/session/shuffle", token, {});
  assert.notEqual(shuffled.scramble, "PARIS");
  assert.equal([...shuffled.scramble].sort().join(""), "AIPRS");
  assert.equal((await request("/session", token)).session.version, s.version);
});
test("leaderboard is limited to 10, score descending then earliest finish", async () => {
  const prefix = randomUUID().slice(0, 8);
  for (let i = 0; i < 12; i++) {
    const { token } = await createSession(pool, puzzles);
    const crypto = await import("node:crypto");
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    await pool.query(
      "UPDATE sessions SET score=$2,nickname=$3,completed_at=$4 WHERE token_hash=$1",
      [
        hash,
        i >= 10 ? 499 : 400 + i,
        `${prefix}-${i}`,
        new Date(2020, 0, i + 1),
      ],
    );
  }
  const entries = (await request("/leaderboard")).entries;
  assert.equal(entries.length, 10);
  for (let i = 1; i < entries.length; i++)
    assert.ok(entries[i - 1].score >= entries[i].score);
  const tie = entries.filter((e) => e.score === 499);
  assert.deepEqual(
    tie.map((e) => e.nickname),
    [`${prefix}-10`, `${prefix}-11`],
  );
  for (let i = 1; i < tie.length; i++)
    assert.ok(new Date(tie[i - 1].completedAt) <= new Date(tie[i].completedAt));
});
