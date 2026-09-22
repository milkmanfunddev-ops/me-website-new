import { test, expect, type Page } from "@playwright/test";
import { COACH_CALL_BOOKING_URL } from "@mealvana/shared";

/* Analytics as the network sees it. Every Mixpanel request is answered here,
 * so these tests send no real data. The dev server gets a fake token from
 * playwright.config.ts, because without a token the site sends nothing. */

type SentEvent = { event: string; properties: Record<string, unknown> };

/** Mixpanel posts `data=<JSON>`, one event or a batch of them. The JSON is
 * sometimes base64-encoded, depending on the payload format it picks. */
function decode(body: string): SentEvent[] {
  const data = new URLSearchParams(body).get("data");
  if (!data) return [];
  const json = data.startsWith("[") || data.startsWith("{")
    ? data
    : Buffer.from(data, "base64").toString("utf8");
  const parsed = JSON.parse(json);
  return Array.isArray(parsed) ? parsed : [parsed];
}

async function interceptMixpanel(page: Page) {
  const requests: string[] = [];
  const events: SentEvent[] = [];
  await page.context().route(/mixpanel\.com/, async (route) => {
    const request = route.request();
    requests.push(request.url());
    events.push(...decode(request.postData() ?? ""));
    await route.fulfill({ status: 200, body: "1" });
  });
  return { requests, events };
}

const named = (events: SentEvent[], name: string) =>
  events.filter((e) => e.event === name).map((e) => e.properties);

async function expectNoBanner(page: Page) {
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Decline" })).toHaveCount(0);
}

// Mixpanel batches most events on a 5-second timer.
const BATCH_WAIT = { timeout: 15_000 };

test.describe("a US visitor", () => {
  test.use({ timezoneId: "America/Chicago", locale: "en-US" });

  test("is tracked on load and on the demo button, with no banner", async ({
    page,
  }) => {
    const mixpanel = await interceptMixpanel(page);
    await page.context().route("https://calendar.app.google/**", (route) =>
      route.fulfill({ body: "booking page" }),
    );

    await page.goto("/coach");
    await expect.poll(() => mixpanel.requests.length, BATCH_WAIT).toBeGreaterThan(0);
    await expectNoBanner(page);

    const hero = page
      .locator('[data-coach-section="hero"]')
      .getByRole("link", { name: "Book a 30-minute demo" });
    // A click before hydration opens the booking page but records nothing.
    await expect(async () => {
      const [popup] = await Promise.all([page.waitForEvent("popup"), hero.click()]);
      expect(popup.url()).toBe(COACH_CALL_BOOKING_URL);
      await popup.close();
      expect(named(mixpanel.events, "coach_cta_clicked")).toContainEqual(
        expect.objectContaining({ button: "hero" }),
      );
    }).toPass({ timeout: 10_000 });
  });

  test("sends a pageview", async ({ page }) => {
    const mixpanel = await interceptMixpanel(page);
    await page.goto("/coach");

    await expect
      .poll(() => named(mixpanel.events, "$mp_web_page_view").length, BATCH_WAIT)
      .toBeGreaterThan(0);
  });

  test("records each /coach section once as it is read", async ({ page }) => {
    const mixpanel = await interceptMixpanel(page);
    await page.goto("/coach");
    // The first request means the page has hydrated and is watching.
    await expect.poll(() => mixpanel.requests.length, BATCH_WAIT).toBeGreaterThan(0);

    // Scroll down in steps, then back up, as a reader would.
    for (const section of await page.locator("[data-coach-section]").all()) {
      // Finish each scroll before reading the next section. Smooth scrolling
      // can be interrupted on the longer coach page before the target appears.
      await section.evaluate((el) =>
        el.scrollIntoView({ block: "center", behavior: "instant" }),
      );
      await page.waitForTimeout(150);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));

    const sections = await page
      .locator("[data-coach-section]")
      .evaluateAll((els) => els.map((el) => el.getAttribute("data-coach-section")));
    await expect
      .poll(
        () => named(mixpanel.events, "coach_section_viewed").map((p) => p.section).sort(),
        BATCH_WAIT,
      )
      .toEqual([...sections].sort());
  });

  test("records an app store click with the store and the page", async ({
    page,
  }) => {
    const mixpanel = await interceptMixpanel(page);
    await page.context().route(/apps\.apple\.com|play\.google\.com/, (route) =>
      route.fulfill({ body: "store" }),
    );
    await page.goto("/coach");
    await expect.poll(() => mixpanel.requests.length, BATCH_WAIT).toBeGreaterThan(0);

    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      page.locator("footer a[href*='apps.apple.com']").click(),
    ]);
    await popup.close();

    await expect
      .poll(() => named(mixpanel.events, "app_store_clicked"), BATCH_WAIT)
      .toContainEqual(expect.objectContaining({ store: "app_store", page: "/coach" }));
  });
});

/* Every page without a URL parameter. Pages load straight from the URL, as
 * from a search result or a shared link, so each one proves the root layout
 * starts analytics there. */
const PAGES = [
  "/", "/about", "/blog", "/changelog", "/checkout/cancel", "/checkout/success",
  "/coach", "/coach_registration", "/community", "/community/new",
  "/compare/mealvana-vs-mavr", "/demo", "/faq", "/integrations",
  "/integrations/final-surge", "/integrations/garmin", "/integrations/strava",
  "/integrations/training-peaks", "/links", "/privacy", "/race-day-calculator",
  "/race-day-calculator/custom", "/race-day-calculator/rocket-city-marathon-2026",
  "/sign-in", "/sign-up", "/support", "/terms",
];

test.describe("every page", () => {
  test.use({ timezoneId: "America/Chicago", locale: "en-US" });

  for (const path of PAGES) {
    test(`${path} sends a pageview for its own path`, async ({ page }) => {
      const mixpanel = await interceptMixpanel(page);
      await page.goto(path);

      await expect
        .poll(
          () =>
            named(mixpanel.events, "$mp_web_page_view").map(
              (p) => p.current_url_path,
            ),
          BATCH_WAIT,
        )
        .toContain(path);
    });
  }

  test("a link to another page sends a second pageview without a reload", async ({
    page,
  }) => {
    const mixpanel = await interceptMixpanel(page);
    await page.goto("/");
    await expect.poll(() => mixpanel.requests.length, BATCH_WAIT).toBeGreaterThan(0);

    // The footer link, because the header's is behind a menu on a phone.
    await page.locator("footer").getByRole("link", { name: "For Coaches" }).click();
    await expect(page).toHaveURL(/\/coach$/);

    await expect
      .poll(
        () =>
          named(mixpanel.events, "$mp_web_page_view").map((p) => p.current_url_path),
        BATCH_WAIT,
      )
      .toEqual(expect.arrayContaining(["/", "/coach"]));
  });
});

test.describe("a visitor in Europe/Berlin", () => {
  test.use({ timezoneId: "Europe/Berlin", locale: "en-US" });

  test("sends nothing and sees no banner", async ({ page }) => {
    const mixpanel = await interceptMixpanel(page);
    await page.context().route("https://calendar.app.google/**", (route) =>
      route.fulfill({ body: "booking page" }),
    );

    await page.goto("/coach");
    await expectNoBanner(page);
    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "Book a 30-minute demo" }).first().click(),
    ]);
    await popup.close();

    // Longer than Mixpanel's batch timer, so a queued event would have gone out.
    await page.waitForTimeout(7_000);
    expect(mixpanel.requests).toEqual([]);
  });
});
