# Wanderlock

Five destinations. One lost phone. A beginner-friendly BCA team project with a real Express/PostgreSQL backend.

Find the fictional traveller Maya by solving five anagrams and removing five pieces of her travel map. Defaults: **PARIS → JAIPUR → LONDON → BARCELONA → SANTORINI**, with **Easy → Medium → Medium → Hard → Hard** difficulty. Unlimited attempts, three paid letter hints, free shuffles, free extra clue after three wrong guesses, saved progress and a top-10 online leaderboard. No AI subscription or AI API is used by the game.

## Local setup

Install **Node.js 24 LTS**, npm, Git and **PostgreSQL 16+**. Dependencies are pinned in package.json and package-lock.json; use `npm ci`.

1. Extract/clone the project and open a terminal in `wanderlock`.
2. Install dependencies:
   ```bash
   npm ci
   ```
3. Create PostgreSQL databases `wanderlock` and `wanderlock_test`, owned by your development user, using pgAdmin or your PostgreSQL tools. Alternatively, with Docker Desktop running:
   ```bash
   docker compose up -d
   docker compose exec db createdb -U wanderlock wanderlock_test
   ```
   The optional local container's URL is `postgresql://wanderlock:local_dev_only@localhost:5432/wanderlock`. This password is for that local-only container. If you use an existing PostgreSQL installation, use your own credentials instead. Do not run both on the same occupied port.
4. Copy `.env.example` to `.env` (PowerShell: `Copy-Item .env.example .env`; macOS/Linux: `cp .env.example .env`). Set DATABASE_URL to the local game DB and TEST_DATABASE_URL to the separate test DB. Keep the placeholder-free values only in ignored `.env`.
5. Validate destinations and apply schema:
   ```bash
   npm run db:seed
   npm run db:migrate
   ```
   `db:seed` validates the JSON content source; it deliberately inserts no fake leaderboard entries. Sessions snapshot the destinations when created. Migrations are repeatable and transactional.
6. Terminal A:
   ```bash
   npm run dev:server
   ```
7. Terminal B:
   ```bash
   npm run dev
   ```
8. Open `http://localhost:5173`. Vite forwards `/api` to Express on port 3000. Production serves both on one domain.

Use localhost for browser development so `crypto.randomUUID()` is available in a secure context. Production uses HTTPS. If changing the local server port, update Vite's proxy target too.

## Production locally

```bash
npm run build
npm run db:migrate
npm start
```
Open `http://localhost:3000`. Express serves `client/dist` and `/api` using the same origin. `PORT` is read from the environment and the listener binds to `0.0.0.0`.

## Verification

```bash
npm run check
npm run test:integration
npx playwright install chromium
npm run test:e2e
```
Optional endpoint smoke checks: with a disposable server already running at localhost:3000, run `npm run test:api` (or set E2E_BASE_URL). These create test leaderboard entries.

Unit checks use Node's test runner. Integration tests require TEST_DATABASE_URL and create/drop their own random schema; do not use a production DB. Browser checks use DATABASE_URL and create game/leaderboard rows, so use a disposable development DB. CI provisions PostgreSQL automatically. See [actual results and limitations](docs/TEST-RESULTS.md), not just the list of test commands.

## Folder structure and responsibilities

| Folder/file | Purpose | Owner |
| --- | --- | --- |
| client/index.html, src/styles.css, src/theme.css | Welcome, guide, responsive styling | Member 1 |
| client/src/main.js, api.js | Input, controls, API and resume | Member 2 |
| client/src/views.js, public/assets | Map, reveal, results, leaderboard templates, original SVGs | Member 3 (coordinate shared templates) |
| server/data, game.js, store.js | Destination definitions, validation, scoring, sessions | Member 4 |
| database, server/db.js, tests, .github, render.yaml | PostgreSQL, leaderboard, integration and deployment | Member 5 |
| docs | Shared contracts, teamwork and presentation materials | All members |

[Detailed task checklists](docs/TEAM.md) · [Contributing and PR workflow](CONTRIBUTING.md) · [GitHub account setup](docs/GITHUB-SETUP.md).

## Rules

Completed level score = `max(0, 100 - 10 × wrong guesses - 20 × paid hints)`; total maximum 500. Only A–Z submissions of the correct length count as guesses; input is trimmed and case-insensitive. Each paid hint reveals the next correct letter in position. No time bonus. After three wrong guesses, the extra clue is free. All mutations are calculated on the backend and persisted in PostgreSQL; a request ID, state version and row lock protect against duplicate effects.

[API contract](docs/API.md) · [Architecture and database interface](docs/ARCHITECTURE.md) · [Edit destinations and playtest](docs/DESTINATIONS.md).

## Deployment and project presentation

[Render deployment steps](docs/DEPLOYMENT.md) include a single Node service, same-region PostgreSQL, internal URL, free-plan limitations and post-deployment checklist. `render.yaml` is an optional reviewed blueprint. No remote repository or public deployment has been created for this handoff.

[Five-minute demo](docs/DEMO.md) · [AI-use log template](docs/AI-USE-LOG.md).

## Troubleshooting

- DATABASE_URL missing/auth failure: configure ignored `.env`, start PostgreSQL, verify DB name/user/password. URL-encode special password characters.
- Schema missing: run `npm run db:migrate`. Migration errors stop startup rather than silently using temporary files.
- API unavailable: check `/api/health`, server logs and Vite proxy. On free Render, allow for a cold start and retry.
- Pending action after a network failure: use **Retry saved action**, which reuses its original ID. A refresh can also Resume and safely retry it.
- Invalid save: start a fresh journey. Clearing localStorage loses access to the anonymous token; there is no account recovery.
- Changed destinations not showing: restart/redeploy Express and start a NEW session. Old sessions intentionally retain their original puzzles.

Anonymous tokens are bearer credentials stored in localStorage; share neither tokens nor browser profiles. Scores are server-authoritative but this is an educational game, not strong anti-cheat: clues, scrambles and source can reveal solutions. Rate limiting is basic and single-instance. Nicknames are public and have no moderation system. See limitations before wider use.
