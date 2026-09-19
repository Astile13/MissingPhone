"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { LoadingScreen, NameEntry, HomeMain, Briefing, Instructions } from "@/components/home/HomeMain";
import { GameHeader } from "./GameHeader";
import { Level1 } from "./levels/Level1"; import { Level2 } from "./levels/Level2"; import { Level3 } from "./levels/Level3"; import { Level4 } from "./levels/Level4"; import { Level5 } from "./levels/Level5";
import { FinalWord } from "./FinalWord"; import { Results } from "./Results"; import { LeaderBoardMain } from "@/components/leaderboard/LeaderBoardMain"; import { RestartModal } from "@/components/modals/RestartModal"; import { ExitModal } from "@/components/modals/ExitModal";

const LEVELS = [Level1, Level2, Level3, Level4, Level5];
export function Secret5Game() {
  const game = useGame(); const [modal, setModal] = useState<"restart" | "exit" | null>(null); const [resetKey, setResetKey] = useState(0);
  if (game.screen === "loading") return <LoadingScreen />; if (game.screen === "name") return <NameEntry />; if (game.screen === "home") return <HomeMain />;
  if (game.screen === "briefing") return <Briefing />; if (game.screen === "instructions") return <Instructions />; if (game.screen === "final") return <><GameHeader onRestart={() => {}} onExit={() => setModal("exit")}/><FinalWord />{modal === "exit" && <ExitModal onCancel={() => setModal(null)} onConfirm={() => { setModal(null); game.goHome(); }}/>}</>;
  if (game.screen === "results") return <Results />; if (game.screen === "leaderboard") return <LeaderBoardMain />;
  const Level = LEVELS[game.level - 1] ?? Level1;
  return <div className="min-h-screen"><GameHeader onRestart={() => setModal("restart")} onExit={() => setModal("exit")}/><Level resetKey={resetKey} onSolved={game.advanceLevel}/>{modal === "restart" && <RestartModal onCancel={() => setModal(null)} onConfirm={() => { setResetKey((k) => k + 1); setModal(null); game.playSound("click"); }}/>} {modal === "exit" && <ExitModal onCancel={() => setModal(null)} onConfirm={() => { setModal(null); game.goHome(); }}/>}</div>;
}