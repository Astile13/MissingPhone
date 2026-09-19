"use client";

import { Clock3 } from "lucide-react";
export function formatTime(total: number) {
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
export function GameTimer({ elapsed }: { elapsed: number }) {
  return (
    <div
      className="flex items-center gap-2 font-mono text-sm text-foreground"
      aria-label={`Elapsed time ${formatTime(elapsed)}`}
    >
      <Clock3 className="size-4 text-primary" />
      <span>{formatTime(elapsed)}</span>
    </div>
  );
}
