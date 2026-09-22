// Runs against an already-started disposable server. Creates public test scores.
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
const base = process.env.E2E_BASE_URL || "http://127.0.0.1:3000";
const places = ["PARIS", "JAIPUR", "LONDON", "BARCELONA", "SANTORINI"];
async function call(path, token, body) {
  const response = await fetch(`${base}/api${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { ...(await response.json()), status: response.status };
}
const action = (s, extra = {}) => ({
  requestId: randomUUID(),
  version: s.version,
  levelId: s.puzzle?.id,
  ...extra,
});
test("HTTP health, invalid tokens, no answer disclosure, empty answer and early nickname", async () => {
  assert.equal((await call("/health")).status, 200);
  assert.equal((await call("/session", "invalid")).status, 401);
  const { token, session } = await call("/sessions", null, {});
  assert.equal(session.puzzle.answer, undefined);
  assert.equal(session.puzzle.extraClue, null);
  assert.equal(
    (await call("/session/answer", token, action(session, { answer: "" })))
      .status,
    400,
  );
  assert.equal(
    (
      await call(
        "/session/nickname",
        token,
        action(session, { nickname: "Too soon" }),
      )
    ).status,
    409,
  );
  assert.equal((await call("/session", token)).session.version, 0);
});
test("HTTP duplicate/retried hint and optimistic version are enforced", async () => {
  const { token, session } = await call("/sessions", null, {});
  const body = action(session);
  const pair = await Promise.all([
    call("/session/hint", token, body),
    call("/session/hint", token, body),
  ]);
  assert.ok(pair.every((r) => r.status === 200));
  assert.equal(pair.filter((r) => r.replayed).length, 1);
  let s = (await call("/session", token)).session;
  assert.equal(s.hintsRemaining, 2);
  const different = await Promise.all([
    call("/session/hint", token, action(s)),
    call("/session/hint", token, action(s)),
  ]);
  assert.deepEqual(different.map((r) => r.status).sort(), [200, 409]);
  s = (await call("/session", token)).session;
  assert.equal(s.hintsRemaining, 1);
  assert.equal(
    (await call("/session/answer", token, { ...body, answer: "PARIS" })).error
      .code,
    "REUSED_REQUEST",
  );
});
test("HTTP clue thresholds, penalties, hint limit and duplicate answer progression", async () => {
  const { token, session } = await call("/sessions", null, {});
  let s = session;
  for (let i = 0; i < 3; i++) {
    s = (await call("/session/answer", token, action(s, { answer: "XXXXX" })))
      .session;
    assert.equal(Boolean(s.puzzle.extraClue), i === 2);
  }
  assert.equal(s.hintsRemaining, 3);
  for (let i = 0; i < 3; i++)
    s = (await call("/session/hint", token, action(s))).session;
  assert.equal((await call("/session/hint", token, action(s))).status, 422);
  assert.equal(s.puzzle.potentialScore, 10);
  const body = action(s, { answer: " paris " });
  const pair = await Promise.all([
    call("/session/answer", token, body),
    call("/session/answer", token, body),
  ]);
  assert.ok(pair.every((r) => r.status === 200));
  s = (await call("/session", token)).session;
  assert.equal(s.solvedCount, 1);
  assert.equal(s.totalScore, 10);
});
test("HTTP zero floor, five levels, score tampering ignored, leaderboard single entry and replay", async () => {
  const { token, session } = await call("/sessions", null, {});
  let s = session;
  for (let i = 0; i < 11; i++)
    s = (await call("/session/answer", token, action(s, { answer: "XXXXX" })))
      .session;
  for (const answer of places)
    s = (
      await call("/session/answer", token, action(s, { answer, score: 999999 }))
    ).session;
  assert.equal(s.completed, true);
  assert.equal(s.totalScore, 400);
  assert.equal(s.breakdown[0].score, 0);
  const nickname = `Smoke-${randomUUID().slice(0, 8)}`,
    body = action(s, { nickname });
  await Promise.all([
    call("/session/nickname", token, body),
    call("/session/nickname", token, body),
  ]);
  const board = await call("/leaderboard");
  assert.equal(board.entries.filter((e) => e.nickname === nickname).length, 1);
  assert.ok(board.entries.length <= 10);
  assert.ok(
    board.entries.every(
      (e) =>
        Object.keys(e).sort().join(",") === "completedAt,nickname,rank,score",
    ),
  );
  assert.notEqual((await call("/sessions", null, {})).token, token);
});
