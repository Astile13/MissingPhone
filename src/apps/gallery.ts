import type { GameState } from "../game/gameState";

export type GalleryPhoto = {
  id: number;
  filename: string;
  date: string;
  time: string;
  src: string;
};

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: 1,
    filename: "IMG_001",
    date: "October 14, 2026",
    time: "10:42 AM",
    src: "/gallery/img-001.svg",
  },
  {
    id: 2,
    filename: "IMG_002",
    date: "October 14, 2026",
    time: "11:03 AM",
    src: "/gallery/img-002.svg",
  },
  {
    id: 3,
    filename: "IMG_003",
    date: "October 14, 2026",
    time: "11:17 AM",
    src: "/gallery/img-003.svg",
  },
  {
    id: 4,
    filename: "IMG_004",
    date: "October 14, 2026",
    time: "11:31 AM",
    src: "/gallery/img-004.svg",
  },
  {
    id: 5,
    filename: "IMG_005",
    date: "October 14, 2026",
    time: "11:45 AM",
    src: "/gallery/img-005.svg",
  },
  {
    id: 6,
    filename: "IMG_006",
    date: "October 14, 2026",
    time: "12:02 PM",
    src: "/gallery/img-006.svg",
  },
];

export function renderGalleryScreen(state: GameState, notice: string): string {
  if (state.galleryView === "success") return renderGallerySuccess();
  if (state.galleryView === "viewer" && state.currentPhoto) {
    return renderPhotoViewer(state.currentPhoto);
  }
  return renderGalleryGrid(state, notice);
}

function renderGalleryGrid(state: GameState, notice: string): string {
  const resolved = state.completedApps.includes(2);
  return `<section class="gallery-app" data-gallery-view="grid">
    <header class="gallery-toolbar">
      <button class="gallery-nav" data-action="home" aria-label="Back to home">‹</button>
      <div><p class="eyebrow">Camera roll</p><h1>Gallery</h1></div>
      <span class="gallery-count">${galleryPhotos.length.toString().padStart(2, "0")}</span>
    </header>
    <div class="gallery-caption"><span class="caption-mark">/</span><span>Something changed.</span>${resolved ? '<span class="gallery-resolved">Resolved</span>' : ""}</div>
    <div class="photo-grid">
      ${galleryPhotos.map((photo) => `<button class="photo-tile" data-photo-id="${photo.id}" aria-label="Open ${photo.filename}"><img src="${photo.src}" alt="Bedroom photograph ${photo.filename}" /><span>${photo.filename}</span></button>`).join("")}
    </div>
    <div class="gallery-puzzle-panel">
      <div class="gallery-prompt">Which photo was different?</div>
      <form data-action="solve-gallery" class="gallery-answer-form">
        <label for="gallery-answer">Photo identifier</label>
        <div class="answer-row"><input id="gallery-answer" name="answer" type="text" inputmode="numeric" maxlength="7" autocomplete="off" placeholder="_ _ _" aria-label="Which photo was different" /><button class="submit-button" type="submit">Submit</button></div>
        ${notice ? `<p class="notice puzzle-notice" role="alert">${notice}</p>` : ""}
      </form>
      <button class="hint-button" data-action="gallery-hint">${state.galleryHintLevel > 0 ? "Hint shown" : "Show hint"}</button>
      ${state.galleryHintLevel > 0 ? `<p class="gallery-hint">${state.galleryHintLevel > 1 ? "One detail appears differently from the others." : "Compare the photographs carefully."}</p>` : ""}
    </div>
  </section>`;
}

function renderPhotoViewer(photoId: number): string {
  const photo = galleryPhotos.find((item) => item.id === photoId)!;
  return `<section class="gallery-app photo-viewer" data-gallery-view="viewer">
    <header class="viewer-toolbar"><button class="gallery-nav" data-action="gallery-grid" aria-label="Back to gallery">‹</button><span>Photo details</span><span class="viewer-index">${photo.id} / ${galleryPhotos.length}</span></header>
    <figure class="photo-detail">
      <img src="${photo.src}" alt="Bedroom photograph ${photo.filename}" />
      <figcaption><strong>${photo.filename}</strong><span>${photo.date}</span><span>${photo.time}</span></figcaption>
    </figure>
  </section>`;
}

function renderGallerySuccess(): string {
  return `<section class="gallery-app gallery-success" data-gallery-view="success">
    <span class="success-mark">✓</span>
    <p class="eyebrow">Gallery · recovered</p>
    <h1>PUZZLE SOLVED</h1>
    <p class="success-lead">One photograph doesn't belong.</p>
    <div class="time-reveal"><strong>11:17</strong><span>You've seen this before.</span><small>— A</small></div>
    <button class="primary-button success-button" data-action="dismiss-gallery-success">Return to home</button>
  </section>`;
}
