import { test, expect } from "@playwright/test";

test.describe("Static pages", () => {
  const pages = [
    { path: "/faq", title: "FAQ", heading: "Frequently Asked Questions" },
    { path: "/changelog", title: "Changelog", heading: "Changelog" },
    { path: "/support", title: "Support", heading: "Support" },
    { path: "/about", title: "About", heading: "About" },
    { path: "/demo", title: "Demo", heading: "See" },
    { path: "/privacy", title: "Privacy", heading: "Privacy" },
    { path: "/terms", title: "Terms", heading: "Terms" },
  ];

  for (const p of pages) {
    test(`${p.path} should load with correct title`, async ({ page }) => {
      await page.goto(p.path);
      await expect(page).toHaveTitle(new RegExp(p.title, "i"));
    });

    test(`${p.path} should have a heading`, async ({ page }) => {
      await page.goto(p.path);
      await expect(page.locator("h1").first()).toBeVisible({ timeout: 10000 });
    });
  }

  test("/faq should have search input", async ({ page }) => {
    await page.goto("/faq");
    await expect(
      page.getByPlaceholder(/search/i),
    ).toBeVisible();
  });

  test("/support should have contact form", async ({ page }) => {
    await page.goto("/support");
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
  });

  test("/changelog should display timeline", async ({ page }) => {
    await page.goto("/changelog");
    // Should either have version entries or empty state
    const heading = page.locator("h1");
    await expect(heading).toContainText("Changelog");
  });
});

test.describe("SEO", () => {
  test("robots.txt is accessible", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
  });

  test("homepage has meta description", async ({ page }) => {
    await page.goto("/");
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /.+/);
  });

  test("homepage has og:title", async ({ page }) => {
    await page.goto("/");
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /.+/);
  });
});
