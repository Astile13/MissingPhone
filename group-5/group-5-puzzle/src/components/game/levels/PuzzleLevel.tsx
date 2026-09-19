"use client";

import {  useMemo, useState, type DragEvent } from "react";
import { Check, Grip, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";

function shuffleIds(ids: number[], seed: number) {
  const copy = [...ids];
  let state = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const j = state % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export type LevelConfig = {
  level: number;
  cols: number;
  rows: number;
  letter: string;
  title: string;
  location: string;
  image: string;
};
export function PuzzleLevel({
  config,
  resetKey,
  onSolved,
}: {
  config: LevelConfig;
  resetKey: number;
  onSolved: () => void;
}) {
  const game = useGame();
  const ids = useMemo(
    () => Array.from({ length: config.cols * config.rows }, (_, i) => i),
    [config.cols, config.rows],
  );

  const [prevIds, setPrevIds] = useState(ids);
const [shuffled, setShuffled] = useState<number[]>(() => shuffleArray(ids));
if (ids !== prevIds) { setPrevIds(ids); setShuffled(shuffleArray(ids)); }

  const [placed, setPlaced] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const solved = placed.length === ids.length;
  const place = (slot: number, piece: number) => {
    if (slot === piece && !placed.includes(piece)) {
      const next = [...placed, piece];
      setPlaced(next);
      setSelected(null);
      game.playSound("snap");
      if (next.length === ids.length)
        window.setTimeout(() => {
          game.finishLevel();
          onSolved();
        }, 450);
    } else {
      game.playSound("error");
      setSelected(null);
    }
  };
  const drag = (event: DragEvent, id: number) =>
    event.dataTransfer.setData("text/plain", String(id));
  return (
    <main
      className="mx-auto w-full max-w-[1480px] px-4 py-6 md:px-8 md:py-10"
      key={resetKey}
    >
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">
            Case file {String(config.level).padStart(2, "0")} ·{" "}
            {config.location}
          </p>
          <h1 className="mt-2 font-display text-3xl text-foreground md:text-5xl">
            {config.title}
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[.16em] text-muted-foreground">
          <ScanLine className="size-4 text-primary" />
          {placed.length} / {ids.length} fragments secured
        </div>
      </div>
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
        <section className="relative overflow-hidden border border-border bg-board p-2 shadow-vault">
          <div
            className="grid aspect-[3/2] w-full gap-1"
            style={{
              gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
            }}
          >
            {ids.map((id) => {
              const col = id % config.cols;
              const row = Math.floor(id / config.cols);
              const isPlaced = placed.includes(id);
              return (
                <button
                  type="button"
                  key={id}
                  aria-label={`Puzzle position ${id + 1}${isPlaced ? ", filled" : ""}`}
                  disabled={isPlaced || solved}
                  onClick={() => selected !== null && place(id, selected)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) =>
                    place(id, Number(event.dataTransfer.getData("text/plain")))
                  }
                  className={`relative min-h-0 border transition-all ${isPlaced ? "border-transparent" : selected !== null ? "border-primary/60 bg-primary/10" : "border-border bg-slot"}`}
                  style={
                    isPlaced
                      ? {
                          backgroundImage: `url(${config.image})`,
                          backgroundSize: `${config.cols * 100}% ${config.rows * 100}%`,
                          backgroundPosition: `${config.cols === 1 ? 0 : (col / (config.cols - 1)) * 100}% ${config.rows === 1 ? 0 : (row / (config.rows - 1)) * 100}%`,
                        }
                      : undefined
                  }
                >
                  {isPlaced && (
                    <Check className="absolute right-1 top-1 size-3 text-primary opacity-0" />
                  )}
                </button>
              );
            })}
          </div>
        </section>
        <aside className="border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="eyebrow">Evidence tray</p>
              <h2 className="mt-1 text-sm font-semibold text-foreground">
                Select or drag a fragment
              </h2>
            </div>
            <Grip className="size-5 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3">
            {shuffled.map((id) => {
              if (placed.includes(id))
                return (
                  <div
                    key={id}
                    className="aspect-[3/2] border border-dashed border-border bg-slot/40"
                  />
                );
              const col = id % config.cols;
              const row = Math.floor(id / config.cols);
              return (
                <button
                  key={id}
                  type="button"
                  draggable
                  onDragStart={(e) => drag(e, id)}
                  onClick={() => {
                    setSelected(id);
                    game.playSound("click");
                  }}
                  aria-pressed={selected === id}
                  aria-label={`Select fragment ${id + 1}`}
                  className={`aspect-[3/2] cursor-grab border bg-no-repeat shadow-piece transition-all active:cursor-grabbing ${selected === id ? "border-evidence ring-2 ring-evidence/30" : "border-border hover:border-primary"}`}
                  style={{
                    backgroundImage: `url(${config.image})`,
                    backgroundSize: `${config.cols * 100}% ${config.rows * 100}%`,
                    backgroundPosition: `${config.cols === 1 ? 0 : (col / (config.cols - 1)) * 100}% ${config.rows === 1 ? 0 : (row / (config.rows - 1)) * 100}%`,
                  }}
                />
              );
            })}
          </div>
          <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
            A correct fragment locks in place. Incorrect placements return here.
          </p>
        </aside>
      </div>
      {solved && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-overlay p-4">
          <div className="border border-primary bg-card px-12 py-10 text-center shadow-glow animate-scale-in">
            <p className="eyebrow">Puzzle solved · Letter unlocked</p>
            <div className="my-4 font-display text-8xl text-primary">
              {config.letter}
            </div>
            <p className="text-sm text-muted-foreground">
              Evidence added to your case file
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
