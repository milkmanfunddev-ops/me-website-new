import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import schema from "../convex/schema";
import { modules } from "./setup";
import { api, internal } from "../convex/_generated/api";

describe("discussions", () => {
  async function setupUser(t: ReturnType<typeof convexTest>) {
    const userId = await t.mutation(internal.users.sync, {
      clerkId: "clerk_disc_user",
      email: "disc@example.com",
      name: "Discussion User",
    });
    return { userId, clerkId: "clerk_disc_user" };
  }

  describe("create", () => {
    it("should create a discussion with slug", async () => {
      const t = convexTest(schema, modules);
      const { clerkId } = await setupUser(t);

      const id = await t.withIdentity({ subject: clerkId }).mutation(
        api.discussions.create,
        {
          title: "Best race-day nutrition?",
          body: "What works for your long runs?",
          category: "nutrition",
        },
      );

      expect(id).toBeDefined();

      const discussion = await t.run(async (ctx) => {
        return await ctx.db.get(id);
      });

      expect(discussion!.title).toBe("Best race-day nutrition?");
      expect(discussion!.category).toBe("nutrition");
      expect(discussion!.slug).toMatch(/^best-race-day-nutrition/);
      expect(discussion!.isPinned).toBe(false);
      expect(discussion!.isLocked).toBe(false);
      expect(discussion!.viewCount).toBe(0);
      expect(discussion!.replyCount).toBe(0);
    });

    it("should require authentication", async () => {
      const t = convexTest(schema, modules);
      await expect(
        t.mutation(api.discussions.create, {
          title: "Test",
          body: "Test",
          category: "general",
        }),
      ).rejects.toThrow("Not authenticated");
    });
  });

  describe("list", () => {
    it("should list discussions with author info", async () => {
      const t = convexTest(schema, modules);
      const { clerkId } = await setupUser(t);

      await t.withIdentity({ subject: clerkId }).mutation(
        api.discussions.create,
        {
          title: "Discussion 1",
          body: "Body 1",
          category: "general",
        },
      );

      const list = await t.query(api.discussions.list, {});
      expect(list.length).toBe(1);
      expect(list[0].author).toBeDefined();
      expect(list[0].author!.name).toBe("Discussion User");
    });

    it("should filter by category", async () => {
      const t = convexTest(schema, modules);
      const { clerkId } = await setupUser(t);

      await t.withIdentity({ subject: clerkId }).mutation(
        api.discussions.create,
        { title: "Nutrition Talk", body: "Body", category: "nutrition" },
      );
      await t.withIdentity({ subject: clerkId }).mutation(
        api.discussions.create,
        { title: "Training Talk", body: "Body", category: "training" },
      );

      const nutritionOnly = await t.query(api.discussions.list, {
        category: "nutrition",
      });
      expect(nutritionOnly.length).toBe(1);
      expect(nutritionOnly[0].title).toBe("Nutrition Talk");
    });
  });

  describe("reply", () => {
    it("should add a reply and increment count", async () => {
      const t = convexTest(schema, modules);
      const { clerkId } = await setupUser(t);

      const discId = await t.withIdentity({ subject: clerkId }).mutation(
        api.discussions.create,
        { title: "Test", body: "Body", category: "general" },
      );

      const replyId = await t.withIdentity({ subject: clerkId }).mutation(
        api.discussions.reply,
        { discussionId: discId, body: "Great point!" },
      );

      expect(replyId).toBeDefined();

      const discussion = await t.run(async (ctx) => {
        return await ctx.db.get(discId);
      });
      expect(discussion!.replyCount).toBe(1);
      expect(discussion!.lastReplyAt).toBeTypeOf("number");
    });

    it("should reject replies to locked discussions", async () => {
      const t = convexTest(schema, modules);
      const { clerkId } = await setupUser(t);

      const discId = await t.withIdentity({ subject: clerkId }).mutation(
        api.discussions.create,
        { title: "Test", body: "Body", category: "general" },
      );

      await t.withIdentity({ subject: clerkId }).mutation(
        api.discussions.lock,
        { id: discId, isLocked: true },
      );

      await expect(
        t.withIdentity({ subject: clerkId }).mutation(
          api.discussions.reply,
          { discussionId: discId, body: "Reply" },
        ),
      ).rejects.toThrow("Discussion is locked");
    });
  });

  describe("listReplies", () => {
    it("should return replies with author info", async () => {
      const t = convexTest(schema, modules);
      const { clerkId } = await setupUser(t);

      const discId = await t.withIdentity({ subject: clerkId }).mutation(
        api.discussions.create,
        { title: "Test", body: "Body", category: "general" },
      );

      await t.withIdentity({ subject: clerkId }).mutation(
        api.discussions.reply,
        { discussionId: discId, body: "Reply 1" },
      );
      await t.withIdentity({ subject: clerkId }).mutation(
        api.discussions.reply,
        { discussionId: discId, body: "Reply 2" },
      );

      const replies = await t.query(api.discussions.listReplies, {
        discussionId: discId,
      });

      expect(replies.length).toBe(2);
      expect(replies[0].author).toBeDefined();
    });
  });

  describe("incrementViewCount", () => {
    it("should increment the view count", async () => {
      const t = convexTest(schema, modules);
      const { clerkId } = await setupUser(t);

      const discId = await t.withIdentity({ subject: clerkId }).mutation(
        api.discussions.create,
        { title: "Views", body: "Body", category: "general" },
      );

      await t.mutation(api.discussions.incrementViewCount, { id: discId });
      await t.mutation(api.discussions.incrementViewCount, { id: discId });

      const disc = await t.run(async (ctx) => {
        return await ctx.db.get(discId);
      });
      expect(disc!.viewCount).toBe(2);
    });
  });

  describe("pin and lock", () => {
    it("should pin a discussion", async () => {
      const t = convexTest(schema, modules);
      const { clerkId } = await setupUser(t);

      const discId = await t.withIdentity({ subject: clerkId }).mutation(
        api.discussions.create,
        { title: "Pin me", body: "Body", category: "general" },
      );

      await t.withIdentity({ subject: clerkId }).mutation(
        api.discussions.pin,
        { id: discId, isPinned: true },
      );

      const disc = await t.run(async (ctx) => {
        return await ctx.db.get(discId);
      });
      expect(disc!.isPinned).toBe(true);
    });
  });
});
