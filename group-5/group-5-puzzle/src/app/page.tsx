import type { Metadata } from "next";
import { GameProvider } from "@/context/GameContext";
import { Secret5Game } from "@/components/game/Secret5Game";

export const metadata: Metadata = {
  title: "SECRET5 — Five Puzzles. One Mystery.",
  description:
    "Solve five cinematic gallery puzzles, recover the letters, and uncover the secret word.",
  openGraph: {
    title: "SECRET5 — Five Puzzles. One Mystery.",
    description: "Solve five cinematic gallery puzzles and uncover the secret word.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Home() {
  return (
    <GameProvider>
      <Secret5Game />
    </GameProvider>
  );
}
