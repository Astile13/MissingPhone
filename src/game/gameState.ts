export type Screen = "lock" | "home" | "app";
export type NotesView = "list" | "detail" | "success";
export type GalleryView = "grid" | "viewer" | "success";
export type CalculatorView = "calculator" | "history" | "success";
export type CalculatorOperator = "+" | "-" | "×" | "÷";
export type MessagesView = "list" | "conversation" | "success";
export type MapsView = "overview" | "location" | "success";
export type MusicView = "playlist" | "success";
export type FilesView = "list" | "detail" | "success";
export type CalendarView = "month" | "day" | "event" | "success";
export type BrowserView = "search" | "results" | "page" | "success";
export type UnknownStage =
  | "matching"
  | "ordering"
  | "name"
  | "owner"
  | "ending"
  | "complete"
  | "review";

export type GameState = {
  introCompleted: boolean;
  currentScreen: Screen;
  phoneUnlocked: boolean;
  currentApp: number | null;
  currentNote: number | null;
  notesView: NotesView;
  currentPhoto: number | null;
  galleryView: GalleryView;
  galleryHintLevel: number;
  calculatorView: CalculatorView;
  calculatorHintLevel: number;
  calculatorDisplay: string;
  calculatorStoredValue: number | null;
  calculatorOperator: CalculatorOperator | null;
  calculatorWaitingForOperand: boolean;
  currentConversation: number | null;
  messagesView: MessagesView;
  messagesHintLevel: number;
  currentLocation: number | null;
  mapsView: MapsView;
  mapsHintLevel: number;
  selectedTrack: number | null;
  musicView: MusicView;
  musicHintLevel: number;
  currentFile: number | null;
  filesView: FilesView;
  filesSearch: string;
  filesHintLevel: number;
  currentCalendarDay: number | null;
  currentCalendarEvent: number | null;
  calendarView: CalendarView;
  calendarHintLevel: number;
  currentBrowserPage: number | null;
  browserView: BrowserView;
  browserQuery: string;
  browserHintLevel: number;
  unknownStage: UnknownStage;
  unknownSelectedClue: string | null;
  unknownMatchedClues: Record<string, string>;
  unknownOrder: string[];
  unknownEndingStep: number;
  unknownHintLevel: number;
  finalIdentity: string | null;
  gameCompleted: boolean;
  unlockedApps: number[];
  completedApps: number[];
  collectedClues: string[];
};

export const initialGameState: GameState = {
  introCompleted: false,
  currentScreen: "lock",
  phoneUnlocked: false,
  currentApp: null,
  currentNote: null,
  notesView: "list",
  currentPhoto: null,
  galleryView: "grid",
  galleryHintLevel: 0,
  calculatorView: "calculator",
  calculatorHintLevel: 0,
  calculatorDisplay: "0",
  calculatorStoredValue: null,
  calculatorOperator: null,
  calculatorWaitingForOperand: false,
  currentConversation: null,
  messagesView: "list",
  messagesHintLevel: 0,
  currentLocation: null,
  mapsView: "overview",
  mapsHintLevel: 0,
  selectedTrack: null,
  musicView: "playlist",
  musicHintLevel: 0,
  currentFile: null,
  filesView: "list",
  filesSearch: "",
  filesHintLevel: 0,
  currentCalendarDay: 14,
  currentCalendarEvent: null,
  calendarView: "month",
  calendarHintLevel: 0,
  currentBrowserPage: null,
  browserView: "search",
  browserQuery: "",
  browserHintLevel: 0,
  unknownStage: "matching",
  unknownSelectedClue: null,
  unknownMatchedClues: {},
  unknownOrder: [],
  unknownEndingStep: 0,
  unknownHintLevel: 0,
  finalIdentity: null,
  gameCompleted: false,
  unlockedApps: [1],
  completedApps: [],
  collectedClues: [],
};

export function createGameState(): GameState {
  return structuredClone(initialGameState);
}

export function loadGameState(): GameState {
  const saved = localStorage.getItem("the-lost-phone-state");
  if (!saved) return createGameState();

  try {
    return {
      ...createGameState(),
      ...JSON.parse(saved),
    } as GameState;
  } catch {
    return createGameState();
  }
}

export function saveGameState(state: GameState): void {
  localStorage.setItem("the-lost-phone-state", JSON.stringify(state));
}

export function completeApp(
  state: GameState,
  appId: number,
  clue?: string,
): void {
  if (
    !state.unlockedApps.includes(appId) ||
    state.completedApps.includes(appId)
  ) {
    return;
  }

  state.completedApps.push(appId);
  if (clue && !state.collectedClues.includes(clue)) {
    state.collectedClues.push(clue);
  }
  const nextAppId = appId + 1;
  if (nextAppId <= 10 && !state.unlockedApps.includes(nextAppId)) {
    state.unlockedApps.push(nextAppId);
  }
}
