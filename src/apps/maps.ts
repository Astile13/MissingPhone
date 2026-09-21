import type { GameState } from "../game/gameState";

export type MapLocation = {
  id: number;
  name: string;
  address: string;
  visited: string;
  time: string;
  saved: boolean;
  top: string;
  left: string;
};

export const mapLocations: MapLocation[] = [
  {
    id: 1,
    name: "Northbridge Café",
    address: "14 Willow Street",
    visited: "October 14, 2026",
    time: "17:55",
    saved: true,
    top: "38%",
    left: "25%",
  },
  {
    id: 2,
    name: "Riverside Station",
    address: "8 River Road",
    visited: "October 12, 2026",
    time: "09:20",
    saved: true,
    top: "24%",
    left: "78%",
  },
  {
    id: 3,
    name: "Old Library",
    address: "21 King Street",
    visited: "October 14, 2026",
    time: "17:55",
    saved: false,
    top: "69%",
    left: "68%",
  },
  {
    id: 4,
    name: "Hawthorne Park",
    address: "3 Park Lane",
    visited: "October 13, 2026",
    time: "14:10",
    saved: false,
    top: "72%",
    left: "19%",
  },
  {
    id: 5,
    name: "West End Market",
    address: "42 Market Street",
    visited: "October 11, 2026",
    time: "18:30",
    saved: false,
    top: "18%",
    left: "43%",
  },
];

export function renderMapsScreen(state: GameState, notice: string): string {
  if (state.mapsView === "success") return renderMapsSuccess();
  if (state.mapsView === "location" && state.currentLocation) {
    return renderLocationDetail(state.currentLocation);
  }
  return renderMapsOverview(state, notice);
}

function renderMapsOverview(state: GameState, notice: string): string {
  const saved = mapLocations.filter((location) => location.saved);
  const recent = mapLocations.filter((location) => !location.saved);
  const resolved = state.completedApps.includes(5);
  return `<section class="maps-app" data-maps-view="overview">
    <header class="maps-toolbar">
      <button class="maps-nav" data-action="home" aria-label="Back to home">‹</button>
      <div><p class="eyebrow">Offline maps</p><h1>Maps</h1></div>
      ${resolved ? '<span class="maps-resolved">Resolved</span>' : '<span class="map-signal">●</span>'}
    </header>
    <div class="map-search"><span>⌕</span><span>Search this phone</span><i>offline</i></div>
    <div class="fictional-map" aria-label="Fictional map of local places">
      <span class="map-road road-one"></span><span class="map-road road-two"></span><span class="map-road road-three"></span>
      <span class="map-water"></span>
      ${mapLocations.map((location) => `<button class="map-pin ${location.time === "17:55" ? "same-time" : ""}" style="top:${location.top};left:${location.left}" data-location-id="${location.id}" aria-label="Open ${location.name}"><span></span></button>`).join("")}
      <span class="map-scale">N<br><b>—</b></span>
    </div>
    <p class="map-note">I went back to the same place more than once.<br />I just don't remember which one.</p>
    <div class="place-groups">
      <div class="place-group"><p class="group-label">Saved Places</p>${saved.map((location) => renderLocationRow(location, true)).join("")}</div>
      <div class="place-group"><p class="group-label">Recent</p>${recent.map((location) => renderLocationRow(location, false)).join("")}</div>
    </div>
    <div class="maps-puzzle-panel">
      <p class="maps-prompt">Which place was visited at 17:55 and saved?</p>
      <form data-action="solve-maps" class="maps-answer-form">
        <label for="maps-answer">Place name</label>
        <div class="answer-row"><input id="maps-answer" name="answer" type="text" autocomplete="off" placeholder="Place name" aria-label="Which place was visited at 17:55 and saved" /><button class="submit-button" type="submit">Submit</button></div>
        ${notice ? `<p class="notice puzzle-notice" role="alert">${notice}</p>` : ""}
      </form>
      <button class="hint-button" data-action="maps-hint">${state.mapsHintLevel > 0 ? "Hint shown" : "Show hint"}</button>
      ${state.mapsHintLevel > 0 ? `<p class="maps-hint">${state.mapsHintLevel > 1 ? "Two places share that time. Check what else the phone remembers about them." : "Start with the time you already discovered."}</p>` : ""}
    </div>
  </section>`;
}

function renderLocationRow(location: MapLocation, saved: boolean): string {
  return `<button class="location-row" data-location-id="${location.id}"><span class="location-pin-mini">●</span><span class="location-copy"><strong>${location.name}</strong><small>${location.address} · ${location.time}</small></span>${saved ? '<span class="saved-mark">★</span>' : '<span class="location-arrow">›</span>'}</button>`;
}

function renderLocationDetail(locationId: number): string {
  const location = mapLocations.find((item) => item.id === locationId)!;
  return `<section class="maps-app location-detail" data-maps-view="location">
    <header class="maps-detail-toolbar"><button class="maps-nav" data-action="maps-overview" aria-label="Back to map">‹</button><span>Location details</span><span class="detail-status">${location.saved ? "saved" : "visited"}</span></header>
    <div class="detail-map"><span class="detail-pin">●</span><span class="detail-coordinate">LOCAL RECORD ${location.id.toString().padStart(2, "0")}</span></div>
    <article class="location-card"><p class="location-kicker">Phone record</p><h1>${location.name}</h1><p class="location-address">${location.address}</p><div class="location-metadata"><span><small>Visited</small><strong>${location.visited}</strong></span><span><small>Time</small><strong>${location.time}</strong></span></div>${location.saved ? '<p class="saved-place">★ Saved place</p>' : '<p class="unsaved-place">Not saved</p>'}</article>
  </section>`;
}

function renderMapsSuccess(): string {
  return `<section class="maps-app maps-success" data-maps-view="success">
    <span class="success-mark">✓</span>
    <p class="eyebrow">Maps · recovered</p>
    <h1>PLACE IDENTIFIED</h1>
    <strong class="identified-place">Northbridge Café</strong>
    <strong class="identified-time">17:55</strong>
    <div class="place-reveal"><p>Someone wanted me to remember this place.</p><small>— A</small></div>
    <div class="new-clue"><span>New clue</span><strong>Northbridge Café</strong></div>
    <button class="primary-button success-button" data-action="dismiss-maps-success">Return to home</button>
  </section>`;
}
