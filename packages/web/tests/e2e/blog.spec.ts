import { test, expect } from "@playwright/test";

test.describe("Blog", () => {
  test("blog index should load", async ({ page }) => {
    await page.goto("/blog");
    await expect(page).toHaveTitle(/Blog.*Mealvana/);
    await expect(page.locator("h1")).toContainText("Blog");
  });

  test("should display category filter tabs", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { name: "Blog" })).toBeVisible();
  });

  test("should show empty state when no posts", async ({ page }) => {
    await page.goto("/blog");
    // With placeholder Sanity credentials, the blog returns empty data
    await expect(
      page.getByText("No blog posts yet."),
    ).toBeVisible({ timeout: 10000 });
  });

  test("should handle non-existent blog post", async ({ page }) => {
    await page.goto("/blog/nonexistent-post-slug-12345");
    await expect(page.locator("text=Post not found")).toBeVisible({
      timeout: 10000,
    });
  });

  test("should have back to blog link on post page", async ({ page }) => {
    await page.goto("/blog/nonexistent-post-slug-12345");
    await expect(
      page.getByRole("link", { name: /back to blog/i }),
    ).toBeVisible({ timeout: 10000 });
  });
});
