// All entries must be uppercase, 5 letters.
// FinalWord checks the answer with an exact string match, so avoid words with a
// common anagram (TRACE/CRATE, MANGO/AMONG, GHOST/GOTHS), since the player
// could build the other word and be marked wrong.
export const WORD_BANK: readonly string[] = [
  "QUEST", "ALIBI", "CLOAK", "CRIME", "PROOF", "PROBE", "WITCH",
  "RAVEN", "CROWN", "VAULT", "QUILT", "BRICK", "CLOUD", "PIANO",
  "JOKER", "KNIFE", "FLAME", "WORLD", "GLYPH", "MIRTH", "ZEBRA",
];

/** Random word from the bank, never the same one as `previous`. */
export function pickWord(previous?: string): string {
  const pool = WORD_BANK.filter((w) => w !== previous);
  return pool[Math.floor(Math.random() * pool.length)] ?? "QUEST";
}

/** Fisher–Yates shuffle that never returns `avoid` (the solved word). */
export function shuffleLetters(letters: readonly string[], avoid: string): string[] {
  const out = [...letters];
  if (new Set(out).size < 2) return out; // can't shuffle "AAAAA" into anything else
  do {
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const a = out[i];
      const b = out[j];
      if (a === undefined || b === undefined) continue;
      out[i] = b;
      out[j] = a;
    }
  } while (out.join("") === avoid);
  return out;
}