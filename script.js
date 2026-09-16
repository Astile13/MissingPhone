/*
  Level 4 - Find the Difference (frontend only)
  - Five difference areas are defined below (percent values relative to image width/height)
  - Click either image to select a difference
  - Hint button highlights one unfound difference briefly
  - Play Again resets the puzzle
*/

const differences = [
  { id: 1, x: 22, y: 30, r: 5 },
  { id: 2, x: 68, y: 18, r: 5 },
  { id: 3, x: 45, y: 52, r: 6 },
  { id: 4, x: 30, y: 74, r: 6 },
  { id: 5, x: 78, y: 64, r: 5 }
];

let found = new Set();
let total = differences.length;
let messageTimer = null;

const galleryIcon = document.getElementById('gallery-icon');
const homeScreen = document.getElementById('home-screen');
const galleryScreen = document.getElementById('gallery-screen');
const backBtn = document.getElementById('back-btn');
const leftWrap = document.getElementById('left-photo');
const rightWrap = document.getElementById('right-photo');
const leftOverlay = leftWrap.querySelector('.overlay');
const rightOverlay = rightWrap.querySelector('.overlay');
const leftMarkers = leftWrap.querySelector('.markers');
const rightMarkers = rightWrap.querySelector('.markers');
const progressEl = document.getElementById('progress');
const messageEl = document.getElementById('message');
const hintBtn = document.getElementById('hint-btn');
const playagainBtn = document.getElementById('playagain-btn');

function showMessage(text, cssClass) {
  messageEl.textContent = text;
  messageEl.className = 'message ' + (cssClass || '');

  if (messageTimer) {
    clearTimeout(messageTimer);
  }

  messageTimer = setTimeout(() => {
    messageEl.textContent = '';
    messageEl.className = 'message';
  }, 1100);
}

function updateProgress() {
  progressEl.textContent = `Differences Found: ${found.size} / ${total}`;
  if (found.size >= total) {
    onComplete();
  }
}

function markFound(diff, cxPercent, cyPercent) {
  if (found.has(diff.id)) {
    return;
  }

  found.add(diff.id);

  const createMarker = (container, percentX, percentY) => {
    const marker = document.createElement('div');
    marker.className = 'marker';
    marker.style.left = percentX + '%';
    marker.style.top = percentY + '%';
    container.appendChild(marker);
  };

  createMarker(leftMarkers, cxPercent, cyPercent);
  createMarker(rightMarkers, cxPercent, cyPercent);

  updateProgress();
}

function checkClick(clientX, clientY, wrap) {
  const img = wrap.querySelector('.photo');
  const rect = img.getBoundingClientRect();

  if (!rect.width || !rect.height) {
    return false;
  }

  const px = ((clientX - rect.left) / rect.width) * 100;
  const py = ((clientY - rect.top) / rect.height) * 100;

  for (const d of differences) {
    const dx = px - d.x;
    const dy = py - d.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= d.r) {
      if (found.has(d.id)) {
        showMessage('Already found', 'msg-correct');
        return true;
      }

      markFound(d, d.x, d.y);
      showMessage('Correct!', 'msg-correct');
      return true;
    }
  }

  showMessage('Try Again', 'msg-wrong');
  return false;
}

leftOverlay.addEventListener('click', (e) => {
  checkClick(e.clientX, e.clientY, leftWrap);
});

rightOverlay.addEventListener('click', (e) => {
  checkClick(e.clientX, e.clientY, rightWrap);
});

function clearPulses() {
  leftWrap.querySelectorAll('.hint-pulse').forEach((pulse) => pulse.remove());
  rightWrap.querySelectorAll('.hint-pulse').forEach((pulse) => pulse.remove());
}

hintBtn.addEventListener('click', () => {
  const unfound = differences.find((d) => !found.has(d.id));
  if (!unfound) {
    return;
  }

  clearPulses();

  const showHintOn = (container, diff) => {
    const pulse = document.createElement('div');
    pulse.className = 'hint-pulse';

    const photo = container.querySelector('.photo');
    const size = Math.max(44, (diff.r / 100) * photo.getBoundingClientRect().width * 2.1);
    pulse.style.width = size + 'px';
    pulse.style.height = size + 'px';
    pulse.style.left = diff.x + '%';
    pulse.style.top = diff.y + '%';

    container.querySelector('.markers').appendChild(pulse);
    setTimeout(() => pulse.remove(), 1200);
  };

  showHintOn(leftWrap, unfound);
  showHintOn(rightWrap, unfound);
  showMessage('Hint used', 'msg-correct');
});

function onComplete() {
  if (galleryScreen.querySelector('.complete-overlay')) {
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'complete-overlay';
  overlay.innerHTML = '<div class="big">LEVEL 4 COMPLETE!</div><div class="sub">You found all differences.</div>';

  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.type = 'button';
  btn.textContent = 'Play Again';
  btn.style.marginTop = '8px';
  btn.addEventListener('click', resetGame);

  overlay.appendChild(btn);
  galleryScreen.appendChild(overlay);
  playagainBtn.classList.remove('hidden');
}

function resetGame() {
  found.clear();
  leftMarkers.innerHTML = '';
  rightMarkers.innerHTML = '';
  clearPulses();
  updateProgress();
  playagainBtn.classList.add('hidden');

  const overlay = galleryScreen.querySelector('.complete-overlay');
  if (overlay) {
    overlay.remove();
  }
}

function openGallery() {
  homeScreen.classList.add('hidden');
  galleryScreen.classList.remove('hidden');
  resetGame();
}

galleryIcon.addEventListener('click', openGallery);
galleryIcon.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openGallery();
  }
});

backBtn.addEventListener('click', () => {
  galleryScreen.classList.add('hidden');
  homeScreen.classList.remove('hidden');
});

playagainBtn.addEventListener('click', resetGame);
hintBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    hintBtn.click();
  }
});

updateProgress();

/*
  NOTES for the developer:
  - Place your two puzzle images in the folder `images/` as `image1.jpg` and `image2.jpg`.
  - Modify the five difference coordinates at the top of this file.
  - Coordinates are percent values (x,y) and radius r is percent distance.
*/