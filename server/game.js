import { randomInt } from "node:crypto";
export class GameError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
export const normalizeAnswer = (answer) =>
  typeof answer === "string" ? answer.trim().toUpperCase() : "";
export const levelScore = (wrong, hints) =>
  Math.max(0, 100 - 10 * wrong - 20 * hints);
// Bounded Fisher–Yates, then a guaranteed different rotation (validated words have >=2 distinct letters).
export function scramble(answer, rng = (max) => randomInt(max)) {
  const letters = [...answer];
  for (let i = letters.length - 1; i > 0; i--) {
    const j = rng(i + 1);
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  if (letters.join("") === answer) {
    do {
      letters.push(letters.shift());
    } while (letters.join("") === answer);
  }
  return letters.join("");
}
export function initialState(puzzles) {
  return {
    current: 0,
    hintsRemaining: 3,
    levels: puzzles.map((p) => ({
      wrong: 0,
      hints: 0,
      score: null,
      scramble: scramble(p.answer),
    })),
  };
}
export function publicSession(row) {
  const s = row.state,
    completed = s.current === 5;
  const p = completed ? null : row.puzzles[s.current];
  const l = completed ? null : s.levels[s.current];
  return {
    version: row.version,
    level: Math.min(5, s.current + 1),
    completed,
    solvedCount: s.current,
    hintsRemaining: s.hintsRemaining,
    totalScore: row.score,
    nickname: row.nickname,
    completedAt: row.completed_at,
    puzzle: p
      ? {
          id: p.id,
          difficulty: p.difficulty,
          clue: p.clue,
          extraClue: l.wrong >= 3 ? p.extraClue : null,
          length: p.answer.length,
          scramble: l.scramble,
          revealed: [...p.answer].map((c, i) => (i < l.hints ? c : null)),
          wrongAnswers: l.wrong,
          paidHints: l.hints,
          potentialScore: levelScore(l.wrong, l.hints),
        }
      : null,
    breakdown: s.levels
      .slice(0, s.current)
      .map((l, i) => ({
        level: i + 1,
        destination: row.puzzles[i].answer,
        wrongAnswers: l.wrong,
        paidHints: l.hints,
        score: l.score,
      })),
  };
}
export function applyAction(row, kind, body) {
  const s = row.state;
  if (kind === "nickname") {
    if (s.current !== 5)
      throw new GameError(
        409,
        "NOT_COMPLETE",
        "Finish all five destinations before submitting a nickname.",
      );
    if (row.nickname !== null)
      throw new GameError(
        409,
        "ALREADY_NAMED",
        "This journey already has a leaderboard entry.",
      );
    const name = typeof body.nickname === "string" ? body.nickname.trim() : "";
    if (!/^[A-Za-z0-9 _-]{2,20}$/.test(name))
      throw new GameError(
        400,
        "INVALID_NICKNAME",
        "Use 2–20 letters, numbers, spaces, underscores or hyphens.",
      );
    row.nickname = name;
    return { type: "nickname", message: "Your journey is on the leaderboard!" };
  }
  if (s.current >= 5)
    throw new GameError(
      409,
      "COMPLETE",
      "This phone is already unlocked. Start a new journey.",
    );
  const p = row.puzzles[s.current],
    l = s.levels[s.current];
  if (body.levelId !== p.id)
    throw new GameError(
      409,
      "STALE_LEVEL",
      "This puzzle has changed. Refresh your saved journey.",
    );
  if (kind === "hint") {
    if (s.hintsRemaining <= 0 || l.hints >= p.answer.length)
      throw new GameError(
        422,
        "NO_HINTS",
        "No paid hints remain for this puzzle. Keep trying; the clue is free.",
      );
    l.hints++;
    s.hintsRemaining--;
    return {
      type: "hint",
      message: `Letter ${l.hints} is ${p.answer[l.hints - 1]}. This hint costs 20 points.`,
    };
  }
  const answer = normalizeAnswer(body.answer);
  if (!/^[A-Z]+$/.test(answer) || answer.length !== p.answer.length)
    throw new GameError(
      400,
      "INVALID_ANSWER",
      `Enter a ${p.answer.length}-letter destination using A–Z. No points lost.`,
    );
  if (answer !== p.answer) {
    l.wrong++;
    return {
      type: "incorrect",
      message:
        l.wrong >= 3
          ? "Not quite. Your extra clue is now available—keep exploring!"
          : "Not quite. Try another destination—you have unlimited attempts.",
    };
  }
  l.score = levelScore(l.wrong, l.hints);
  row.score += l.score;
  s.current++;
  if (s.current === 5) row.completed_at = new Date().toISOString();
  return { type: "correct", message: `${p.answer} found! +${l.score} points.` };
}
