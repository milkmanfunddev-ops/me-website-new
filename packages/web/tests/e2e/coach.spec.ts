import { test, expect, type Page } from "@playwright/test";
import { COACH_CALL_BOOKING_URL } from "@mealvana/shared";

const H1 = "Your athletes' fueling, handled.";
const DEMO_BUTTON = "Book a 30-minute demo";

const SECTIONS = [
  "hero",
  "credential",
  "how-it-works",
  "dashboard",
  "cost",
  "founding-coach",
  "faq",
  "testimonials",
  "who-we-are",
  "final-cta",
];

async function openMenuIfMobile(page: Page) {
  // Below the md breakpoint the nav lives behind the header's menu button.
  const desktopNav = page.locator("header nav").first();
  if (await desktopNav.isVisible()) return;
  // A click that lands before hydration does nothing, so retry until it opens.
  await expect(async () => {
    await page.locator("header button").last().click();
    await expect(page.locator("header nav:visible")).toBeVisible({
      timeout: 1000,
    });
  }).toPass();
}

test.describe("/coach", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/coach");
  });

  test("has the coach H1 and a coach-facing title and description", async ({
    page,
  }) => {
    await expect(page.locator("h1")).toHaveText(H1);
    await expect(page).toHaveTitle(/coach/i);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /coach/i,
    );
  });

  test("renders the coach sections in order", async ({ page }) => {
    const names = await page
      .locator("[data-coach-section]")
      .evaluateAll((els) =>
        els.map((el) => el.getAttribute("data-coach-section")),
      );
    expect(names).toEqual(SECTIONS);
  });

  test("local sample testimonials are clearly marked for review", async ({
    page,
  }) => {
    const testimonials = page.locator('[data-coach-section="testimonials"]');
    await expect(testimonials.getByText("Sample quotes for layout review")).toBeVisible();
    await expect(testimonials.locator("blockquote")).toHaveCount(3);
  });

  test("both demo buttons point at the booking URL and open a new tab", async ({
    page,
  }) => {
    const buttons = page.getByRole("link", { name: DEMO_BUTTON });
    await expect(buttons).toHaveCount(2);
    for (const button of await buttons.all()) {
      await expect(button).toHaveAttribute("href", COACH_CALL_BOOKING_URL);
      await expect(button).toHaveAttribute("target", "_blank");
    }

    // Stop the click at the network so the test never loads Google.
    await page
      .context()
      .route("https://calendar.app.google/**", (route) =>
        route.fulfill({ body: "booking page" }),
      );
    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      buttons.first().click(),
    ]);
    expect(popup.url()).toBe(COACH_CALL_BOOKING_URL);
  });

  test("the hero button is visible on the first screen", async ({ page }) => {
    await expect(
      page
        .locator('[data-coach-section="hero"]')
        .getByRole("link", { name: DEMO_BUTTON }),
    ).toBeInViewport();
  });

  test('"See how it works" scrolls to the steps', async ({ page }) => {
    const steps = page.locator("#how-it-works");
    await expect(steps).not.toBeInViewport();
    await page.getByRole("link", { name: "See how it works" }).click();
    await expect(steps).toBeInViewport();
  });

  test("does not link to the coach application", async ({ page }) => {
    await expect(
      page.locator("main a[href*='coach_registration']"),
    ).toHaveCount(0);
  });

  test("has no horizontal scroll at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/coach");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    // The hero clips decorative artwork, so page overflow alone cannot catch
    // a grid column that clips the headline and booking links on mobile.
    const heroCopy = await page.locator(".coach-hero-copy").boundingBox();
    expect(heroCopy).not.toBeNull();
    expect(heroCopy!.x + heroCopy!.width).toBeLessThanOrEqual(390);
  });
});

test.describe("For Coaches link", () => {
  test("the menu links to /coach", async ({ page }) => {
    await page.goto("/");
    await openMenuIfMobile(page);
    const link = page
      .locator("header nav:visible")
      .getByRole("link", { name: "For Coaches" });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/coach$/);
    await expect(page.locator("h1")).toHaveText(H1);
  });

  test("the footer links to /coach", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator("footer").getByRole("link", { name: "For Coaches" }),
    ).toHaveAttribute("href", "/coach");
  });
});
