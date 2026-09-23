/**
 * Wanderlock Confetti — lightweight canvas-based particle burst.
 * Used for level completion celebrations and the final phone unlock.
 */

const COLORS = [
  "#b74d30", // orange
  "#294f40", // green
  "#e9d3a7", // gold
  "#d8dcc4", // sage
  "#fffaf0", // cream
  "#5b8a72", // teal
  "#c9553d", // warm red
  "#8B6914", // dark gold
];

let canvas = null;
let animCtx = null;
let particles = [];
let rafId = null;

function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement("canvas");
  canvas.id = "confetti-canvas";
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999;";
  document.body.appendChild(canvas);
  animCtx = canvas.getContext("2d");
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);
}

function createParticle(x, y) {
  const angle = Math.random() * Math.PI * 2;
  const speed = 2 + Math.random() * 6;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed * (0.5 + Math.random()),
    vy: Math.sin(angle) * speed - 3 - Math.random() * 4,
    w: 4 + Math.random() * 6,
    h: 3 + Math.random() * 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 12,
    gravity: 0.08 + Math.random() * 0.06,
    drag: 0.98 + Math.random() * 0.015,
    opacity: 1,
    fadeRate: 0.004 + Math.random() * 0.004,
    shape: Math.random() > 0.5 ? "rect" : "circle",
  };
}

function tick() {
  if (!animCtx || particles.length === 0) {
    rafId = null;
    return;
  }
  animCtx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.vx *= p.drag;
    p.vy += p.gravity;
    p.vy *= p.drag;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotSpeed;
    p.opacity -= p.fadeRate;
    if (p.opacity <= 0 || p.y > canvas.height + 20) {
      particles.splice(i, 1);
      continue;
    }
    animCtx.save();
    animCtx.translate(p.x, p.y);
    animCtx.rotate((p.rotation * Math.PI) / 180);
    animCtx.globalAlpha = p.opacity;
    animCtx.fillStyle = p.color;
    if (p.shape === "rect") {
      animCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    } else {
      animCtx.beginPath();
      animCtx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
      animCtx.fill();
    }
    animCtx.restore();
  }
  rafId = requestAnimationFrame(tick);
}

/**
 * Fire a confetti burst from a point.
 * @param {number} x - Center x (default: center of viewport)
 * @param {number} y - Center y (default: 40% from top)
 * @param {number} count - Number of particles
 */
export function burst(x, y, count = 80) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  ensureCanvas();
  if (x === undefined) x = canvas.width / 2;
  if (y === undefined) y = canvas.height * 0.38;
  for (let i = 0; i < count; i++) {
    particles.push(createParticle(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 20));
  }
  if (!rafId) rafId = requestAnimationFrame(tick);
}

/**
 * Large celebration burst from multiple positions — used for final victory.
 */
export function celebrate() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  ensureCanvas();
  const cx = canvas.width / 2;
  const cy = canvas.height * 0.35;
  burst(cx, cy, 100);
  setTimeout(() => burst(cx - 120, cy + 50, 50), 150);
  setTimeout(() => burst(cx + 120, cy + 50, 50), 300);
  setTimeout(() => burst(cx, cy - 30, 60), 450);
}
