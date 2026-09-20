/**
 * Wanderlock Audio — Web Audio API synthesizer for atmospheric game feedback.
 * Zero external audio files. Sounds are procedurally generated.
 */

const STORAGE_KEY = "wanderlock.sound";
let ctx = null;
let muted = false;

try {
  muted = localStorage.getItem(STORAGE_KEY) === "off";
} catch { /* ignore */ }

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  try { localStorage.setItem(STORAGE_KEY, muted ? "off" : "on"); } catch { /* ignore */ }
  return muted;
}

function playTone(freq, duration, type = "sine", gain = 0.12, delay = 0) {
  if (muted) return;
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime + delay);
    g.gain.setValueAtTime(gain, ac.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration);
    osc.connect(g).connect(ac.destination);
    osc.start(ac.currentTime + delay);
    osc.stop(ac.currentTime + delay + duration + 0.05);
  } catch { /* ignore audio errors */ }
}

function playNoise(duration, gain = 0.04, delay = 0) {
  if (muted) return;
  try {
    const ac = getCtx();
    const bufferSize = ac.sampleRate * duration;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = ac.createBufferSource();
    source.buffer = buffer;
    const g = ac.createGain();
    const filter = ac.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2000;
    filter.Q.value = 0.5;
    g.gain.setValueAtTime(gain, ac.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration);
    source.connect(filter).connect(g).connect(ac.destination);
    source.start(ac.currentTime + delay);
  } catch { /* ignore */ }
}

/** Crisp typewriter click for tile selection. */
export function playTileClick() {
  playTone(1200, 0.06, "square", 0.05);
  playNoise(0.03, 0.03);
}

/** Gentle wooden shuffle whoosh. */
export function playShuffle() {
  playNoise(0.25, 0.06);
  playTone(300, 0.15, "triangle", 0.04);
  playTone(400, 0.12, "triangle", 0.03, 0.06);
}

/** Harmonious ascending chime for correct answers — pentatonic travel melody. */
export function playCorrect() {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    playTone(freq, 0.35, "sine", 0.10, i * 0.09);
    playTone(freq * 1.005, 0.35, "sine", 0.05, i * 0.09); // slight chorus
  });
}

/** Gentle low wobble for wrong answers. Non-punitive. */
export function playWrong() {
  playTone(180, 0.25, "triangle", 0.08);
  playTone(160, 0.2, "triangle", 0.06, 0.08);
}

/** Magical sparkle for hint reveal. */
export function playHint() {
  playTone(880, 0.15, "sine", 0.06);
  playTone(1318.5, 0.2, "sine", 0.05, 0.08);
  playNoise(0.1, 0.02, 0.05);
}

/** Rich celebratory fanfare for completing the game. */
export function playVictory() {
  // Triumphant chord progression: C major → G major → Am → F major → C major
  const chords = [
    [261.63, 329.63, 392.00],  // C
    [392.00, 493.88, 587.33],  // G
    [523.25, 659.25, 783.99],  // C5
  ];
  chords.forEach((chord, ci) => {
    chord.forEach((freq) => {
      playTone(freq, 0.5, "sine", 0.08, ci * 0.22);
      playTone(freq * 2, 0.4, "sine", 0.03, ci * 0.22 + 0.05);
    });
  });
  // Final sparkling high notes
  playTone(1046.50, 0.6, "sine", 0.06, 0.7);
  playTone(1318.51, 0.5, "sine", 0.04, 0.8);
  playTone(1567.98, 0.7, "sine", 0.05, 0.9);
}

/** Gentle click for button press. */
export function playButton() {
  playTone(600, 0.05, "square", 0.03);
}
