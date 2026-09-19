"use client";

import { Medal } from "lucide-react";
import { formatTime } from "@/components/game/GameTimer";
import type { Score } from "@/context/GameContext";
export function LeaderBoardTable({
  scores,
  currentName,
}: {
  scores: Score[];
  currentName: string;
}) {
  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full min-w-[520px] text-left">
        <thead className="bg-surface text-[10px] uppercase tracking-[.2em] text-muted-foreground">
          <tr>
            <th className="px-5 py-4">Rank</th>
            <th className="px-5 py-4">Detective</th>
            <th className="px-5 py-4">Time</th>
            <th className="px-5 py-4">Closed</th>
          </tr>
        </thead>
        <tbody>
          {[...scores]
            .sort((a, b) => a.time - b.time)
            .map((score, i) => (
              <tr
                key={`${score.name}-${score.time}-${i}`}
                className={`border-t border-border ${score.name === currentName ? "bg-primary/10" : "bg-card"}`}
              >
                <td className="px-5 py-4 font-mono text-sm">
                  {i < 3 ? (
                    <Medal className="size-4 text-evidence" />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-foreground">
                  {score.name}
                </td>
                <td className="px-5 py-4 font-mono text-primary">
                  {formatTime(score.time)}
                </td>
                <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                  {score.date}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
