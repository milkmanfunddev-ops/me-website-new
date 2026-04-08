import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import schema from "../convex/schema";
import { modules } from "./setup";
import { api, internal } from "../convex/_generated/api";

describe("users", () => {
  describe("sync", () => {
    it("should create a new user when one does not exist", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.mutation(internal.users.sync, {
        clerkId: "clerk_123",
        email: "test@example.com",
        name: "Test User",
      });

      expect(userId).toBeDefined();

      const user = await t.run(async (ctx) => {
        return await ctx.db.get(userId);
      });

      expect(user).toBeDefined();
      expect(user!.clerkId).toBe("clerk_123");
      expect(user!.email).toBe("test@example.com");
      expect(user!.name).toBe("Test User");
      expect(user!.roles).toEqual(["user"]);
    });

    it("should update an existing user on re-sync", async () => {
      const t = convexTest(schema, modules);

      await t.mutation(internal.users.sync, {
        clerkId: "clerk_123",
        email: "old@example.com",
        name: "Old Name",
      });

      const userId = await t.mutation(internal.users.sync, {
        clerkId: "clerk_123",
        email: "new@example.com",
        name: "New Name",
      });

      const user = await t.run(async (ctx) => {
        return await ctx.db.get(userId);
      });

      expect(user!.email).toBe("new@example.com");
      expect(user!.name).toBe("New Name");
    });
  });

  describe("getCurrent", () => {
    it("should return null when not authenticated", async () => {
      const t = convexTest(schema, modules);
      const result = await t.query(api.users.getCurrent, {});
      expect(result).toBeNull();
    });

    it("should return the current user when authenticated", async () => {
      const t = convexTest(schema, modules);

      await t.mutation(internal.users.sync, {
        clerkId: "clerk_user_1",
        email: "user@example.com",
        name: "Auth User",
      });

      const result = await t.withIdentity({ subject: "clerk_user_1" }).query(
        api.users.getCurrent,
        {},
      );

      expect(result).toBeDefined();
      expect(result!.name).toBe("Auth User");
    });
  });

  describe("getByClerkId", () => {
    it("should find user by clerk ID", async () => {
      const t = convexTest(schema, modules);

      await t.mutation(internal.users.sync, {
        clerkId: "clerk_abc",
        email: "abc@example.com",
        name: "ABC User",
      });

      const user = await t.query(api.users.getByClerkId, {
        clerkId: "clerk_abc",
      });

      expect(user).toBeDefined();
      expect(user!.email).toBe("abc@example.com");
    });

    it("should return null for unknown clerk ID", async () => {
      const t = convexTest(schema, modules);
      const user = await t.query(api.users.getByClerkId, {
        clerkId: "nonexistent",
      });
      expect(user).toBeNull();
    });
  });

  describe("updateProfile", () => {
    it("should update user profile fields", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.mutation(internal.users.sync, {
        clerkId: "clerk_update",
        email: "update@example.com",
        name: "Before Update",
      });

      await t.withIdentity({ subject: "clerk_update" }).mutation(
        api.users.updateProfile,
        { name: "After Update" },
      );

      const user = await t.run(async (ctx) => {
        return await ctx.db.get(userId);
      });

      expect(user!.name).toBe("After Update");
    });

    it("should throw when not authenticated", async () => {
      const t = convexTest(schema, modules);
      await expect(
        t.mutation(api.users.updateProfile, { name: "Hacker" }),
      ).rejects.toThrow("Not authenticated");
    });
  });
});
