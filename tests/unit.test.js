import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeAnswer,
  scramble,
  levelScore,
  initialState,
  applyAction,
  publicSession,
} from "../server/game.js";
import {
  loadDestinations,
  validateDestinations,
} from "../server/data/validate.js";
const puzzles = loadDestinations();
const row = () => ({
  puzzles: structuredClone(puzzles),
  state: initialState(puzzles),
  version: 0,
  score: 0,
  nickname: null,
  completed_at: null,
});
test("answers trim whitespace and ignore case without accepting internal spaces", () => {
  assert.equal(normalizeAnswer("  pArIs \n"), "PARIS");
  assert.equal(normalizeAnswer("par is"), "PAR IS");
  const r = row();
  assert.equal(
    applyAction(r, "answer", { levelId: "paris", answer: " paris " }).type,
    "correct",
  );
});
test("repeated-letter shuffles preserve multiset and never show solved order", () => {
  for (const answer of ["LONDON", "SANTORINI", "AAAAAAAAAB", "PARIS"])
    for (let n = 0; n < 200; n++) {
      const value = scramble(answer);
      assert.notEqual(value, answer);
      assert.equal([...value].sort().join(""), [...answer].sort().join(""));
    }
  assert.notEqual(
    scramble("LONDON", (max) => max - 1),
    "LONDON",
  );
});
test("score penalties and zero floor", () => {
  assert.equal(levelScore(0, 0), 100);
  assert.equal(levelScore(3, 2), 30);
  assert.equal(levelScore(40, 3), 0);
});
test("incomplete, empty, long and non-letter submissions incur no penalty", () => {
  const r = row();
  for (const answer of ["", "  ", "PAR", "PARISS", "PA!IS"])
    assert.throws(
      () => applyAction(r, "answer", { levelId: "paris", answer }),
      { code: "INVALID_ANSWER" },
    );
  assert.equal(r.state.levels[0].wrong, 0);
});
test("three global paid hints reveal positions; a fourth is rejected", () => {
  const r = row();
  for (let n = 0; n < 3; n++) applyAction(r, "hint", { levelId: "paris" });
  assert.deepEqual(publicSession(r).puzzle.revealed, [
    "P",
    "A",
    "R",
    null,
    null,
  ]);
  assert.throws(() => applyAction(r, "hint", { levelId: "paris" }), {
    code: "NO_HINTS",
  });
  applyAction(r, "answer", { levelId: "paris", answer: "PARIS" });
  assert.equal(r.score, 40);
  assert.equal(r.state.hintsRemaining, 0);
  assert.throws(() => applyAction(r, "hint", { levelId: "jaipur" }), {
    code: "NO_HINTS",
  });
});
test("extra clue appears after exactly three wrong guesses with no hint cost", () => {
  const r = row();
  for (let n = 0; n < 2; n++)
    applyAction(r, "answer", { levelId: "paris", answer: "AAAAA" });
  assert.equal(publicSession(r).puzzle.extraClue, null);
  applyAction(r, "answer", { levelId: "paris", answer: "AAAAA" });
  assert.equal(publicSession(r).puzzle.extraClue, puzzles[0].extraClue);
  assert.equal(r.state.hintsRemaining, 3);
  assert.equal(publicSession(r).puzzle.potentialScore, 70);
});
test("five levels complete once, score 500 and reject premature leaderboard", () => {
  const r = row();
  assert.throws(() => applyAction(r, "nickname", { nickname: "Riya" }), {
    code: "NOT_COMPLETE",
  });
  for (const p of puzzles)
    applyAction(r, "answer", { levelId: p.id, answer: p.answer });
  assert.equal(r.score, 500);
  assert.equal(publicSession(r).puzzle, null);
  assert.equal(r.state.current, 5);
  assert.throws(
    () =>
      applyAction(r, "answer", { levelId: "santorini", answer: "SANTORINI" }),
    { code: "COMPLETE" },
  );
  applyAction(r, "nickname", { nickname: "Riya" });
  assert.throws(() => applyAction(r, "nickname", { nickname: "Other" }), {
    code: "ALREADY_NAMED",
  });
});
test("configuration requires exact difficulty order, unique IDs/answers and clues", () => {
  assert.equal(validateDestinations(puzzles).length, 5);
  const edit = (fn) => {
    const p = structuredClone(puzzles);
    fn(p);
    return p;
  };
  assert.throws(() => validateDestinations(puzzles.slice(1)), /exactly five/);
  assert.throws(
    () => validateDestinations(edit((p) => (p[1].difficulty = "easy"))),
    /Destination 2.*medium/,
  );
  assert.throws(
    () => validateDestinations(edit((p) => (p[1].id = "paris"))),
    /id must be unique/,
  );
  assert.throws(
    () => validateDestinations(edit((p) => (p[1].answer = "PARIS"))),
    /answer must be unique/,
  );
  assert.throws(
    () => validateDestinations(edit((p) => (p[4].extraClue = " "))),
    /extraClue/,
  );
  assert.throws(
    () => validateDestinations(edit((p) => (p[0].answer = "AAAA"))),
    /distinct/,
  );
});
test("snapshot stays independent of later configuration edits and responses hide answers", () => {
  const r = row();
  const old = r.puzzles[0].answer;
  const changed = structuredClone(puzzles);
  changed[0].answer = "ROME";
  assert.equal(r.puzzles[0].answer, old);
  const s = publicSession(r);
  assert.equal(s.puzzle.answer, undefined);
  assert.equal(s.puzzle.extraClue, null);
  assert.equal(s.breakdown.length, 0);
});
