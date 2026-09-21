import type { GameState } from "../game/gameState";

export type FictionalFile = {
  id: number;
  filename: string;
  type: string;
  size: string;
  modified: string;
  content: string[];
};

export const fictionalFiles: FictionalFile[] = [
  {
    id: 1,
    filename: "meeting_notes.txt",
    type: "TXT",
    size: "2 KB",
    modified: "October 12, 2026 — 8:14 PM",
    content: [
      "Meeting moved to Thursday.",
      "Bring the old notebook.",
      "Don't forget the keys.",
    ],
  },
  {
    id: 2,
    filename: "cafe_receipt.pdf",
    type: "PDF",
    size: "84 KB",
    modified: "October 14, 2026 — 6:02 PM",
    content: [
      "NORTHBRIDGE CAFÉ",
      "Table 7",
      "October 14, 2026",
      "17:55",
      "Paid",
    ],
  },
  {
    id: 3,
    filename: "photo_backup.zip",
    type: "ZIP",
    size: "12.4 MB",
    modified: "October 15, 2026 — 9:31 AM",
    content: ["6 photos", "Last modified:", "October 15, 2026"],
  },
  {
    id: 4,
    filename: "todo.txt",
    type: "TXT",
    size: "1 KB",
    modified: "October 13, 2026 — 7:20 AM",
    content: ["Buy batteries", "Return the book", "Call Mom"],
  },
  {
    id: 5,
    filename: "backup_old.txt",
    type: "TXT",
    size: "3 KB",
    modified: "October 14, 2026 — 7:14 PM",
    content: [
      "I should have deleted this.",
      "If someone finds this file, they will know I was here.",
      "The place matters more than the date.",
      "— A",
    ],
  },
  {
    id: 6,
    filename: "calendar_export.ics",
    type: "ICS",
    size: "6 KB",
    modified: "October 16, 2026 — 10:03 AM",
    content: ["3 calendar events", "Last event:", "October 16, 2026"],
  },
];

export function renderFilesScreen(state: GameState, notice: string): string {
  if (state.filesView === "success") return renderFilesSuccess();
  if (state.filesView === "detail" && state.currentFile) {
    return renderFileDetail(state.currentFile);
  }
  return renderFileList(state, notice);
}

function renderFileList(state: GameState, notice: string): string {
  const query = state.filesSearch.trim().toLowerCase();
  const filtered = fictionalFiles.filter((file) =>
    file.filename.toLowerCase().includes(query),
  );
  const recentIds = new Set([5, 2, 1]);
  const recent = filtered.filter((file) => recentIds.has(file.id));
  const documents = filtered.filter((file) => !recentIds.has(file.id));
  const resolved = state.completedApps.includes(7);
  return `<section class="files-app" data-files-view="list">
    <header class="files-toolbar">
      <button class="files-nav" data-action="home" aria-label="Back to home">‹</button>
      <div><p class="eyebrow">On this device</p><h1>Files</h1></div>
      ${resolved ? '<span class="files-resolved">Resolved</span>' : '<span class="files-signal">●</span>'}
    </header>
    <label class="file-search"><span>⌕</span><input id="file-search" type="search" value="${escapeAttribute(state.filesSearch)}" placeholder="Search files" aria-label="Search files" autocomplete="off" /><i>offline</i></label>
    <p class="files-note">There are too many copies.<br />Find the one I meant to erase.</p>
    <div class="file-sections">
      ${renderFileSection("Recent Files", recent)}
      ${renderFileSection("Documents", documents)}
      ${filtered.length === 0 ? '<p class="empty-files">No matching files.</p>' : ""}
    </div>
    <div class="files-puzzle-panel">
      <p class="files-prompt">Which file was meant to be erased?</p>
      <form data-action="solve-files" class="files-answer-form">
        <label for="files-answer">Filename</label>
        <div class="answer-row"><input id="files-answer" name="answer" type="text" autocomplete="off" placeholder="Filename" aria-label="Which file was meant to be erased" /><button class="submit-button" type="submit">Submit</button></div>
        ${notice ? `<p class="notice puzzle-notice" role="alert">${notice}</p>` : ""}
      </form>
      <button class="hint-button" data-action="files-hint">${state.filesHintLevel > 0 ? "Hint shown" : "Show hint"}</button>
      ${state.filesHintLevel > 0 ? `<p class="files-hint">${state.filesHintLevel > 1 ? "Look at the modified time, then read what the file says." : "One of the files connects to something you discovered earlier."}</p>` : ""}
    </div>
  </section>`;
}

function renderFileSection(title: string, files: FictionalFile[]): string {
  if (files.length === 0) return "";
  return `<section class="file-section"><p class="file-section-label">${title}</p>${files.map(renderFileRow).join("")}</section>`;
}

function renderFileRow(file: FictionalFile): string {
  return `<button class="file-row" data-file-id="${file.id}"><span class="file-icon file-type-${file.type.toLowerCase()}">${file.type.charAt(0)}</span><span class="file-copy"><strong>${file.filename}</strong><small>${file.type} · ${file.size}</small></span><span class="file-modified">${file.modified.split(" — ")[0]}</span><span class="file-arrow">›</span></button>`;
}

function renderFileDetail(fileId: number): string {
  const file = fictionalFiles.find((item) => item.id === fileId)!;
  return `<section class="files-app file-detail" data-files-view="detail">
    <header class="file-detail-toolbar"><button class="files-nav" data-action="files-list" aria-label="Back to files">‹</button><span>File details</span><span class="file-type-label">${file.type}</span></header>
    <article class="document-viewer">
      <div class="document-heading"><span class="large-file-icon file-type-${file.type.toLowerCase()}">${file.type.charAt(0)}</span><div><h1>${file.filename}</h1><p>${file.type} · ${file.size}</p></div></div>
      <div class="document-metadata"><span><small>Modified</small><strong>${file.modified}</strong></span><span><small>Location</small><strong>On My Phone</strong></span></div>
      <div class="document-content">${file.content.map((line) => `<p>${line || "&nbsp;"}</p>`).join("")}</div>
    </article>
  </section>`;
}

function renderFilesSuccess(): string {
  return `<section class="files-app files-success" data-files-view="success">
    <span class="success-mark">✓</span>
    <p class="eyebrow">Files · recovered</p>
    <h1>FILE RECOVERED</h1>
    <strong class="recovered-file">backup_old.txt</strong>
    <div class="file-reveal"><p>If someone finds this file, they will know I was here.</p><small>— A</small></div>
    <div class="new-clue"><span>New clue</span><strong>backup_old.txt</strong></div>
    <p class="erase-trail">Someone really did try to erase the trail.</p>
    <button class="primary-button success-button" data-action="dismiss-files-success">Return to home</button>
  </section>`;
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
