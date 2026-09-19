"use client";

import { ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";
import { LeaderBoardTable } from "./LeaderBoardTable";
export function LeaderBoardMain() {
  const game = useGame();
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 md:px-8">
      <Button
        variant="ghost"
        onClick={() => game.setScreen(game.running ? "results" : "home")}
      >
        <ArrowLeft />
        Back
      </Button>
      <div className="mb-8 mt-12 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Hall of investigators</p>
          <h1 className="mt-2 font-display text-5xl text-foreground md:text-7xl">
            Leaderboard
          </h1>
        </div>
        <Trophy className="size-10 text-evidence" />
      </div>
      <LeaderBoardTable scores={game.scores} currentName={game.name} />
      <p className="mt-4 text-xs text-muted-foreground">
        Scores on this device · fastest completed investigations first
      </p>
    </main>
  );
}
