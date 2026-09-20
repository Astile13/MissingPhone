import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
export function validateDestinations(levels) {
  if (!Array.isArray(levels) || levels.length !== 5)
    throw new Error("Destinations: exactly five levels are required.");
  const order = ["easy", "medium", "medium", "hard", "hard"];
  const ids = new Set(),
    answers = new Set();
  levels.forEach((level, i) => {
    const fail = (message) => {
      throw new Error(`Destination ${i + 1}: ${message}`);
    };
    if (!level || typeof level !== "object") fail("must be an object.");
    if (!/^[a-z0-9-]{1,40}$/.test(level.id ?? "") || ids.has(level.id))
      fail("id must be unique, 1–40 lowercase letters, digits or hyphens.");
    if (
      typeof level.answer !== "string" ||
      !/^[A-Z]{2,16}$/.test(level.answer) ||
      new Set(level.answer).size < 2
    )
      fail(
        "answer must contain 2–16 uppercase A–Z letters and at least two distinct letters.",
      );
    if (answers.has(level.answer)) fail("answer must be unique.");
    if (level.difficulty !== order[i])
      fail(
        `difficulty must be ${order[i]} (Easy → Medium → Medium → Hard → Hard).`,
      );
    for (const key of ["clue", "extraClue"])
      if (
        typeof level[key] !== "string" ||
        !level[key].trim() ||
        level[key].length > 240
      )
        fail(`${key} must be non-empty text up to 240 characters.`);
    ids.add(level.id);
    answers.add(level.answer);
  });
  return levels;
}
export const loadDestinations = () =>
  validateDestinations(
    JSON.parse(
      readFileSync(new URL("./destinations.json", import.meta.url), "utf8"),
    ),
  );
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  loadDestinations();
  console.log(
    "Five destination definitions valid. No database seed rows are needed; new sessions snapshot this file.",
  );
}
