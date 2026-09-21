import "./style.css";
import { applyCalculatorInput } from "./apps/calculator";
import { completeApp, loadGameState, saveGameState } from "./game/gameState";
import { unknownClues } from "./apps/unknown";
import { render } from "./ui";

const state = loadGameState();
state.introCompleted = false;
state.currentScreen = "lock";
state.phoneUnlocked = false;

render(state);
if (!state.introCompleted) {
  const introVideo = document.querySelector<HTMLVideoElement>(".intro-video");
  let introTransitioned = false;
  introVideo?.addEventListener("ended", () => {
    if (introTransitioned) return;
    introTransitioned = true;
    state.introCompleted = true;
    saveGameState(state);
    render(state);
  });
}
setInterval(() => saveGameState(state), 250);

document.addEventListener("submit", (event) => {
  const form = event.target as HTMLFormElement;
  if (form.dataset.action !== "unlock") return;

  event.preventDefault();
  const passcode = new FormData(form).get("passcode");
  if (passcode !== "7391") {
    render(state, "Incorrect passcode");
    document.querySelector<HTMLInputElement>("#passcode")?.focus();
    return;
  }

  state.phoneUnlocked = true;
  state.currentScreen = "home";
  render(state);
});

document.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const actionButton = target.closest<HTMLElement>("[data-action]");
  const appButton = target.closest<HTMLButtonElement>("[data-app-id]");

  if (actionButton?.dataset.action === "home") {
    state.currentScreen = "home";
    state.currentApp = null;
    state.currentNote = null;
    state.notesView = "list";
    state.currentPhoto = null;
    state.galleryView = "grid";
    state.galleryHintLevel = 0;
    resetCalculatorState();
    resetMessagesState();
    resetMapsState();
    resetMusicState();
    resetFilesState();
    resetCalendarState();
    resetBrowserState();
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "notes-list") {
    state.currentNote = null;
    state.notesView = "list";
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "hint") {
    render(state, "Think about the positions described in the note.");
    return;
  }

  if (actionButton?.dataset.action === "dismiss-success") {
    state.currentScreen = "home";
    state.currentApp = null;
    state.currentNote = null;
    state.notesView = "list";
    state.currentPhoto = null;
    state.galleryView = "grid";
    state.galleryHintLevel = 0;
    resetCalculatorState();
    resetMessagesState();
    resetMapsState();
    resetMusicState();
    resetFilesState();
    resetCalendarState();
    resetBrowserState();
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "gallery-grid") {
    state.currentPhoto = null;
    state.galleryView = "grid";
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "gallery-hint") {
    state.galleryHintLevel = Math.min(2, state.galleryHintLevel + 1);
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "dismiss-gallery-success") {
    state.currentScreen = "home";
    state.currentApp = null;
    state.currentPhoto = null;
    state.galleryView = "grid";
    state.galleryHintLevel = 0;
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "calculator-main") {
    state.calculatorView = "calculator";
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "calculator-history") {
    state.calculatorView = "history";
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "calculator-hint") {
    state.calculatorHintLevel = Math.min(2, state.calculatorHintLevel + 1);
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "dismiss-calculator-success") {
    state.currentScreen = "home";
    state.currentApp = null;
    resetCalculatorState();
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "messages-list") {
    state.currentConversation = null;
    state.messagesView = "list";
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "messages-hint") {
    state.messagesHintLevel = Math.min(2, state.messagesHintLevel + 1);
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "dismiss-messages-success") {
    state.currentScreen = "home";
    state.currentApp = null;
    resetMessagesState();
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "maps-overview") {
    resetMapsState();
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "maps-hint") {
    state.mapsHintLevel = Math.min(2, state.mapsHintLevel + 1);
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "dismiss-maps-success") {
    state.currentScreen = "home";
    state.currentApp = null;
    resetMapsState();
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "music-hint") {
    state.musicHintLevel = Math.min(2, state.musicHintLevel + 1);
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "dismiss-music-success") {
    state.currentScreen = "home";
    state.currentApp = null;
    resetMusicState();
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "files-list") {
    state.currentFile = null;
    state.filesView = "list";
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "files-hint") {
    state.filesHintLevel = Math.min(2, state.filesHintLevel + 1);
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "dismiss-files-success") {
    state.currentScreen = "home";
    state.currentApp = null;
    resetFilesState();
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "calendar-month") {
    state.currentCalendarEvent = null;
    state.calendarView = "month";
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "calendar-day") {
    state.currentCalendarEvent = null;
    state.calendarView = "day";
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "calendar-hint") {
    state.calendarHintLevel = Math.min(2, state.calendarHintLevel + 1);
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "dismiss-calendar-success") {
    state.currentScreen = "home";
    state.currentApp = null;
    resetCalendarState();
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "browser-recent") {
    state.browserQuery = "northbridge cafe";
    state.browserView = "results";
    state.currentBrowserPage = null;
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "browser-results") {
    state.currentBrowserPage = null;
    state.browserView = "results";
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "browser-hint") {
    state.browserHintLevel = Math.min(2, state.browserHintLevel + 1);
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "unknown-hint") {
    state.unknownHintLevel = Math.min(3, state.unknownHintLevel + 1);
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "unknown-order") {
    state.unknownStage = "ordering";
    state.unknownOrder = unknownClues.map(
      (clue) => state.unknownMatchedClues[clue],
    );
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "unknown-confirm-order") {
    if (
      state.unknownOrder.join("|") !==
      unknownClues.map((clue) => state.unknownMatchedClues[clue]).join("|")
    ) {
      render(state, "The trail doesn't begin there.");
      return;
    }
    state.unknownStage = "name";
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "unknown-owner") {
    state.unknownStage = "owner";
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "unknown-next") {
    if (state.unknownEndingStep >= 6) {
      state.unknownStage = "complete";
      state.gameCompleted = true;
    } else {
      state.unknownEndingStep += 1;
    }
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "unknown-review") {
    state.unknownStage = "review";
    render(state);
    return;
  }

  if (
    actionButton?.dataset.action === "unknown-close-review" ||
    actionButton?.dataset.action === "unknown-complete"
  ) {
    state.unknownStage = state.gameCompleted ? "complete" : "owner";
    render(state);
    return;
  }

  if (actionButton?.dataset.action === "dismiss-browser-success") {
    state.currentScreen = "home";
    state.currentApp = null;
    resetBrowserState();
    render(state);
    return;
  }

  const noteButton = target.closest<HTMLButtonElement>("[data-note-id]");
  if (noteButton && state.currentApp === 1) {
    state.currentNote = Number(noteButton.dataset.noteId);
    state.notesView = "detail";
    render(state);
    return;
  }

  const photoButton = target.closest<HTMLButtonElement>("[data-photo-id]");
  if (photoButton && state.currentApp === 2) {
    state.currentPhoto = Number(photoButton.dataset.photoId);
    state.galleryView = "viewer";
    render(state);
    return;
  }

  const conversationButton = target.closest<HTMLButtonElement>(
    "[data-conversation-id]",
  );
  if (conversationButton && state.currentApp === 4) {
    state.currentConversation = Number(
      conversationButton.dataset.conversationId,
    );
    state.messagesView = "conversation";
    render(state);
    return;
  }

  const locationButton =
    target.closest<HTMLButtonElement>("[data-location-id]");
  if (locationButton && state.currentApp === 5) {
    state.currentLocation = Number(locationButton.dataset.locationId);
    state.mapsView = "location";
    render(state);
    return;
  }

  const fileButton = target.closest<HTMLButtonElement>("[data-file-id]");
  if (fileButton && state.currentApp === 7) {
    state.currentFile = Number(fileButton.dataset.fileId);
    state.filesView = "detail";
    render(state);
    return;
  }

  const calendarDayButton = target.closest<HTMLButtonElement>(
    "[data-calendar-day]",
  );
  if (calendarDayButton && state.currentApp === 8) {
    state.currentCalendarDay = Number(calendarDayButton.dataset.calendarDay);
    state.calendarView = "day";
    state.currentCalendarEvent = null;
    render(state);
    return;
  }

  const calendarEventButton = target.closest<HTMLButtonElement>(
    "[data-calendar-event]",
  );
  if (calendarEventButton && state.currentApp === 8) {
    state.currentCalendarEvent = Number(
      calendarEventButton.dataset.calendarEvent,
    );
    state.calendarView = "event";
    render(state);
    return;
  }

  const browserResultButton = target.closest<HTMLButtonElement>(
    "[data-browser-page]",
  );
  if (browserResultButton && state.currentApp === 9) {
    state.currentBrowserPage = Number(browserResultButton.dataset.browserPage);
    state.browserView = "page";
    render(state);
    return;
  }

  const clueButton = target.closest<HTMLButtonElement>("[data-unknown-clue]");
  if (clueButton && state.currentApp === 10) {
    state.unknownSelectedClue = clueButton.dataset.unknownClue ?? null;
    render(state);
    return;
  }

  const fragmentButton = target.closest<HTMLButtonElement>(
    "[data-unknown-fragment]",
  );
  if (fragmentButton && state.currentApp === 10 && state.unknownSelectedClue) {
    const fragmentId = fragmentButton.dataset.unknownFragment ?? "";
    const clueIndex = unknownClues.indexOf(
      state.unknownSelectedClue as (typeof unknownClues)[number],
    );
    const expectedId = `FRAGMENT-${String(clueIndex + 1).padStart(2, "0")}`;
    if (fragmentId !== expectedId) {
      render(state, "Those two pieces don't belong together.");
      return;
    }
    state.unknownMatchedClues[state.unknownSelectedClue] = fragmentId;
    state.unknownSelectedClue = null;
    render(state);
    return;
  }

  const moveButton = target.closest<HTMLButtonElement>("[data-unknown-move]");
  if (moveButton && state.currentApp === 10) {
    const index = Number(moveButton.dataset.unknownIndex);
    const nextIndex =
      moveButton.dataset.unknownMove === "up" ? index - 1 : index + 1;
    if (nextIndex >= 0 && nextIndex < state.unknownOrder.length) {
      [state.unknownOrder[index], state.unknownOrder[nextIndex]] = [
        state.unknownOrder[nextIndex],
        state.unknownOrder[index],
      ];
    }
    render(state);
    return;
  }

  const trackButton = target.closest<HTMLButtonElement>("[data-track-id]");
  if (trackButton && state.currentApp === 6) {
    state.selectedTrack = Number(trackButton.dataset.trackId);
    render(state);
    return;
  }

  const calculatorButton = target.closest<HTMLButtonElement>("[data-calc]");
  if (calculatorButton && state.currentApp === 3) {
    applyCalculatorInput(state, calculatorButton.dataset.calc ?? "");
    render(state);
    return;
  }

  if (!appButton) return;
  const appId = Number(appButton.dataset.appId);
  if (!state.unlockedApps.includes(appId)) {
    render(state, "This app is locked.");
    return;
  }

  state.currentScreen = "app";
  state.currentApp = appId;
  state.currentNote = null;
  state.notesView = "list";
  state.currentPhoto = null;
  state.galleryView = "grid";
  state.galleryHintLevel = 0;
  resetCalculatorState();
  resetMessagesState();
  resetMapsState();
  resetMusicState();
  resetFilesState();
  resetCalendarState();
  resetBrowserState();
  if (appId === 10 && state.gameCompleted) state.unknownStage = "complete";
  render(state);
});

document.addEventListener("submit", (event) => {
  const form = event.target as HTMLFormElement;
  if (form.dataset.action !== "solve-unknown") return;
  event.preventDefault();
  const answer = String(new FormData(form).get("answer") ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
  if (answer !== "alexander reed" && answer !== "alexander r.") {
    render(state, "That identity doesn't match the recovered trail.");
    return;
  }
  completeApp(state, 10);
  state.finalIdentity = "Alexander Reed";
  state.gameCompleted = true;
  state.unknownStage = "ending";
  state.unknownEndingStep = 0;
  render(state);
});

document.addEventListener("submit", (event) => {
  const form = event.target as HTMLFormElement;
  if (form.dataset.action === "search-browser") {
    event.preventDefault();
    state.browserQuery = String(new FormData(form).get("query") ?? "");
    state.currentBrowserPage = null;
    state.browserView = "results";
    render(state);
    return;
  }
  if (form.dataset.action !== "solve-browser") return;

  event.preventDefault();
  const answer = String(new FormData(form).get("answer") ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
  if (answer !== "willow street" && answer !== "14 willow street") {
    render(state, "The sources point somewhere more specific.");
    return;
  }

  completeApp(state, 9, "Willow Street");
  state.browserView = "success";
  render(state);
});

document.addEventListener("submit", (event) => {
  const form = event.target as HTMLFormElement;
  if (form.dataset.action !== "solve-calendar") return;

  event.preventDefault();
  const answer = String(new FormData(form).get("answer") ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s*[—-]\s*/g, " - ")
    .replace(/\s+/g, " ");
  if (answer !== "leave" && answer !== "leave - northbridge cafe") {
    render(state, "Check what happened next in time.");
    return;
  }

  completeApp(state, 8, "18:20");
  state.calendarView = "success";
  render(state);
});

document.addEventListener("input", (event) => {
  const input = event.target as HTMLInputElement;
  if (input.id !== "file-search") return;

  state.filesSearch = input.value;
  render(state);
  document.querySelector<HTMLInputElement>("#file-search")?.focus();
});

document.addEventListener("submit", (event) => {
  const form = event.target as HTMLFormElement;
  if (form.dataset.action !== "solve-files") return;

  event.preventDefault();
  const answer = String(new FormData(form).get("answer") ?? "")
    .trim()
    .toLowerCase();
  const withoutExtension = answer.endsWith(".txt")
    ? answer.slice(0, -4)
    : answer;
  if (withoutExtension !== "backup_old") {
    render(state, "That file doesn't match all the clues.");
    return;
  }

  completeApp(state, 7, "backup_old.txt");
  state.filesView = "success";
  render(state);
});

document.addEventListener("submit", (event) => {
  const form = event.target as HTMLFormElement;
  if (form.dataset.action !== "solve-music") return;

  event.preventDefault();
  const values = new FormData(form);
  const hour = String(values.get("hour") ?? "").trim();
  const minute = String(values.get("minute") ?? "").trim();
  if (!(hour === "07" || hour === "7") || minute !== "14") {
    render(state, "The pattern doesn't continue that way.");
    return;
  }

  completeApp(state, 6, "07:14");
  state.musicView = "success";
  render(state);
});

document.addEventListener("submit", (event) => {
  const form = event.target as HTMLFormElement;
  if (form.dataset.action !== "solve-maps") return;

  event.preventDefault();
  const answer = String(new FormData(form).get("answer") ?? "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  if (answer !== "northbridge cafe") {
    render(state, "That doesn't match the records.");
    return;
  }

  completeApp(state, 5, "Northbridge Café");
  state.mapsView = "success";
  render(state);
});

document.addEventListener("submit", (event) => {
  const form = event.target as HTMLFormElement;
  if (form.dataset.action !== "solve-messages") return;

  event.preventDefault();
  const values = new FormData(form);
  const hour = String(values.get("hour") ?? "").trim();
  const minute = String(values.get("minute") ?? "").trim();
  if (hour !== "17" || minute !== "55") {
    render(state, "Those clues don't fit together.");
    return;
  }

  completeApp(state, 4, "17:55");
  state.messagesView = "success";
  render(state);
});

document.addEventListener("submit", (event) => {
  const form = event.target as HTMLFormElement;
  if (form.dataset.action !== "solve-calculator") return;

  event.preventDefault();
  const answer = String(new FormData(form).get("answer") ?? "").trim();
  if (answer !== "55") {
    render(state, "That pattern doesn't fit.");
    return;
  }

  completeApp(state, 3, "55");
  state.calculatorView = "success";
  render(state);
});

document.addEventListener("submit", (event) => {
  const form = event.target as HTMLFormElement;
  if (form.dataset.action !== "solve-gallery") return;

  event.preventDefault();
  const answer = String(new FormData(form).get("answer") ?? "")
    .trim()
    .toUpperCase();
  if (answer !== "003" && answer !== "3" && answer !== "IMG_003") {
    render(state, "That doesn't seem to be the one.");
    return;
  }

  completeApp(state, 2, "17");
  state.galleryView = "success";
  render(state);
});

function resetCalculatorState(): void {
  state.calculatorView = "calculator";
  state.calculatorHintLevel = 0;
  state.calculatorDisplay = "0";
  state.calculatorStoredValue = null;
  state.calculatorOperator = null;
  state.calculatorWaitingForOperand = false;
}

function resetMessagesState(): void {
  state.currentConversation = null;
  state.messagesView = "list";
  state.messagesHintLevel = 0;
}

function resetMapsState(): void {
  state.currentLocation = null;
  state.mapsView = "overview";
  state.mapsHintLevel = 0;
}

function resetMusicState(): void {
  state.selectedTrack = null;
  state.musicView = "playlist";
  state.musicHintLevel = 0;
}

function resetFilesState(): void {
  state.currentFile = null;
  state.filesView = "list";
  state.filesSearch = "";
  state.filesHintLevel = 0;
}

function resetCalendarState(): void {
  state.currentCalendarDay = 14;
  state.currentCalendarEvent = null;
  state.calendarView = "month";
  state.calendarHintLevel = 0;
}

function resetBrowserState(): void {
  state.currentBrowserPage = null;
  state.browserView = "search";
  state.browserQuery = "";
  state.browserHintLevel = 0;
}

document.addEventListener("submit", (event) => {
  const form = event.target as HTMLFormElement;
  if (form.dataset.action !== "solve-notes") return;

  event.preventDefault();
  const answer = String(new FormData(form).get("answer") ?? "")
    .trim()
    .toUpperCase();
  if (answer !== "8X7") {
    render(state, "That doesn't seem right.");
    return;
  }

  completeApp(state, 1, "A");
  state.notesView = "success";
  render(state);
});
