"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type Screen =
  | "loading"
  | "name"
  | "home"
  | "briefing"
  | "instructions"
  | "game"
  | "final"
  | "results"
  | "leaderboard";
export type Score = { name: string; time: number; date: string };

type GameState = {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  name: string;
  setName: (name: string) => void;
  level: number;
  unlocked: string[];
  elapsed: number;
  running: boolean;
  muted: boolean;
  startGame: () => void;
  finishLevel: () => void;
  advanceLevel: () => void;
  solve: () => void;
  playAgain: () => void;
  goHome: () => void;
  toggleMuted: () => void;
  playSound: (type: "click" | "snap" | "error" | "success") => void;
  scores: Score[];
};

const GameContext = createContext<GameState | null>(null);
const LETTERS = ["S", "U", "Q", "T", "E"];
const SAMPLE_SCORES: Score[] = [
  { name: "A. MORROW", time: 196, date: "09.18.26" },
  { name: "NIGHTJAR", time: 243, date: "09.17.26" },
  { name: "V. SHAH", time: 271, date: "09.16.26" },
  { name: "BLUE FOX", time: 318, date: "09.14.26" },
];

export function GameProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>("loading");
  const [name, setName] = useState("");
  const [level, setLevel] = useState(1);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [muted, setMuted] = useState(false);
  const startedAt = useRef(0);
  const audio = useRef<AudioContext | null>(null);
  const bgMusic = useRef<HTMLAudioElement | null>(null);

  const [scores, setScores] = useState<Score[]>(() => {
  if (typeof window === "undefined") return SAMPLE_SCORES;
  try {
    const stored = window.localStorage.getItem("secret5-scores");
    if (stored) return [...SAMPLE_SCORES, ...(JSON.parse(stored) as Score[])];
  } catch { /* ignore invalid local data */ }
  return SAMPLE_SCORES;
});

  useEffect(() => {
    const track = new Audio("/audio/audio.mp3");
    track.loop = true;
    track.volume = 0.20;
    track.muted = muted;
    bgMusic.current = track;
    const tryPlay = () => {
      track.play().catch(() => {
        /* blocked until user gesture */
      });
    };
    tryPlay();
    document.addEventListener("click", tryPlay);
    document.addEventListener("keydown", tryPlay);
    return () => {
      document.removeEventListener("click", tryPlay);
      document.removeEventListener("keydown", tryPlay);
      track.pause();
      bgMusic.current = null;
    };
  }, []);
  useEffect(() => {
    if (bgMusic.current) bgMusic.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    const id = window.setTimeout(() => setScreen("name"), 1700);
    return () => window.clearTimeout(id);
  }, []);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () => setElapsed(Math.floor((Date.now() - startedAt.current) / 1000)),
      250,
    );
    return () => window.clearInterval(id);
  }, [running]);
  

  const playSound = useCallback(
    (type: "click" | "snap" | "error" | "success") => {
      if (muted) return;
      const AudioCtor = window.AudioContext ?? window.webkitAudioContext;
      if (!AudioCtor) return;
      audio.current ??= new AudioCtor();
      const ctx = audio.current;
      const now = ctx.currentTime;
      const notes =
        type === "success"
          ? [523, 659, 784]
          : [type === "snap" ? 660 : type === "error" ? 170 : 350];
      notes.forEach((frequency, index) => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = type === "error" ? "sawtooth" : "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, now + index * 0.8);
        gain.gain.exponentialRampToValueAtTime(0.09, now + index * 0.8 + 0.01);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          now + index * 0.8 + 0.14,
        );
        oscillator.connect(gain).connect(ctx.destination);
        oscillator.start(now + index * 0.8);
        oscillator.stop(now + index * 0.8 + 0.16);
      });
    },
    [muted],
  );
  const startGame = useCallback(() => {
    setLevel(1);
    setUnlocked([]);
    setElapsed(0);
    startedAt.current = Date.now();
    setRunning(true);
    setScreen("game");
    playSound("click");
  }, [playSound]);
  const finishLevel = useCallback(() => {
    setUnlocked((current) =>
      current.includes(LETTERS[level - 1] ?? "")
        ? current
        : [...current, LETTERS[level - 1] ?? ""],
    );
    playSound("success");
  }, [level, playSound]);
  const advanceLevel = useCallback(() => {
    if (level < 5) setLevel((current) => current + 1);
    else setScreen("final");
  }, [level]);
  const solve = useCallback(() => {
    setRunning(false);
    setScreen("results");
    const score = {
      name,
      time: elapsed,
      date: new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      }),
    };
    setScores((current) => [...current, score]);
    const old = JSON.parse(
      window.localStorage.getItem("secret5-scores") ?? "[]",
    ) as Score[];
    window.localStorage.setItem(
      "secret5-scores",
      JSON.stringify([...old, score]),
    );
    playSound("success");
  }, [elapsed, name, playSound]);
  const playAgain = useCallback(() => {
    setScreen("instructions");
    setLevel(1);
    setUnlocked([]);
    setElapsed(0);
    setRunning(false);
  }, []);
  const goHome = useCallback(() => {
    setRunning(false);
    setLevel(1);
    setUnlocked([]);
    setElapsed(0);
    setScreen("home");
  }, []);
  const value = useMemo(
    () => ({
      screen,
      setScreen,
      name,
      setName,
      level,
      unlocked,
      elapsed,
      running,
      muted,
      scores,
      startGame,
      finishLevel,
      advanceLevel,
      solve,
      playAgain,
      goHome,
      toggleMuted: () => setMuted((v) => !v),
      playSound,
    }),
    [
      screen,
      name,
      level,
      unlocked,
      elapsed,
      running,
      muted,
      scores,
      startGame,
      finishLevel,
      advanceLevel,
      solve,
      playAgain,
      goHome,
      playSound,
    ],
  );
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
export function useGame() {
  const value = useContext(GameContext);
  if (!value) throw new Error("useGame must be used inside GameProvider");
  return value;
}
