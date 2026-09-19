"use client";

import { PuzzleLevel } from "./PuzzleLevel";
export function Level4(p: { resetKey: number; onSolved: () => void }) {
  return (
    <PuzzleLevel
      config={{
        level: 4,
        cols: 4,
        rows: 3,
        letter: "T",
        title: "The Hidden Chamber",
        location: "Eastern Vault",
        image: "/puzzles/puzzle-4.jpg",
      }}
      {...p}
    />
  );
}
