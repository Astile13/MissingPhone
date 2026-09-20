// Templates contain trusted static markup. Configured clues, nicknames and server messages use textContent.
export function phone(solved = 0) {
  return `<div class="phone" aria-label="Found phone"><div class="phone-top"><span>WANDERLOCK</span><span aria-hidden="true">▰</span></div><div class="portrait"><img class="owner-image" src="/assets/portrait.svg" alt="Illustration of the fictional traveller Maya" ${solved < 5 ? 'aria-hidden="true"' : ""}>${[0, 1, 2, 3, 4].map((i) => `<div class="map-piece piece-${i} ${i < solved ? "removed" : ""}" data-piece="${i}" aria-hidden="true"></div>`).join("")}<div class="map-label" ${solved ? "hidden" : ""}><span>THE WAY BACK</span><strong>Every place<br>holds a clue.</strong><span>FOLLOW THE JOURNEY ↗</span></div></div><div class="phone-bottom"><span class="lock-label">${solved === 5 ? "PHONE UNLOCKED" : `${solved} OF 5 MEMORIES FOUND`}</span><div class="phone-line"></div></div></div>`;
}
export function welcome(hasSave) {
  return `<section class="welcome"><div class="intro"><div class="eyebrow"><span class="tiny-line"></span>A LOST PHONE. A LITTLE ADVENTURE.</div><h1>Some journeys<br>bring us <em>back.</em></h1><p class="lead">A stranger left their phone behind. Five scrambled destinations are all you have to find them.</p><p class="intro-note">Follow the clues. Unfold the map.<br>Discover the person behind the journey.</p><div class="start-actions"><button id="start" class="primary">Start a journey <span>→</span></button>${hasSave ? '<button id="resume" class="secondary">Resume saved journey ↗</button>' : ""}</div><div class="trip-details"><span>◎ &nbsp;5 destinations</span><span>◷ &nbsp;About 5–10 minutes</span><span>♡ &nbsp;No time pressure</span></div></div><div class="phone-scene"><div class="postcard"><span>TRAVEL NOTES</span><strong>Not all who<br>wander are lost.</strong><span>But someone lost a phone.</span></div>${phone()}<div class="round-stamp">A SMALL<br><b>GOOD DEED</b><br>GOES A LONG WAY</div></div></section>`;
}
export function game(s) {
  const destNames = ["Paris", "Jaipur", "London", "Barcelona", "Santorini"];
  const stamps = Array.from({ length: 5 }, (_, i) => {
    if (i < s.solvedCount) {
      return `<li class="done" ${i + 1 === s.level ? 'aria-current="step"' : ""}><span>✓</span><small>${destNames[i]}</small><div class="passport-stamp">${destNames[i].toUpperCase()}</div></li>`;
    }
    return `<li class="${i + 1 === s.level ? "current" : ""}" ${i + 1 === s.level ? 'aria-current="step"' : ""}><span>${i + 1}</span><small>${i === 0 ? "Easy" : i < 3 ? "Medium" : "Hard"}</small></li>`;
  }).join("");

  return `<section class="game"><div class="journey-heading"><div><span class="eyebrow">THE JOURNEY HOME</span><h1>One place closer.</h1></div><button id="home" class="quiet">Save & leave ↗</button></div><div class="game-grid"><div class="game-phone">${phone(s.solvedCount)}<p class="fine">Each destination uncovers a little more.</p></div><div class="puzzle-panel"><div class="stats"><span>DESTINATION <b id="level-number"></b> / 5</span><span><b id="score"></b> pts earned</span></div><ol class="stops" aria-label="Journey progress">${stamps}</ol><div class="clue-card"><div class="clue-top"><span id="difficulty" class="eyebrow"></span><span id="word-length"></span></div><h2 id="clue" tabindex="-1"></h2><p id="extra-clue" class="extra-clue" hidden></p></div><div id="tiles" class="tiles" aria-label="Swap tiles to spell the destination"></div><p id="revealed" class="revealed"></p><p id="swap-hint" class="fine swap-hint">Tap one tile, then another to swap them.</p><div class="puzzle-controls"><button id="submit" class="primary">Check answer →</button><button id="shuffle" class="secondary">⇄ &nbsp;Shuffle · free</button><button id="hint" class="secondary"></button></div><p class="fine score-note" id="potential"></p><div id="retry-area"></div><p id="feedback" class="feedback" role="status" aria-live="polite"></p></div></div></section>`;
}
export function reveal() {
  return `<section class="reveal">${phone(5)}<div><span class="eyebrow">FIVE PLACES. ONE HAPPY REUNION.</span><h1>You found<br><em>your traveller.</em></h1><h2>"Thank you for finding my phone!"</h2><p class="lead">I'm Maya. Collector of postcards, chaser of sunsets.<br>And today, very grateful for a curious stranger.</p><button id="results" class="primary">See your journey →</button><p class="fine">Maya is a fictional character, illustrated for Wanderlock.</p></div></section>`;
}
export function results() {
  return `<section class="results"><div class="results-head"><span class="eyebrow">A JOURNEY WELL TRAVELLED</span><h1>Good deeds look good on you.</h1><p class="big-score"><span id="final-score"></span><small> / 500 points</small></p></div><div class="results-grid"><section class="paper"><h2>Your travel notes</h2><p class="fine">100 per destination − 10 per wrong guess − 20 per hint. Minimum 0 per destination.</p><div class="table-scroll"><table><caption class="sr-only">Score breakdown</caption><thead><tr><th>Destination</th><th>Wrong</th><th>Hints</th><th>Points</th></tr></thead><tbody id="breakdown"></tbody></table></div><form id="nickname-form" novalidate><label for="nickname">Leave a name in the travel journal</label><div class="answer-row"><input id="nickname" maxlength="20" autocomplete="nickname" placeholder="Your nickname" aria-describedby="nickname-help"><button class="primary" id="save-score">Save score →</button></div><p class="fine" id="nickname-help">2–20 letters, numbers, spaces, underscores or hyphens. This name will be public.</p></form><p id="submitted" hidden></p><div id="retry-area"></div><p id="feedback" class="feedback" role="status" aria-live="polite"></p></section><section class="paper leaderboard"><div class="section-line"><h2>Fellow wanderers</h2><span>TOP 10</span></div><p id="leaderboard-status" role="status">Loading journeys…</p><ol id="leaderboard"></ol><button id="reload-board" class="quiet">Refresh leaderboard ↻</button></section></div><button id="replay" class="primary replay">Take another journey →</button></section>`;
}
export function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
export function imageFallback() {
  document.querySelectorAll(".owner-image").forEach((img) =>
    img.addEventListener(
      "error",
      () => {
        img.src = "/assets/fallback.svg";
      },
      { once: true },
    ),
  );
}
