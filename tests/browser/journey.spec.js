import { test, expect } from "@playwright/test";
const answers = ["PARIS", "JAIPUR", "LONDON", "BARCELONA", "SANTORINI"];
async function start(page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Start a journey" }).click();
  await expect(page.locator("#answer")).toBeVisible();
}
async function solve(page, answer) {
  await page.locator("#answer").fill(answer);
  await page.locator("#answer").press("Enter");
}
test("full journey, refresh/resume, five pieces, reveal, leaderboard and replay", async ({
  page,
}) => {
  await start(page);
  await expect(page.locator(".map-piece:not(.removed)")).toHaveCount(5);
  await solve(page, " paris ");
  await expect(page.locator("#level-number")).toHaveText("2");
  await page.reload();
  await page.getByRole("button", { name: "Resume saved journey" }).click();
  await expect(page.locator("#level-number")).toHaveText("2");
  await expect(page.locator(".map-piece:not(.removed)")).toHaveCount(4);
  for (let i = 1; i < 4; i++) {
    await solve(page, answers[i]);
    await expect(page.locator("#level-number")).toHaveText(String(i + 2));
  }
  await expect(page.locator(".map-piece:not(.removed)")).toHaveCount(1);
  await expect(page.locator(".piece-4")).not.toHaveClass(/removed/);
  await solve(page, answers[4]);
  await expect(
    page.getByText("“Thank you for finding my phone!”"),
  ).toBeVisible();
  await expect(page.locator(".map-piece:not(.removed)")).toHaveCount(0);
  await page.getByRole("button", { name: "See your journey" }).click();
  await expect(page.locator("#final-score")).toHaveText("500");
  await page.locator("#nickname").fill("Browser Traveller");
  await page.getByRole("button", { name: "Save score" }).click();
  await expect(page.locator("#submitted")).toContainText("Browser Traveller");
  await expect(page.locator("#leaderboard")).toContainText("Browser Traveller");
  await page.getByRole("button", { name: "Take another journey" }).click();
  await expect(page.locator("#level-number")).toHaveText("1");
  await expect(page.locator("#score")).toHaveText("0");
  await expect(page.locator(".map-piece:not(.removed)")).toHaveCount(5);
});
test("recoverable API failure keeps input and safely retries a lost response", async ({
  page,
}) => {
  await start(page);
  await page.route(
    "**/api/session/answer",
    async (route) => {
      await route.fetch();
      await route.abort();
    },
    { times: 1 },
  );
  await solve(page, "PARIS");
  await expect(page.locator("#answer")).toHaveValue("PARIS");
  await expect(
    page.getByRole("button", { name: "Retry saved action" }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Resume saved journey" }).click();
  await expect(page.locator("#level-number")).toHaveText("2");
  await page.getByRole("button", { name: "Retry saved action" }).click();
  await expect(page.locator("#level-number")).toHaveText("2");
  await expect(page.locator("#score")).toHaveText("100");
  await expect(page.locator("#retry-area")).toBeEmpty();
});
test("320px mobile, longest word, keyboard instructions, hints and reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await start(page);
  await page.getByRole("button", { name: "How to play" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  for (let i = 0; i < 3; i++) {
    await page.locator("#hint").click();
    await expect(page.locator("#hint")).toContainText(`${2 - i} left`);
  }
  await expect(page.locator("#hint")).toBeDisabled();
  await solve(page, "PAR");
  await expect(page.locator("#feedback")).toContainText("No points lost");
  for (let i = 0; i < 4; i++) {
    await solve(page, answers[i]);
    await expect(page.locator("#level-number")).toHaveText(String(i + 2));
  }
  await expect(page.locator("#tiles span")).toHaveCount(9);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/mobile-level-five.png",
    fullPage: true,
  });
});
test("invalid saved session, portrait fallback and leaderboard failure are recoverable", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem(
      "wanderlock.session",
      JSON.stringify({ token: "f".repeat(64) }),
    ),
  );
  await page.reload();
  await page.getByRole("button", { name: "Resume saved journey" }).click();
  await expect(page.locator("#status")).toContainText("unavailable");
  await expect(
    page.getByRole("button", { name: "Start a journey" }),
  ).toBeVisible();
  await page.route("**/assets/portrait.svg", (route) => route.abort());
  await page.reload();
  await expect(page.locator(".owner-image")).toHaveAttribute(
    "src",
    "/assets/fallback.svg",
  );
  await page.getByRole("button", { name: "Start a journey" }).click();
  for (let i = 0; i < 5; i++) {
    await solve(page, answers[i]);
    if (i < 4)
      await expect(page.locator("#level-number")).toHaveText(String(i + 2));
  }
  await page.route("**/api/leaderboard", (route) => route.abort());
  await page.getByRole("button", { name: "See your journey" }).click();
  await expect(page.locator("#leaderboard-status")).toContainText(
    "unavailable",
  );
  await page.unroute("**/api/leaderboard");
  await page.getByRole("button", { name: "Refresh leaderboard" }).click();
  await expect(page.locator("#leaderboard-status")).not.toContainText(
    "unavailable",
  );
});
