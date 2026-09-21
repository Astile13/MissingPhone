import type { GameState } from "../game/gameState";

export type Track = {
  id: number;
  title: string;
  artist: string;
  duration: string;
};

export const tracks: Track[] = [
  { id: 1, title: "After Rain", artist: "A", duration: "01:02" },
  { id: 2, title: "Streetlights", artist: "A", duration: "02:04" },
  { id: 3, title: "Empty Roads", artist: "A", duration: "03:06" },
  { id: 4, title: "Last Train", artist: "A", duration: "04:08" },
  { id: 5, title: "Northbound", artist: "A", duration: "05:10" },
  { id: 6, title: "Home", artist: "A", duration: "06:12" },
];

export function renderMusicScreen(state: GameState, notice: string): string {
  if (state.musicView === "success") return renderMusicSuccess();
  return renderPlaylist(state, notice);
}

function renderPlaylist(state: GameState, notice: string): string {
  const resolved = state.completedApps.includes(6);
  return `<section class="music-app" data-music-view="playlist">
    <header class="music-toolbar">
      <button class="music-nav" data-action="home" aria-label="Back to home">‹</button>
      <div><p class="eyebrow">Offline library</p><h1>Music</h1></div>
      ${resolved ? '<span class="music-resolved">Resolved</span>' : '<span class="music-signal">●</span>'}
    </header>
    <div class="playlist-heading">
      <div class="album-art" aria-hidden="true"><span></span><i></i><b></b></div>
      <div class="playlist-copy"><p class="eyebrow">Playlist · 06 tracks</p><h2>Late Evening</h2><p>I always listened in the same order.</p><small>Last played at Northbridge Café</small></div>
    </div>
    <div class="track-list" aria-label="Late Evening playlist">
      ${tracks.map((track) => renderTrack(track, state.selectedTrack)).join("")}
    </div>
    <div class="missing-track-note"><span class="note-symbol">/</span><p>The last track is missing.<br />I never finished the list.</p></div>
    <div class="music-puzzle-panel">
      <p class="music-prompt">What should the missing track's duration be?</p>
      <form data-action="solve-music" class="music-answer-form">
        <label for="music-answer-minute">Missing duration</label>
        <div class="music-time-row"><input id="music-answer-hour" name="hour" type="text" inputmode="numeric" maxlength="4" placeholder="__" aria-label="Missing duration minutes" /><span>:</span><input id="music-answer-minute" name="minute" type="text" inputmode="numeric" maxlength="4" placeholder="__" aria-label="Missing duration seconds" /><button class="submit-button" type="submit">Submit</button></div>
        ${notice ? `<p class="notice puzzle-notice" role="alert">${notice}</p>` : ""}
      </form>
      <button class="hint-button" data-action="music-hint">${state.musicHintLevel > 0 ? "Hint shown" : "Show hint"}</button>
      ${state.musicHintLevel > 0 ? `<p class="music-hint">${state.musicHintLevel > 1 ? "The seconds change by the same amount each time." : "Look at the numbers, not the song titles."}</p>` : ""}
    </div>
  </section>`;
}

function renderTrack(track: Track, selectedTrack: number | null): string {
  const selected = track.id === selectedTrack;
  return `<button class="track-row ${selected ? "is-playing" : ""}" data-track-id="${track.id}" aria-label="${selected ? "Pause" : "Play"} ${track.title}">
    <span class="track-number">${selected ? "▶" : track.id.toString().padStart(2, "0")}</span>
    <span class="track-art" aria-hidden="true"><i></i></span>
    <span class="track-copy"><strong>${track.title}</strong><small>${selected ? "Playing · " : ""}${track.artist}</small></span>
    <span class="track-duration">${track.duration}</span>
  </button>`;
}

function renderMusicSuccess(): string {
  return `<section class="music-app music-success" data-music-view="success">
    <span class="success-mark">✓</span>
    <p class="eyebrow">Music · recovered</p>
    <h1>TRACK RECOVERED</h1>
    <strong class="missing-duration">07:14</strong>
    <div class="track-reveal"><p>The missing track wasn't missing.<br />Someone removed it.</p><small>— A</small></div>
    <div class="new-clue"><span>New clue</span><strong>07:14</strong></div>
    <button class="primary-button success-button" data-action="dismiss-music-success">Return to home</button>
  </section>`;
}
