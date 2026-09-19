"use client";

import { Home, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";
import { formatTime } from "./GameTimer";
export function Results() {
  const game = useGame();
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-4xl text-center">
        <div className="mx-auto grid size-16 place-items-center border border-primary text-primary">
          <Trophy className="size-7" />
        </div>
        <p className="eyebrow mt-7">Case closed · 005</p>
        <h1 className="mt-3 font-display text-5xl text-foreground md:text-8xl">
          Mystery solved.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Exceptional work, <span className="text-foreground">{game.name}</span>
          .
        </p>
        <div className="my-10 grid gap-px bg-border border border-border sm:grid-cols-3">
          <Result label="Secret word" value={game.word}/>
          <Result label="Puzzles" value="5 / 5" />
          <Result label="Completion time" value={formatTime(game.elapsed)} />
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="investigate"
            size="lg"
            onClick={() => game.setScreen("leaderboard")}
          >
            <Trophy />
            View leaderboard
          </Button>
          <Button variant="outline" size="lg" onClick={game.playAgain}>
            <RotateCcw />
            Play again
          </Button>
          <Button variant="ghost" size="lg" onClick={game.goHome}>
            <Home />
            Return home
          </Button>
        </div>
      </div>
    </main>
  );
}
function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card p-7">
      <p className="text-[10px] uppercase tracking-[.2em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 font-display text-3xl text-foreground">{value}</p>
    </div>
  );
}
