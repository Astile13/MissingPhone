"use client";

export function GameProgress({ level, unlocked }: { level: number; unlocked: string[] }) { return <div className="flex items-center gap-2" aria-label={`Level ${level} of 5`}>{[1,2,3,4,5].map((item) => <span key={item} className={`grid size-7 place-items-center border text-[10px] font-bold transition-all ${item < level ? "border-primary bg-primary text-primary-foreground" : item === level ? "border-evidence text-evidence" : "border-border text-muted-foreground"}`}>{unlocked[item - 1] ?? String(item).padStart(2,"0")}</span>)}</div>; }
