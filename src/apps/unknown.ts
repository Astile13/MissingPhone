import type { GameState } from "../game/gameState";

export const unknownClues = [
  "A",
  "17",
  "55",
  "17:55",
  "Northbridge Café",
  "07:14",
  "backup_old.txt",
  "18:20",
  "Willow Street",
] as const;

const fragments = [
  [
    "FRAGMENT-01",
    "A single letter appeared before anything else. It was signed by someone who never used their full name.",
    "A",
  ],
  [
    "FRAGMENT-02",
    "The photographs stopped making sense at one particular number. The number was the hour that kept returning.",
    "L",
  ],
  [
    "FRAGMENT-03",
    "The calculator produced a number that wasn't really a calculation. It became important later.",
    "E",
  ],
  [
    "FRAGMENT-04",
    "Two numbers finally became a time. That was when the meeting was supposed to happen.",
    "X",
  ],
  [
    "FRAGMENT-05",
    "The same place appeared more than once. It was where the meeting happened.",
    "A",
  ],
  [
    "FRAGMENT-06",
    "A missing track left behind a time. Later, that same time appeared in a file's history.",
    "N",
  ],
  [
    "FRAGMENT-07",
    "Someone wanted this file gone. It contained the warning that the trail had not been erased completely.",
    "D",
  ],
  [
    "FRAGMENT-08",
    "The calendar revealed when the meeting ended. Everything after this point became harder to explain.",
    "E",
  ],
  [
    "FRAGMENT-09",
    "The final search revealed where the back entrance led. It was the street behind the meeting place.",
    "R",
  ],
] as const;

const owners = [
  ["Alexander Reed", "Photographer", "Northbridge area"],
  ["Alexander Cole", "Teacher", "Riverside"],
  ["Alexander Mason", "Engineer", "West End"],
  ["Alexander Shaw", "Student", "Hawthorne"],
] as const;

function esc(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ] ?? character,
  );
}

export function renderUnknownScreen(state: GameState, notice = ""): string {
  if (state.unknownStage === "complete") return renderComplete();
  if (state.unknownStage === "review") return renderReview();
  if (state.unknownStage === "ending") return renderEnding(state);
  if (state.unknownStage === "owner") return renderOwner(state, notice);
  if (state.unknownStage === "name") return renderName();
  if (state.unknownStage === "ordering") return renderOrdering(state, notice);
  return renderMatching(state, notice);
}

function shell(content: string): string {
  return `<main class="phone-shell unknown-shell"><div class="speaker"></div><div class="phone-screen unknown-screen" data-screen="app"><div class="status-bar"><span>10:42</span><span>▮▮▮ 87%</span></div>${content}<div class="home-indicator"></div></div></main>`;
}

function heading(title: string, subtitle = ""): string {
  return `<header class="unknown-header"><button class="unknown-back" data-action="home" aria-label="Return to home">‹</button><div><p class="eyebrow">RECOVERY</p><h1>${title}</h1>${subtitle ? `<p class="unknown-subtitle">${subtitle}</p>` : ""}</div></header>`;
}

function renderMatching(state: GameState, notice: string): string {
  const matched = Object.keys(state.unknownMatchedClues).length;
  return shell(
    `<section class="unknown-app">${heading("Reconstruct the trail", "This application has no name. Maybe it was never meant to be opened.")}<p class="unknown-intro">RECOVERED FRAGMENTS</p><div class="unknown-columns"><div><p class="unknown-label">Collected clues · ${matched}/9</p><div class="clue-list">${unknownClues
      .map((clue) => {
        const isMatched = clue in state.unknownMatchedClues;
        return `<button class="clue-chip ${isMatched ? "is-matched" : ""} ${state.unknownSelectedClue === clue ? "is-selected" : ""}" data-unknown-clue="${esc(clue)}" ${isMatched ? "disabled" : ""}>${esc(clue)}${isMatched ? " ✓" : ""}</button>`;
      })
      .join(
        "",
      )}</div></div><div><p class="unknown-label">Recovered fragments</p><div class="fragment-list">${fragments
      .map(([id, text, letter], index) => {
        const clue = unknownClues[index];
        const isMatched = clue in state.unknownMatchedClues;
        return `<button class="fragment-card ${isMatched ? "is-matched" : ""}" data-unknown-fragment="${id}" ${isMatched ? "disabled" : ""}><span>${id}</span><strong>${esc(text)}</strong><b>${letter}</b>${isMatched ? `<small>matched: ${esc(clue)}</small>` : ""}</button>`;
      })
      .join(
        "",
      )}</div></div></div>${notice ? `<p class="unknown-notice">${esc(notice)}</p>` : ""}${matched === 9 ? `<button class="unknown-primary" data-action="unknown-order">Arrange the trail</button>` : ""}<button class="unknown-hint" data-action="unknown-hint">${state.unknownHintLevel ? ["The first name came from the fragments. The surname must come from the evidence.", "Which owner is connected to the place you kept finding?", "Northbridge Café and Willow Street point toward the same owner record."][state.unknownHintLevel - 1] : "Need a hint?"}</button></section>`,
  );
}

function renderOrdering(state: GameState, notice: string): string {
  const order = state.unknownOrder.length
    ? state.unknownOrder
    : [...unknownClues];
  return shell(
    `<section class="unknown-app">${heading("Order the evidence", "The fragments fit. Now put them in the order the trail was discovered.")}<ol class="order-list">${order.map((clue, index) => `<li><span>${index + 1}</span><strong>${esc(clue)}</strong><div><button class="order-button" data-unknown-move="up" data-unknown-index="${index}" ${index === 0 ? "disabled" : ""} aria-label="Move up">↑</button><button class="order-button" data-unknown-move="down" data-unknown-index="${index}" ${index === order.length - 1 ? "disabled" : ""} aria-label="Move down">↓</button></div></li>`).join("")}</ol>${notice ? `<p class="unknown-notice">${esc(notice)}</p>` : ""}<button class="unknown-primary" data-action="unknown-confirm-order">Confirm order</button></section>`,
  );
}

function renderName(): string {
  return shell(
    `<section class="unknown-app centered-reveal">${heading("Name recovered")}<div class="letter-reveal">${fragments.map(([, , letter], index) => `<span style="animation-delay:${index * 0.12}s">${letter}</span>`).join("")}</div><h2>ALEXANDER</h2><p>“A” wasn't an initial.<br />It was the first piece of a name.</p><button class="unknown-primary" data-action="unknown-owner">Continue</button></section>`,
  );
}

function renderOwner(state: GameState, notice: string): string {
  return shell(
    `<section class="unknown-app">${heading("One piece is still missing")}<p class="unknown-lead">Four people share the first name.<br />One record matches the trail.</p><div class="owner-list">${owners.map(([name, role, location]) => `<article class="owner-card"><h2>${name}</h2><p>${role}</p><small>Last known location · ${location}</small></article>`).join("")}</div><div class="evidence-grid"><span><b>Meeting location</b>Northbridge Café</span><span><b>Exit</b>Willow Street</span><span><b>Recovered file</b>backup_old.txt</span><span><b>Signature</b>— A</span></div><form class="unknown-answer" data-action="solve-unknown"><label for="unknown-answer">Whose phone was this?</label><h2>Whose phone was this?</h2><div class="answer-row"><input id="unknown-answer" name="answer" type="text" autocomplete="off" placeholder="Full owner name" /><button class="unknown-primary" type="submit">Identify</button></div></form>${notice ? `<p class="unknown-notice">${esc(notice)}</p>` : ""}<button class="unknown-hint" data-action="unknown-hint">${state.unknownHintLevel ? ["The first name came from the fragments. The surname must come from the evidence.", "Which owner is connected to the place you kept finding?", "Northbridge Café and Willow Street point toward the same owner record."][state.unknownHintLevel - 1] : "Need a hint?"}</button></section>`,
  );
}

function renderEnding(state: GameState): string {
  const steps = [
    "PHONE OWNER IDENTIFIED|ALEXANDER REED",
    "You finally found the name.",
    "The phone wasn't lost by accident.",
    "Alexander left a trail through the phone. Someone tried to erase it. But they missed enough.",
    "The meeting. The file. The missing track. The back entrance. And one name.",
    "Alexander Reed|Last known location:|Northbridge Café|October 14, 2026|17:55 → 18:20|Exit:|Willow Street",
    "Whatever happened after 18:20 is still unknown.",
  ];
  const lines = steps[state.unknownEndingStep].split("|");
  return shell(
    `<section class="unknown-app centered-reveal ending-reveal">${heading("Recovery log")}<div class="ending-copy">${lines.map((line, index) => (index === 0 && state.unknownEndingStep === 0 ? `<h2>${line}</h2>` : `<p>${line}</p>`)).join("")}</div><button class="unknown-primary" data-action="unknown-next">${state.unknownEndingStep === steps.length - 1 ? "Close case" : "Continue"}</button></section>`,
  );
}

function renderComplete(): string {
  return shell(
    `<section class="unknown-app centered-reveal">${heading("Case closed")}<h2>CASE CLOSED</h2><h1 class="final-owner">ALEXANDER REED</h1><p>You found the owner.<br />You recovered the trail.<br />But some questions remain unanswered.</p><strong class="thanks">Thank you for playing.</strong><div class="ending-actions"><button class="unknown-primary" data-action="unknown-review">Review the Trail</button><button class="unknown-secondary" data-action="home">Return to Phone</button></div></section>`,
  );
}

function renderReview(): string {
  const entries = [
    ["NOTES", "A"],
    ["GALLERY", "17"],
    ["CALCULATOR", "55"],
    ["MESSAGES", "17:55"],
    ["MAPS", "Northbridge Café"],
    ["MUSIC", "07:14"],
    ["FILES", "backup_old.txt"],
    ["CALENDAR", "18:20"],
    ["BROWSER", "Willow Street"],
    ["UNKNOWN", "Alexander Reed"],
  ];
  return shell(
    `<section class="unknown-app">${heading("Review the trail")}<div class="review-list">${entries.map(([app, clue], index) => `<article><span>${index + 1} — ${app}</span><strong>${clue}</strong></article>`).join("")}</div><button class="unknown-secondary" data-action="unknown-complete">Return to Recovery</button></section>`,
  );
}
