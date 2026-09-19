"use client";

import { PuzzleLevel } from "./PuzzleLevel"; export function Level5(p: { resetKey:number; onSolved:()=>void }) { return <PuzzleLevel config={{level:5,cols:4,rows:4,letter:"E",title:"The Last Vault",location:"Restricted Floor",image: "/puzzles/puzzle-5.jpg"}} {...p}/>; }
