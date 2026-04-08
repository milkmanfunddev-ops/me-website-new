import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    category: v.union(
      v.literal("general"),
      v.literal("nutrition"),
      v.literal("training"),
      v.literal("app"),
      v.literal("race-reports"),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const slug = args.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);

    const now = Date.now();
    return await ctx.db.insert("discussions", {
      authorId: user._id,
      title: args.title,
      body: args.body,
      category: args.category,
      slug: `${slug}-${now}`,
      isPinned: false,
      isLocked: false,
      viewCount: 0,
      replyCount: 0,
      lastReplyAt: undefined,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const list = query({
  args: {
    category: v.optional(
      v.union(
        v.literal("general"),
        v.literal("nutrition"),
        v.literal("training"),
        v.literal("app"),
        v.literal("race-reports"),
      ),
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    let q;
    if (args.category) {
      q = ctx.db
        .query("discussions")
        .withIndex("by_category", (q2) => q2.eq("category", args.category!));
    } else {
      q = ctx.db.query("discussions").withIndex("by_createdAt");
    }

    const discussions = await q.order("desc").take(limit);

    return Promise.all(
      discussions.map(async (d) => {
        const author = await ctx.db.get(d.authorId);
        return { ...d, author };
      }),
    );
  },
});

export const get = query({
  args: { id: v.id("discussions") },
  handler: async (ctx, args) => {
    const discussion = await ctx.db.get(args.id);
    if (!discussion) return null;

    const author = await ctx.db.get(discussion.authorId);
    return { ...discussion, author };
  },
});

export const reply = mutation({
  args: {
    discussionId: v.id("discussions"),
    body: v.string(),
    parentReplyId: v.optional(v.id("discussionReplies")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const discussion = await ctx.db.get(args.discussionId);
    if (!discussion) throw new Error("Discussion not found");
    if (discussion.isLocked) throw new Error("Discussion is locked");

    const now = Date.now();
    const replyId = await ctx.db.insert("discussionReplies", {
      discussionId: args.discussionId,
      authorId: user._id,
      body: args.body,
      parentReplyId: args.parentReplyId,
      isEdited: false,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(args.discussionId, {
      replyCount: discussion.replyCount + 1,
      lastReplyAt: now,
      updatedAt: now,
    });

    return replyId;
  },
});

export const listReplies = query({
  args: { discussionId: v.id("discussions") },
  handler: async (ctx, args) => {
    const replies = await ctx.db
      .query("discussionReplies")
      .withIndex("by_discussionId", (q) =>
        q.eq("discussionId", args.discussionId),
      )
      .order("asc")
      .collect();

    return Promise.all(
      replies.map(async (r) => {
        const author = await ctx.db.get(r.authorId);
        return { ...r, author };
      }),
    );
  },
});

export const incrementViewCount = mutation({
  args: { id: v.id("discussions") },
  handler: async (ctx, args) => {
    const discussion = await ctx.db.get(args.id);
    if (!discussion) return;
    await ctx.db.patch(args.id, {
      viewCount: discussion.viewCount + 1,
    });
  },
});

export const pin = mutation({
  args: { id: v.id("discussions"), isPinned: v.boolean() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    await ctx.db.patch(args.id, { isPinned: args.isPinned });
  },
});

export const lock = mutation({
  args: { id: v.id("discussions"), isLocked: v.boolean() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    await ctx.db.patch(args.id, { isLocked: args.isLocked });
  },
});
