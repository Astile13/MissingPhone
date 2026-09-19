"use client";

import { useState, type DragEvent } from "react";
import { ArrowRight, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";
import { shuffleLetters } from "@/lib/words";
export function FinalWord() {
  const game = useGame();
  const [letters,setLetters]=useState<string[]>(game.scrambled);
  const [error, setError] = useState(false);
  const [dragged, setDragged] = useState<number | null>(null);
  const move = (from: number, to: number) => {
    const next = [...letters];
    const [item] = next.splice(from, 1);
    if (item === undefined) return;
    next.splice(to, 0, item);
    setLetters(next);
    setError(false);
    game.playSound("click");
  };
  const drop = (e: DragEvent, to: number) => {
    e.preventDefault();
    if (dragged !== null) move(dragged, to);
    setDragged(null);
  };
  return (
    <main className="grid min-h-[calc(100vh-66px)] place-items-center px-4 py-12">
      <div className="w-full max-w-4xl text-center">
        <p className="eyebrow">Final cipher · All evidence recovered</p>
        <h1 className="mt-4 font-display text-5xl text-foreground md:text-7xl">
          Name the mystery
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Rearrange the five recovered letters. The clock is still running.
        </p>
        <div className="my-12 grid grid-cols-5 gap-2 md:gap-5">
          {letters.map((letter, index) => (
            <button
              type="button"
              draggable
              key={`${letter}-${index}`}
              onDragStart={() => setDragged(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => drop(e, index)}
              onClick={() => index > 0 && move(index, index - 1)}
              className="letter-tile aspect-square font-display text-4xl text-foreground md:text-7xl"
              aria-label={`${letter}, position ${index + 1}`}
            >
              {letter}
            </button>
          ))}
        </div>
        {error && (
          <p className="mb-5 text-sm font-semibold uppercase tracking-[.18em] text-destructive animate-fade-in">
            Not quite. Rearrange the letters and try again.
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={()=>{setLetters(shuffleLetters(letters,game.word));setError(false)}}
          >
            <Shuffle />
            Shuffle
          </Button>
          <Button
            variant="investigate"
            size="lg"
            onClick={() => {
              if(letters.join("")===game.word) game.solve();
              else {
                setError(true);
                game.playSound("error");
              }
            }}
          >
            Submit answer
            <ArrowRight />
          </Button>
        </div>
      </div>
    </main>
  );
}
