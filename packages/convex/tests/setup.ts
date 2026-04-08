import { vi } from "vitest";

// Re-export all Convex modules for convex-test
// Include _generated stubs but exclude "use node" modules (email, stripe) that can't run in test
export const modules = import.meta.glob(
  ["../convex/**/*.ts", "!../convex/email.ts", "!../convex/stripe.ts"],
) as Record<string, () => Promise<Record<string, unknown>>>;

// Mock external services
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ id: "mock-email-id" }),
    },
  })),
}));
