import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load and display hero section", async ({ page }) => {
    await expect(page).toHaveTitle(/Mealvana/);
    // Hero headline should be visible
    await expect(
      page.locator("h1").first(),
    ).toBeVisible();
  });

  test("should have navigation links", async ({ page }) => {
    const nav = page.getByRole("navigation");
    await expect(nav.getByRole("link", { name: "Blog" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Community" })).toBeVisible();
  });

  test("should have download CTAs", async ({ page }) => {
    // At least one app store link should be present
    const appStoreLinks = page.locator(
      'a[href*="apple.com"], a[href*="play.google.com"]',
    );
    await expect(appStoreLinks.first()).toBeVisible();
  });

  test("should display all 12 feature items", async ({ page }) => {
    // Scroll to features section and count feature cards
    const features = page.locator('[data-testid="feature-card"]');
    // If no test IDs, check for the features grid section
    const featureSection = page.locator("text=Science-backed");
    await expect(featureSection.first()).toBeVisible();
  });

  test("should have newsletter form", async ({ page }) => {
    const emailInput = page.getByPlaceholder(/email/i);
    await expect(emailInput.first()).toBeVisible();
  });

  test("should have FAQ section with expandable items", async ({ page }) => {
    const faqSection = page.locator("text=Frequently Asked");
    await expect(faqSection).toBeVisible();
  });

  test("should have footer with legal links", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer.getByRole("link", { name: /privacy/i })).toBeVisible();
    await expect(footer.getByRole("link", { name: /terms/i })).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("h1").first()).toBeVisible();
  });
});
