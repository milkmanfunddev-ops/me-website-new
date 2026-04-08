// Re-export all Convex modules for convex-test
// Include _generated stubs but exclude "use node" modules (email, stripe) that can't run in test
export const modules = import.meta.glob(
  ["../convex/**/*.ts", "!../convex/email.ts", "!../convex/stripe.ts"],
) as Record<string, () => Promise<Record<string, unknown>>>;
