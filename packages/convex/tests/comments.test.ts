import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import schema from "../convex/schema";
import { modules } from "./setup.test";
import { api, internal } from "../convex/_generated/api";

describe("blogComments", () => {
  async function setupUser(
    t: ReturnType<typeof convexTest>,
    opts: { clerkId?: string; name?: string; roles?: Array<"user" | "admin"> } = {},
  ) {
    const clerkId = opts.clerkId ?? "clerk_commenter";
    const userId = await t.mutation(internal.users.sync, {
      clerkId,
      email: `${clerkId}@example.com`,
      name: opts.name ?? "Commenter",
    });
    // If admin role needed, patch directly
    if (opts.roles) {
      await t.run(async (ctx) => {
        await ctx.db.patch(userId, { roles: opts.roles! });
      });
    }
    return { userId, clerkId };
  }

  describe("create", () => {
    it("should create a comment", async () => {
      const t = convexTest(schema, modules);
      const { clerkId } = await setupUser(t);

      const id = await t.withIdentity({ subject: clerkId }).mutation(
        api.comments.create,
        {
          sanityPostId: "post-abc-123",
          body: "Great article!",
        },
      );

      expect(id).toBeDefined();

      const comment = await t.run(async (ctx) => {
        return await ctx.db.get(id);
      });

      expect(comment!.body).toBe("Great article!");
      expect(comment!.sanityPostId).toBe("post-abc-123");
      expect(comment!.isEdited).toBe(false);
    });

    it("should require authentication", async () => {
      const t = convexTest(schema, modules);
      await expect(
        t.mutation(api.comments.create, {
          sanityPostId: "post-1",
          body: "Anon comment",
        }),
      ).rejects.toThrow("Not authenticated");
    });
  });

  describe("listByPost", () => {
    it("should return comments for a specific post", async () => {
      const t = convexTest(schema, modules);
      const { clerkId } = await setupUser(t);

      await t.withIdentity({ subject: clerkId }).mutation(
        api.comments.create,
        { sanityPostId: "post-1", body: "Comment on post 1" },
      );
      await t.withIdentity({ subject: clerkId }).mutation(
        api.comments.create,
        { sanityPostId: "post-2", body: "Comment on post 2" },
      );

      const post1Comments = await t.query(api.comments.listByPost, {
        sanityPostId: "post-1",
      });

      expect(post1Comments.length).toBe(1);
      expect(post1Comments[0].body).toBe("Comment on post 1");
      expect(post1Comments[0].author).toBeDefined();
    });
  });

  describe("remove", () => {
    it("should allow owner to delete their comment", async () => {
      const t = convexTest(schema, modules);
      const { clerkId } = await setupUser(t);

      const commentId = await t.withIdentity({ subject: clerkId }).mutation(
        api.comments.create,
        { sanityPostId: "post-1", body: "My comment" },
      );

      await t.withIdentity({ subject: clerkId }).mutation(
        api.comments.remove,
        { id: commentId },
      );

      const deleted = await t.run(async (ctx) => {
        return await ctx.db.get(commentId);
      });
      expect(deleted).toBeNull();
    });

    it("should allow admin to delete any comment", async () => {
      const t = convexTest(schema, modules);
      const { clerkId: userClerkId } = await setupUser(t, {
        clerkId: "clerk_user",
        name: "Regular User",
      });
      const { clerkId: adminClerkId } = await setupUser(t, {
        clerkId: "clerk_admin",
        name: "Admin",
        roles: ["user", "admin"],
      });

      const commentId = await t
        .withIdentity({ subject: userClerkId })
        .mutation(api.comments.create, {
          sanityPostId: "post-1",
          body: "User comment",
        });

      await t.withIdentity({ subject: adminClerkId }).mutation(
        api.comments.remove,
        { id: commentId },
      );

      const deleted = await t.run(async (ctx) => {
        return await ctx.db.get(commentId);
      });
      expect(deleted).toBeNull();
    });

    it("should reject non-owner non-admin deletions", async () => {
      const t = convexTest(schema, modules);
      const { clerkId: ownerClerkId } = await setupUser(t, {
        clerkId: "clerk_owner",
        name: "Owner",
      });
      const { clerkId: otherClerkId } = await setupUser(t, {
        clerkId: "clerk_other",
        name: "Other",
      });

      const commentId = await t
        .withIdentity({ subject: ownerClerkId })
        .mutation(api.comments.create, {
          sanityPostId: "post-1",
          body: "Owner comment",
        });

      await expect(
        t.withIdentity({ subject: otherClerkId }).mutation(
          api.comments.remove,
          { id: commentId },
        ),
      ).rejects.toThrow("Not authorized");
    });

    it("should require authentication", async () => {
      const t = convexTest(schema, modules);
      const { clerkId } = await setupUser(t);

      const commentId = await t.withIdentity({ subject: clerkId }).mutation(
        api.comments.create,
        { sanityPostId: "post-1", body: "Test" },
      );

      await expect(
        t.mutation(api.comments.remove, { id: commentId }),
      ).rejects.toThrow("Not authenticated");
    });
  });
});
