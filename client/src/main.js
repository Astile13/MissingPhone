import "./styles.css";
import { api, readSaved, saveLocal } from "./api.js";
import {
  welcome,
  game,
  reveal,
  results,
  setText,
  imageFallback,
} from "./views.js";
import {
  playTileClick,
  playShuffle,
  playCorrect,
  playWrong,
  playHint,
  playVictory,
  playButton,
  isMuted,
  toggleMute,
} from "./audio.js";
import { burst, celebrate } from "./confetti.js";

const app = document.querySelector("#app");
let saved = readSaved(),
  session = null,
  busy = false,
  screen = "welcome";

// Tile swap state
let tileLetters = []; // current arrangement of letters
let selectedTileIndex = null; // index of first selected tile for swap

const $ = (id) => document.getElementById(id);
const announce = (message) => setText("status", message);

function persist() {
  if (!saveLocal(saved))
    announce(
      "Browser storage is unavailable. This journey can be played, but cannot resume after closing.",
    );
}
function replace(markup) {
  app.innerHTML = markup;
  imageFallback();
  app.focus({ preventScroll: true });
}
function lock(value) {
  busy = value;
  app.setAttribute("aria-busy", String(value));
  app.querySelectorAll("button,input").forEach((el) => (el.disabled = value));
  if (!value && session?.puzzle && $("hint"))
    $("hint").disabled =
      session.hintsRemaining === 0 ||
      session.puzzle.paidHints >= session.puzzle.length;
}

// --- Sound toggle ---
function updateSoundToggle() {
  const btn = $("sound-toggle");
  if (!btn) return;
  btn.textContent = isMuted() ? "🔇" : "🔊";
  btn.setAttribute("aria-label", isMuted() ? "Unmute sound" : "Mute sound");
}

function initSoundToggle() {
  const btn = $("sound-toggle");
  if (!btn) return;
  btn.onclick = () => {
    toggleMute();
    updateSoundToggle();
  };
  updateSoundToggle();
}

// --- Welcome ---
function showWelcome() {
  screen = "welcome";
  replace(welcome(Boolean(saved.token)));
  $("start").onclick = () => { playButton(); start(); };
  if ($("resume")) $("resume").onclick = () => { playButton(); resume(); };
  initSoundToggle();
}

async function start() {
  if (busy) return;
  lock(true);
  announce("Opening a new journey…");
  try {
    const data = await api("/sessions", { body: {} });
    saved = { token: data.token };
    persist();
    session = data.session;
    showGame();
    announce("Journey started. Find your first destination.");
  } catch (error) {
    announce(error.message);
  } finally {
    lock(false);
  }
}

async function resume() {
  if (busy) return;
  lock(true);
  announce("Finding your saved journey…");
  try {
    session = (await api("/session", { token: saved.token })).session;
    session.completed ? showResults() : showGame();
    announce("Your journey is restored.");
  } catch (error) {
    if (error.status === 401) {
      saved = {};
      persist();
      showWelcome();
    }
    announce(error.message);
  } finally {
    lock(false);
  }
}

// --- Swap-based Tile Interaction ---
function drawTiles(word) {
  const box = $("tiles");
  box.replaceChildren();
  box.style.setProperty("--letters", word.length);
  tileLetters = [...word];
  selectedTileIndex = null;
  renderTiles();
}

function renderTiles() {
  const box = $("tiles");
  if (!box) return;
  box.replaceChildren();
  box.style.setProperty("--letters", tileLetters.length);

  for (let i = 0; i < tileLetters.length; i++) {
    const tile = document.createElement("span");
    tile.textContent = tileLetters[i];
    tile.dataset.index = i;
    tile.classList.add("tile");
    if (i === selectedTileIndex) tile.classList.add("selected");
    tile.setAttribute("role", "button");
    tile.setAttribute("tabindex", "0");
    tile.setAttribute("aria-label", `Letter ${tileLetters[i]}, position ${i + 1}`);
    if (i === selectedTileIndex) tile.setAttribute("aria-pressed", "true");

    tile.onclick = () => handleTileClick(i);
    tile.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleTileClick(i);
      }
    };

    box.append(tile);
  }
  box.setAttribute("aria-label", `Letters: ${tileLetters.join(", ")}`);
}

function handleTileClick(index) {
  if (busy) return;

  if (selectedTileIndex === null) {
    // First tile selected
    selectedTileIndex = index;
    playTileClick();
    renderTiles();
  } else if (selectedTileIndex === index) {
    // Deselect
    selectedTileIndex = null;
    playTileClick();
    renderTiles();
  } else {
    // Swap the two tiles
    playTileClick();
    const temp = tileLetters[selectedTileIndex];
    tileLetters[selectedTileIndex] = tileLetters[index];
    tileLetters[index] = temp;
    selectedTileIndex = null;

    // Animate the swap
    renderTiles();
    const tiles = $("tiles").children;
    // No need for complex animation — the re-render is instant and the click feedback is enough
  }
}

/** Read the current tile arrangement as the answer string. */
function getCurrentAnswer() {
  return tileLetters.join("");
}

// --- Game Screen ---
function showGame() {
  screen = "game";
  replace(game(session));
  initSoundToggle();
  const p = session.puzzle;
  setText("level-number", session.level);
  setText("score", session.totalScore);
  setText("difficulty", p.difficulty);
  setText("word-length", `${p.length} letters`);
  setText("clue", p.clue);
  $("extra-clue").hidden = !p.extraClue;
  setText("extra-clue", `Extra clue · ${p.extraClue || ""}`);
  drawTiles(p.scramble);
  setText(
    "revealed",
    p.paidHints
      ? `Letter hints: ${p.revealed.map((c) => c || "＿").join(" ")} (${p.paidHints} revealed)`
      : "A new place is waiting in these letters.",
  );
  setText("hint", `Hint · −20 pts (${session.hintsRemaining} left)`);
  setText(
    "potential",
    `${p.potentialScore} points available here · ${p.wrongAnswers} wrong guesses · Unlimited attempts`,
  );

  $("submit").onclick = () => {
    if (busy) return;
    const answer = getCurrentAnswer();
    act("answer", { levelId: p.id, answer });
  };
  $("hint").onclick = () => act("hint", { levelId: p.id });
  $("shuffle").onclick = shuffle;
  $("home").onclick = () => {
    if (!busy) showWelcome();
  };
  if (saved.pending) showRetry();
  lock(busy);
  $("clue").focus({ preventScroll: true });
}

function showRetry() {
  const area = $("retry-area");
  if (!area) return;
  area.replaceChildren();
  const p = document.createElement("p");
  p.textContent =
    "A previous action may have reached the server. Retry it safely before continuing.";
  const button = document.createElement("button");
  button.className = "secondary";
  button.textContent = "Retry saved action";
  button.onclick = () => act();
  area.append(p, button);
}

async function act(kind, fields) {
  if (busy) return;
  // Keep a pending action across network failures AND refresh. Never allocate another ID for its retry.
  if (saved.pending && kind) {
    showRetry();
    setText("feedback", "Retry the saved action below first.");
    return;
  }
  if (!saved.pending) {
    saved.pending = {
      kind,
      body: {
        requestId: crypto.randomUUID(),
        version: session.version,
        ...fields,
      },
    };
    persist();
  }
  const pending = saved.pending;
  const oldSolved = session.solvedCount;
  lock(true);
  setText("feedback", "Saving your journey…");
  try {
    const data = await api(`/session/${pending.kind}`, {
      token: saved.token,
      body: pending.body,
    });
    session = data.session;
    delete saved.pending;
    if (data.result.type === "correct") {
      delete saved.draft;
      delete saved.draftLevel;
    }
    persist();
    if (
      data.result.type === "correct" &&
      session.solvedCount > oldSolved &&
      screen === "game"
    ) {
      playCorrect();
      burst(); // confetti on level solve
      setText("feedback", data.result.message);
      announce(data.result.message);
      document
        .querySelector(`[data-piece="${oldSolved}"]`)
        ?.classList.add("removed");
      document.querySelector(".map-label")?.setAttribute("hidden", "");
      // Bounded wait: progression never relies on animationend.
      await new Promise((resolve) =>
        setTimeout(
          resolve,
          matchMedia("(prefers-reduced-motion: reduce)").matches ? 30 : 750,
        ),
      );
      if (session.completed) {
        playVictory();
        celebrate();
        showReveal();
      } else {
        showGame();
      }
    } else if (data.result.type === "incorrect") {
      playWrong();
      // Shake the tiles on wrong answer but stay on same arrangement
      $("tiles")?.classList.add("shake");
      setText("feedback", data.result.message);
    } else if (data.result.type === "hint") {
      playHint();
      showGame();
      setText("feedback", data.result.message);
    } else if (session.completed) {
      showResults();
    } else {
      showGame();
      setText("feedback", data.result.message);
    }
  } catch (error) {
    if (error.status === 401) {
      saved = {};
      persist();
      showWelcome();
      announce(error.message);
    } else if (error.status === 409) {
      delete saved.pending;
      persist();
      try {
        session = (await api("/session", { token: saved.token })).session;
        session.completed ? showResults() : showGame();
      } catch {}
      setText(
        "feedback",
        `${error.message} Use Save & leave, then Resume if progress is out of date.`,
      );
    } else {
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        delete saved.pending;
        persist();
      } else showRetry();
      setText("feedback", error.message);
    }
  } finally {
    lock(false);
  }
}

async function shuffle() {
  if (busy || saved.pending) {
    if (saved.pending) showRetry();
    return;
  }
  lock(true);
  playShuffle();
  try {
    const newScramble = (await api("/session/shuffle", { token: saved.token, body: {} })).scramble;
    drawTiles(newScramble);
    setText("feedback", "A fresh arrangement. Same letters, no points lost.");
  } catch (error) {
    setText("feedback", error.message);
  } finally {
    lock(false);
  }
}

function showReveal() {
  screen = "reveal";
  replace(reveal());
  initSoundToggle();
  $("results").onclick = () => { playButton(); showResults(); };
  announce("Phone unlocked. Thank you for finding my phone!");
}

function showResults() {
  screen = "results";
  replace(results());
  initSoundToggle();
  setText("final-score", session.totalScore);
  for (const level of session.breakdown) {
    const tr = document.createElement("tr");
    for (const value of [
      level.destination,
      level.wrongAnswers,
      level.paidHints,
      level.score,
    ]) {
      const td = document.createElement("td");
      td.textContent = value;
      tr.append(td);
    }
    $("breakdown").append(tr);
  }
  $("nickname-form").hidden = Boolean(session.nickname);
  $("submitted").hidden = !session.nickname;
  setText("submitted", `Saved as ${session.nickname}. Thanks for playing!`);
  $("nickname").value = saved.nicknameDraft || "";
  $("nickname").oninput = () => {
    saved.nicknameDraft = $("nickname").value;
    persist();
  };
  $("nickname-form").onsubmit = (e) => {
    e.preventDefault();
    act("nickname", { nickname: $("nickname").value });
  };
  $("replay").onclick = () => { playButton(); start(); };
  $("reload-board").onclick = loadBoard;
  if (saved.pending) showRetry();
  loadBoard();
}

async function loadBoard() {
  const current = $("leaderboard");
  if (!current) return;
  setText("leaderboard-status", "Loading journeys…");
  try {
    const data = await api("/leaderboard");
    if (current !== $("leaderboard")) return;
    current.replaceChildren();
    for (const entry of data.entries) {
      const li = document.createElement("li");
      const rank = document.createElement("span");
      rank.className = "rank";
      rank.textContent = String(entry.rank).padStart(2, "0");
      const name = document.createElement("span");
      name.textContent = entry.nickname;
      const score = document.createElement("strong");
      score.textContent = `${entry.score} pts`;
      li.append(rank, name, score);
      current.append(li);
    }
    setText(
      "leaderboard-status",
      data.entries.length
        ? "Ranked by points, then earliest finish."
        : "The journal is waiting for its first traveller.",
    );
  } catch {
    if (current === $("leaderboard"))
      setText(
        "leaderboard-status",
        "The leaderboard is unavailable. Your journey is safe. Try Refresh leaderboard.",
      );
  }
}
$("help").onclick = () => $("instructions").showModal();
$("close-help").onclick = () => $("instructions").close();
initSoundToggle();
showWelcome();
