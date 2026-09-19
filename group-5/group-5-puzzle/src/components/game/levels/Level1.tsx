"use client";

import { PuzzleLevel } from "./PuzzleLevel";
export function Level1(p: { resetKey: number; onSolved: () => void }) {
  return (
    <PuzzleLevel
      config={{
        level: 1,
        cols: 2,
        rows: 2,
        letter: "S",
        title: "The Locked Study",
        location: "West Wing",
        image: "/puzzles/puzzle-1.jpg",
      }}
      {...p}
    />
  );
}
