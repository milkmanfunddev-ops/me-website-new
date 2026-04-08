import { vi } from "vitest";

// Re-export all Convex modules for convex-test
// convex-test needs access to the compiled modules
export const modules = import.meta.glob("../convex/**/*.ts", {
  eager: true,
}) as Record<string, Record<string, unknown>>;

// Mock external services
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ id: "mock-email-id" }),
    },
  })),
}));
