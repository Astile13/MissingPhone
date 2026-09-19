"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, Fingerprint, Play, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";
const Shell = ({
  children,
  narrow = false,
}: {
  children: React.ReactNode;
  narrow?: boolean;
}) => (
  <main className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-12">
    <div className="scanline" />
    <div
      className={`relative z-10 w-full ${narrow ? "max-w-xl" : "max-w-5xl"}`}
    >
      {children}
    </div>
  </main>
);
export function LoadingScreen() {
  return (
    <Shell narrow>
      <div className="text-center">
        <div className="mx-auto mb-9 grid size-20 place-items-center border border-primary/40">
          <Eye className="size-9 text-primary animate-pulse" />
        </div>
        <div className="brand-mark justify-center text-5xl md:text-7xl">
          SECRET<span>5</span>
        </div>
        <p className="mt-4 text-sm uppercase tracking-[.32em] text-muted-foreground">
          Five puzzles. One mystery.
        </p>
        <div className="mx-auto mt-10 h-px w-64 overflow-hidden bg-border">
          <div className="h-full w-1/2 animate-loading bg-primary" />
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[.2em] text-primary">
          Decrypting case files
        </p>
      </div>
    </Shell>
  );
}
export function NameEntry() {
  const game = useGame();
  const [error, setError] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!game.name.trim()) {
      setError(true);
      game.playSound("error");
      return;
    }
    game.playSound("click");
    game.setScreen("home");
  };
  return (
    <Shell narrow>
      <form
        onSubmit={submit}
        className="border border-border bg-card/90 p-7 shadow-vault backdrop-blur md:p-12"
      >
        <Fingerprint className="mb-8 size-9 text-primary" />
        <p className="eyebrow">Identity verification</p>
        <h1 className="mt-3 font-display text-4xl text-foreground md:text-6xl">
          Welcome, detective.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Enter your field name to open the case.
        </p>
        <label
          className="mt-9 block text-xs font-bold uppercase tracking-[.16em] text-muted-foreground"
          htmlFor="name"
        >
          Detective name
        </label>
        <input
          id="name"
          autoFocus
          maxLength={22}
          value={game.name}
          onChange={(e) => {
            game.setName(e.target.value);
            setError(false);
          }}
          className="mt-2 h-14 w-full border border-input bg-input/30 px-4 text-lg text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Enter your name"
        />
        {error && (
          <p className="mt-2 text-sm text-destructive">
            A name is required to open the case.
          </p>
        )}
        <Button
          type="submit"
          variant="investigate"
          size="lg"
          className="mt-6 w-full"
        >
          Continue
          <ArrowRight />
        </Button>
      </form>
    </Shell>
  );
}
export function HomeMain() {
  const game = useGame();
  return (
    <Shell>
      <div className="grid items-end gap-12 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-10 bg-primary" />
            <p className="eyebrow">Case no. 005 · Classified</p>
          </div>
          <div className="brand-mark text-7xl sm:text-8xl md:text-9xl">
            SECRET<span>5</span>
          </div>
          <p className="mt-5 font-display text-2xl italic text-muted-foreground md:text-3xl">
            Five puzzles. One mystery.
          </p>
          <p className="mt-8 max-w-xl text-base leading-8 text-muted-foreground">
            Five sealed gallery exhibits hide five letters. Reconstruct every
            scene, recover the cipher, and close the case before anyone else.
          </p>
        </div>
        <div className="border-l border-border pl-7">
          <p className="mb-6 text-xs uppercase tracking-[.2em] text-muted-foreground">
            Assigned to <span className="text-foreground">{game.name}</span>
          </p>
          <div className="flex flex-col gap-3">
            <Button
              variant="investigate"
              size="xl"
              onClick={() => {
                game.playSound("click");
                game.setScreen("briefing");
              }}
            >
              <Play />
              Play game
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => game.setScreen("instructions")}
            >
              <ScanLine />
              How to play
            </Button>
            <Button
              variant="ghost"
              onClick={() => game.setScreen("leaderboard")}
            >
              View leaderboard
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
export function Briefing() {
  const game = useGame();
  return (
    <Shell narrow>
      <div className="border border-border bg-card p-8 shadow-vault md:p-12">
        <p className="eyebrow">Mission briefing · Eyes only</p>
        <h1 className="mt-3 font-display text-5xl text-foreground">
          The gallery is hiding something.
        </h1>
        <div className="my-8 h-px bg-border" />
        <div className="space-y-5 text-lg leading-8 text-muted-foreground">
          <p>Five hidden clues are waiting inside the gallery.</p>
          <p>
            Solve each image puzzle to uncover a letter. Collect all five and
            rearrange them to discover the secret word.
          </p>
          <p className="text-foreground">
            Complete the investigation as quickly as possible.
          </p>
        </div>
        <Button
          variant="investigate"
          size="lg"
          className="mt-10 w-full"
          onClick={() => game.setScreen("instructions")}
        >
          Continue
          <ArrowRight />
        </Button>
      </div>
    </Shell>
  );
}
export function Instructions() {
  const game = useGame();
  const rules = [
    "Drag each fragment onto the puzzle board.",
    "Correct fragments snap and lock into place.",
    "Incorrect fragments return to the evidence tray.",
    "Pieces never rotate. Attempts are unlimited.",
    "Every solved scene reveals one letter.",
    "Rearrange all five letters to solve the case.",
  ];
  return (
    <Shell>
      <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
        <div>
          <p className="eyebrow">Field manual</p>
          <h1 className="mt-3 font-display text-5xl text-foreground md:text-6xl">
            How to investigate.
          </h1>
          <p className="mt-6 leading-7 text-muted-foreground">
            Your total time begins when you enter the first gallery and ends
            only when the secret word is correct.
          </p>
        </div>
        <div className="border border-border bg-card p-6 md:p-9">
          <ol className="grid gap-px bg-border sm:grid-cols-2">
            {rules.map((rule, i) => (
              <li key={rule} className="flex gap-4 bg-card p-5">
                <span className="font-mono text-xs text-primary">0{i + 1}</span>
                <span className="text-sm leading-6 text-muted-foreground">
                  {rule}
                </span>
              </li>
            ))}
          </ol>
          <Button
            variant="investigate"
            size="xl"
            className="mt-7 w-full"
            onClick={game.startGame}
          >
            Start game
            <ArrowRight />
          </Button>
        </div>
      </div>
    </Shell>
  );
}
