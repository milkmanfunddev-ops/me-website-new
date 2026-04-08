import { convexTest } from "convex-test";
import schema from "../convex/schema";
import { modules } from "./setup";

export function createTestContext() {
  return convexTest(schema, modules);
}

export async function createTestUser(
  t: ReturnType<typeof convexTest>,
  overrides: {
    clerkId?: string;
    email?: string;
    name?: string;
    roles?: Array<"user" | "admin">;
  } = {},
) {
  const clerkId = overrides.clerkId ?? `clerk_test_${Date.now()}`;
  const email = overrides.email ?? `test-${Date.now()}@example.com`;
  const name = overrides.name ?? "Test User";
  const roles = overrides.roles ?? ["user"];
  const now = Date.now();

  const userId = await t.run(async (ctx) => {
    return await ctx.db.insert("users", {
      clerkId,
      email,
      name,
      roles,
      createdAt: now,
      updatedAt: now,
    });
  });

  return { userId, clerkId, email, name };
}
