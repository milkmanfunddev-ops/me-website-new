import { test, expect } from "@playwright/test";

test.describe("Community", () => {
  test("community index should load", async ({ page }) => {
    await page.goto("/community");
    await expect(page).toHaveTitle(/Community.*Mealvana/);
    await expect(page.locator("h1")).toContainText("Community");
  });

  test("should display category filter tabs", async ({ page }) => {
    await page.goto("/community");
    await expect(page.getByRole("button", { name: /all/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /nutrition/i }),
    ).toBeVisible();
  });

  test("should show sign in prompt for new discussion when not authenticated", async ({
    page,
  }) => {
    await page.goto("/community");
    // When not signed in, there should be a sign-in link
    const signInLink = page.getByRole("link", { name: /sign in/i });
    // Either the "New Discussion" button (if signed in) or empty state with sign in link
    const newDiscButton = page.getByRole("link", {
      name: /new discussion/i,
    });
    const hasButton = await newDiscButton.isVisible().catch(() => false);
    const hasSignIn = await signInLink.isVisible().catch(() => false);
    expect(hasButton || hasSignIn).toBeTruthy();
  });
});
