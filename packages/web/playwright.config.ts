import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "pnpm dev --port 3001",
    url: "http://localhost:3001",
    reuseExistingServer: !process.env.CI,
    /* A fake token, so specs that don't intercept Mixpanel send nothing that
     * lands in a real project. Process env beats .env.local in Vite. An
     * already-running dev server on 3001 keeps whatever token it started with. */
    env: { VITE_MIXPANEL_TOKEN: "e2e-fake-token" },
  },
});
