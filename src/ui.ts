import { appDefinitions } from "./game/apps";
import { renderGalleryScreen } from "./apps/gallery";
import { renderCalculatorScreen } from "./apps/calculator";
import { renderNotesScreen } from "./apps/notes";
import { renderMessagesScreen } from "./apps/messages";
import { renderMapsScreen } from "./apps/maps";
import { renderMusicScreen } from "./apps/music";
import { renderFilesScreen } from "./apps/files";
import { renderCalendarScreen } from "./apps/calendar";
import { renderBrowserScreen } from "./apps/browser";
import { renderUnknownScreen } from "./apps/unknown";
import type { GameState } from "./game/gameState";

const target = document.querySelector<HTMLDivElement>("#app")!;

export function render(state: GameState, notice = ""): void {
  target.innerHTML = !state.introCompleted
    ? renderIntroScreen()
    : state.currentScreen === "lock"
      ? renderLockScreen(notice)
      : state.currentScreen === "home"
        ? renderHomeScreen(state, notice)
        : renderAppScreen(state, notice);
}

function renderIntroScreen(): string {
  return `
    <main class="intro-screen">
      <video class="intro-video" src="/assets/ref.mp4" autoplay muted playsinline preload="auto"></video>
    </main>`;
}

function renderLockScreen(notice: string): string {
  return `
    <main class="phone-shell lock-shell">
      <div class="speaker"></div>
      <div class="phone-screen lock-screen" data-screen="lock">
        <div class="status-bar"><span>10:42</span><span>▮▮▮ 87%</span></div>
        <div class="lock-content">
          <p class="eyebrow">Wednesday · September 16</p>
          <time>10:42 <small>PM</small></time>
          <div class="lock-mark">⌁</div>
          <p class="device-locked">DEVICE LOCKED</p>
          <p class="lock-hint">Swipe up to enter passcode</p>
          <form class="passcode-form" data-action="unlock">
            <label for="passcode">Device passcode</label>
            <input id="passcode" name="passcode" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="· · · ·" aria-label="Enter four digit passcode" />
            <button type="submit" class="primary-button">Unlock device</button>
            ${notice ? `<p class="notice error" role="alert">${notice}</p>` : ""}
          </form>
        </div>
        <div class="home-indicator"></div>
      </div>
    </main>`;
}

function renderHomeScreen(state: GameState, notice: string): string {
  return `
    <main class="phone-shell">
      <div class="speaker"></div>
      <div class="phone-screen home-screen" data-screen="home">
        ${renderStatusBar()}
        <header class="home-header">
          <div><p class="eyebrow">Found device</p><h1>Home</h1></div>
          <span class="signal-dot" aria-label="Offline"></span>
        </header>
        <section class="app-grid" aria-label="Phone applications">
          ${appDefinitions.map((app) => renderAppIcon(app.id, app.name, app.glyph, app.accent, state)).join("")}
        </section>
        <div class="home-footer"><span>Wednesday, September 16</span><span>${state.completedApps.length}/10 resolved</span></div>
        ${notice ? `<p class="toast" role="status">${notice}</p>` : ""}
        <div class="home-indicator"></div>
      </div>
    </main>`;
}

function renderAppIcon(
  id: number,
  name: string,
  glyph: string,
  accent: string,
  state: GameState,
): string {
  const unlocked = state.unlockedApps.includes(id);
  const completed = state.completedApps.includes(id);
  return `<button class="app-icon ${unlocked ? "is-unlocked" : "is-locked"} ${completed ? "is-completed" : ""}" data-app-id="${id}" ${unlocked ? "" : 'data-locked="true"'}>
    <span class="app-glyph" style="--app-accent: ${accent}">${glyph}</span>
    <span class="app-name">${name}</span>
    ${unlocked ? (completed ? '<span class="completion-dot">✓</span>' : "") : '<span class="lock-badge">⌑</span>'}
  </button>`;
}

function renderAppScreen(state: GameState, notice: string): string {
  const app = appDefinitions.find(
    (definition) => definition.id === state.currentApp,
  );
  if (!app) return renderHomeScreen(state, "");
  if (app.id === 1) {
    return renderNotesApp(state, notice);
  }
  if (app.id === 2) {
    return renderGalleryApp(state, notice);
  }
  if (app.id === 3) {
    return renderCalculatorApp(state, notice);
  }
  if (app.id === 4) {
    return renderMessagesApp(state, notice);
  }
  if (app.id === 5) {
    return renderMapsApp(state, notice);
  }
  if (app.id === 6) {
    return renderMusicApp(state, notice);
  }
  if (app.id === 7) {
    return renderFilesApp(state, notice);
  }
  if (app.id === 8) {
    return renderCalendarApp(state, notice);
  }
  if (app.id === 9) {
    return renderBrowserApp(state, notice);
  }
  return renderUnknownScreen(state, notice);
}

function renderNotesApp(state: GameState, notice: string): string {
  return `
    <main class="phone-shell notes-shell">
      <div class="speaker"></div>
      <div class="phone-screen app-screen notes-screen" data-screen="app">
        ${renderStatusBar()}
        ${renderNotesScreen(state, notice)}
        <div class="home-indicator"></div>
      </div>
    </main>`;
}

function renderGalleryApp(state: GameState, notice: string): string {
  return `
    <main class="phone-shell gallery-shell">
      <div class="speaker"></div>
      <div class="phone-screen app-screen gallery-screen" data-screen="app">
        ${renderStatusBar()}
        ${renderGalleryScreen(state, notice)}
        <div class="home-indicator"></div>
      </div>
    </main>`;
}

function renderCalculatorApp(state: GameState, notice: string): string {
  return `
    <main class="phone-shell calculator-shell">
      <div class="speaker"></div>
      <div class="phone-screen app-screen calculator-screen" data-screen="app">
        ${renderStatusBar()}
        ${renderCalculatorScreen(state, notice)}
        <div class="home-indicator"></div>
      </div>
    </main>`;
}

function renderMessagesApp(state: GameState, notice: string): string {
  return `
    <main class="phone-shell messages-shell">
      <div class="speaker"></div>
      <div class="phone-screen app-screen messages-screen" data-screen="app">
        ${renderStatusBar()}
        ${renderMessagesScreen(state, notice)}
        <div class="home-indicator"></div>
      </div>
    </main>`;
}

function renderMapsApp(state: GameState, notice: string): string {
  return `
    <main class="phone-shell maps-shell">
      <div class="speaker"></div>
      <div class="phone-screen app-screen maps-screen" data-screen="app">
        ${renderStatusBar()}
        ${renderMapsScreen(state, notice)}
        <div class="home-indicator"></div>
      </div>
    </main>`;
}

function renderMusicApp(state: GameState, notice: string): string {
  return `
    <main class="phone-shell music-shell">
      <div class="speaker"></div>
      <div class="phone-screen app-screen music-screen" data-screen="app">
        ${renderStatusBar()}
        ${renderMusicScreen(state, notice)}
        <div class="home-indicator"></div>
      </div>
    </main>`;
}

function renderFilesApp(state: GameState, notice: string): string {
  return `
    <main class="phone-shell files-shell">
      <div class="speaker"></div>
      <div class="phone-screen app-screen files-screen" data-screen="app">
        ${renderStatusBar()}
        ${renderFilesScreen(state, notice)}
        <div class="home-indicator"></div>
      </div>
    </main>`;
}

function renderCalendarApp(state: GameState, notice: string): string {
  return `
    <main class="phone-shell calendar-shell">
      <div class="speaker"></div>
      <div class="phone-screen app-screen calendar-screen" data-screen="app">
        ${renderStatusBar()}
        ${renderCalendarScreen(state, notice)}
        <div class="home-indicator"></div>
      </div>
    </main>`;
}

function renderBrowserApp(state: GameState, notice: string): string {
  return `
    <main class="phone-shell browser-shell">
      <div class="speaker"></div>
      <div class="phone-screen app-screen browser-screen" data-screen="app">
        ${renderStatusBar()}
        ${renderBrowserScreen(state, notice)}
        <div class="home-indicator"></div>
      </div>
    </main>`;
}

function renderStatusBar(): string {
  return '<div class="status-bar"><span>10:42</span><span>▮▮▮ 87%</span></div>';
}
