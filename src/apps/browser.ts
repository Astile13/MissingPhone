import type { GameState } from "../game/gameState";

export type BrowserResult = {
  id: number;
  title: string;
  domain: string;
  snippet: string;
  pageTitle: string;
  content: string[];
};

export const browserResults: BrowserResult[] = [
  {
    id: 1,
    title: "Northbridge Café — Official",
    domain: "northbridge-cafe.example",
    snippet:
      "Northbridge Café has served the neighborhood since 2019. Opening hours: 08:00–21:00. The café's rear entrance opens onto Willow Street.",
    pageTitle: "Northbridge Café",
    content: [
      "Established in 2019.",
      "Address:",
      "14 Willow Street",
      "Opening hours:",
      "08:00–21:00",
      "The rear entrance is on Willow Street.",
      "Private events may be arranged after normal opening hours.",
    ],
  },
  {
    id: 2,
    title: "Northbridge Café — Local Guide",
    domain: "cityguide.example",
    snippet:
      "A neighborhood café known for its quiet rear entrance and evening tables.",
    pageTitle: "Northbridge Café — Local Guide",
    content: [
      "Address:",
      "14 Willow Street",
      "Popular with students and nearby residents.",
      "The rear entrance faces Willow Street.",
      "Evening tables near the rear entrance are usually quieter than the front area.",
    ],
  },
  {
    id: 3,
    title: "Northbridge Café Reviews",
    domain: "reviewboard.example",
    snippet:
      "Several visitors mention the quiet rear entrance and late afternoon meetings.",
    pageTitle: "Northbridge Café Reviews",
    content: [
      "Review 1:",
      "“The back entrance is much quieter.”",
      "— Maya, October 2026",
      "Review 2:",
      "“Good place for a private conversation in the evening.”",
      "— Daniel, October 2026",
      "Review 3:",
      "“The rear tables are away from the main entrance.”",
      "— Anonymous, October 2026",
    ],
  },
  {
    id: 4,
    title: "Willow Street History",
    domain: "localarchive.example",
    snippet:
      "Historical information about Willow Street and nearby businesses.",
    pageTitle: "Willow Street History",
    content: [
      "Northbridge Café occupies number 14 Willow Street.",
      "The building has had a rear service entrance facing the same street since before the café opened.",
      "The rear entrance is not visible from the main road.",
    ],
  },
];

export function renderBrowserScreen(state: GameState, notice: string): string {
  if (state.browserView === "success") return renderBrowserSuccess();
  if (state.browserView === "page" && state.currentBrowserPage)
    return renderBrowserPage(state.currentBrowserPage);
  if (state.browserView === "results")
    return renderBrowserResults(state, notice);
  return renderBrowserSearch(state);
}

function renderBrowserSearch(state: GameState): string {
  const resolved = state.completedApps.includes(9);
  return `<section class="browser-app browser-search-view" data-browser-view="search">
    <header class="browser-toolbar"><button class="browser-nav" data-action="home" aria-label="Back to home">‹</button><div><p class="eyebrow">Private browser</p><h1>Browser</h1></div>${resolved ? '<span class="browser-resolved">Resolved</span>' : '<span class="browser-signal">●</span>'}</header>
    ${renderSearchForm(state)}
    <div class="browser-start-note"><span class="browser-note-mark">/</span><p>Some things are easier to find when you already know what you're looking for.</p></div>
    <button class="recent-search" data-action="browser-recent"><span>Recent search</span><strong>northbridge cafe</strong><span>›</span></button>
    <p class="browser-footer">Search index · on device</p>
  </section>`;
}

function renderSearchForm(state: GameState): string {
  return `<form class="browser-search-form" data-action="search-browser"><span>⌕</span><input id="browser-search" name="query" type="search" value="${escapeAttribute(state.browserQuery)}" placeholder="Search or enter address" aria-label="Search fictional browser" autocomplete="off" /><button type="submit" aria-label="Search">Go</button></form>`;
}

function renderBrowserResults(state: GameState, notice: string): string {
  const query = normalizeSearch(state.browserQuery);
  const recognized = ["northbridge", "northbridge cafe", "cafe"].includes(
    query,
  );
  return `<section class="browser-app browser-results-view" data-browser-view="results">
    <header class="browser-results-toolbar"><button class="browser-nav" data-action="home" aria-label="Back to home">‹</button><span>Search results</span><span class="browser-signal">●</span></header>
    ${renderSearchForm(state)}
    ${recognized ? `<p class="result-summary">Results for <strong>${escapeHtml(state.browserQuery.trim())}</strong></p><div class="result-list">${browserResults.map(renderResultCard).join("")}</div>` : '<div class="no-results"><span>⌕</span><p>No useful results found.</p></div>'}
    ${recognized ? renderInvestigationPanel(state, notice) : ""}
  </section>`;
}

function renderResultCard(result: BrowserResult): string {
  return `<button class="browser-result" data-browser-page="${result.id}"><span class="result-source">${result.domain}</span><strong>${result.title}</strong><p>${result.snippet}</p><span class="result-arrow">›</span></button>`;
}

function renderBrowserPage(pageId: number): string {
  const result = browserResults.find((item) => item.id === pageId)!;
  return `<section class="browser-app browser-page-view" data-browser-view="page">
    <header class="browser-page-toolbar"><button class="browser-nav" data-action="browser-results" aria-label="Back to search results">‹</button><span class="page-domain">${result.domain}</span><span class="page-menu">•••</span></header>
    <article class="browser-article"><p class="article-source">${result.domain}</p><h1>${result.pageTitle}</h1><div class="article-rule"></div><div class="article-content">${result.content.map((line) => `<p>${line || "&nbsp;"}</p>`).join("")}</div></article>
  </section>`;
}

function renderInvestigationPanel(state: GameState, notice: string): string {
  return `<div class="browser-puzzle-panel"><p class="browser-prompt">Where was the meeting's exit?</p><form data-action="solve-browser" class="browser-answer-form"><label for="browser-answer">Location</label><div class="answer-row"><input id="browser-answer" name="answer" type="text" autocomplete="off" placeholder="Street or address" aria-label="Where was the meeting's exit" /><button class="submit-button" type="submit">Submit</button></div>${notice ? `<p class="notice puzzle-notice" role="alert">${notice}</p>` : ""}</form><button class="hint-button" data-action="browser-hint">${state.browserHintLevel > 0 ? "Hint shown" : "Show hint"}</button>${state.browserHintLevel > 0 ? `<p class="browser-hint">${state.browserHintLevel > 1 ? "The Calendar mentioned leaving through the back. Find out where that entrance leads." : "Don't rely on just one result. Look for a detail that appears more than once."}</p>` : ""}</div>`;
}

function renderBrowserSuccess(): string {
  return `<section class="browser-app browser-success" data-browser-view="success"><span class="success-mark">✓</span><p class="eyebrow">Browser · confirmed</p><h1>LOCATION CONFIRMED</h1><strong class="confirmed-location">Willow Street</strong><div class="browser-reveal"><p>The back entrance wasn't an accident.</p><small>— A</small></div><div class="new-clue"><span>New clue</span><strong>Willow Street</strong></div><p class="final-app-note">One final app remains.</p><button class="primary-button success-button" data-action="dismiss-browser-success">Return to home</button></section>`;
}

function normalizeSearch(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtml(value: string): string {
  return escapeAttribute(value);
}
