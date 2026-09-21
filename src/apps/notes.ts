import type { GameState } from "../game/gameState";

export type Note = {
  id: number;
  title: string;
  preview: string;
  content: string[];
  puzzle?: boolean;
};

export const notes: Note[] = [
  {
    id: 1,
    title: "Shopping List",
    preview: "MILK · BREAD · APPLES",
    content: ["MILK", "BREAD", "APPLES", "COFFEE"],
  },
  {
    id: 2,
    title: "Things I Need To Remember",
    preview: "Call Mom · Return the book",
    content: [
      "Call Mom",
      "Return the book",
      "Buy batteries",
      "Water the plants",
    ],
  },
  {
    id: 3,
    title: "Don't Forget",
    preview: "I keep forgetting things.",
    content: [
      "I keep forgetting things.",
      "So I made a little rule for myself.",
      "The first is at the beginning.",
      "The second is in the middle.",
      "The third is at the end.",
      "",
      "8 P 4 X 2 K 7",
    ],
    puzzle: true,
  },
];

export function renderNotesScreen(state: GameState, notice: string): string {
  if (state.notesView === "success") return renderSuccessScreen();
  if (state.notesView === "detail" && state.currentNote) {
    return renderNoteDetail(state.currentNote, notice);
  }
  return renderNotesList(state);
}

function renderNotesList(state: GameState): string {
  const resolved = state.completedApps.includes(1);
  return `
    <section class="notes-app" data-notes-view="list">
      <header class="notes-toolbar">
        <button class="notes-nav" data-action="home" aria-label="Back to home">‹</button>
        <div><p class="eyebrow">Personal</p><h1>Notes</h1></div>
        <span class="notes-count">${notes.length.toString().padStart(2, "0")}</span>
      </header>
      <div class="notes-list">
        ${notes
          .map(
            (
              note,
            ) => `<button class="note-row ${note.id === 3 && resolved ? "is-resolved" : ""}" data-note-id="${note.id}">
          <span class="note-index">0${note.id}</span>
          <span class="note-copy"><strong>${note.title}</strong><small>${note.id === 3 && resolved ? "Puzzle resolved · " : ""}${note.preview}</small></span>
          <span class="note-chevron">›</span>
        </button>`,
          )
          .join("")}
      </div>
      <p class="notes-footer">${resolved ? "Puzzle resolved · " : ""}Last edited · today</p>
    </section>`;
}

function renderNoteDetail(noteId: number, notice: string): string {
  const note = notes.find((item) => item.id === noteId)!;
  return `
    <section class="notes-app note-detail" data-notes-view="detail">
      <header class="notes-toolbar detail-toolbar">
        <button class="notes-nav" data-action="notes-list" aria-label="Back to notes">‹</button>
        <span class="note-folder">All notes</span>
        <span class="notes-count">0${note.id}</span>
      </header>
      <article class="note-paper ${note.puzzle ? "puzzle-note" : ""}">
        <p class="note-date">Wednesday · September 16</p>
        <h1>${note.title}</h1>
        <div class="note-content">${note.content.map((line) => `<p>${line || "&nbsp;"}</p>`).join("")}</div>
      </article>
      ${note.puzzle ? renderPuzzleForm(notice) : '<p class="note-status">No further action required.</p>'}
    </section>`;
}

function renderPuzzleForm(notice: string): string {
  return `<div class="puzzle-panel">
    <div class="puzzle-panel-heading"><span>Recovery prompt</span><span class="puzzle-status">● active</span></div>
    <form data-action="solve-notes" class="answer-form">
      <label for="notes-answer">Enter the code</label>
      <div class="answer-row"><input id="notes-answer" name="answer" type="text" inputmode="text" maxlength="3" autocomplete="off" placeholder="_ _ _" aria-label="Enter the code" /><button class="submit-button" type="submit">Submit</button></div>
      ${notice ? `<p class="notice puzzle-notice" role="alert">${notice}</p>` : ""}
    </form>
    <button class="hint-button" data-action="hint">Show hint</button>
  </div>`;
}

function renderSuccessScreen(): string {
  return `<section class="notes-app success-screen" data-notes-view="success">
    <span class="success-mark">✓</span>
    <p class="eyebrow">Notes · recovered</p>
    <h1>PUZZLE SOLVED</h1>
    <p class="success-lead">A hidden note was recovered.</p>
    <div class="recovered-note"><p>If you're reading this, you've already opened the phone.</p><p>Don't trust the obvious things.</p><p class="signature">— A</p></div>
    <button class="primary-button success-button" data-action="dismiss-success">Return to home</button>
  </section>`;
}
