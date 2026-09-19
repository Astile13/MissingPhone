"use client";

import { PuzzleLevel } from "./PuzzleLevel"; export function Level3(p: { resetKey:number; onSolved:()=>void }) { return <PuzzleLevel config={{level:3,cols:3,rows:3,letter:"Q",title:"The Midnight Laboratory",location:"Sublevel III",image: "/puzzles/puzzle-3.jpg"}} {...p}/>; }
