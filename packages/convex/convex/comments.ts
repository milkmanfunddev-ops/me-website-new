import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    sanityPostId: v.string(),
    body: v.string(),
    parentCommentId: v.optional(v.id("blogComments")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    return await ctx.db.insert("blogComments", {
      sanityPostId: args.sanityPostId,
      authorId: user._id,
      body: args.body,
      parentCommentId: args.parentCommentId,
      isEdited: false,
      createdAt: Date.now(),
    });
  },
});

export const listByPost = query({
  args: { sanityPostId: v.string() },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("blogComments")
      .withIndex("by_sanityPostId", (q) =>
        q.eq("sanityPostId", args.sanityPostId),
      )
      .order("asc")
      .collect();

    return Promise.all(
      comments.map(async (c) => {
        const author = await ctx.db.get(c.authorId);
        return { ...c, author };
      }),
    );
  },
});

export const remove = mutation({
  args: { id: v.id("blogComments") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const comment = await ctx.db.get(args.id);
    if (!comment) throw new Error("Comment not found");

    const isOwner = comment.authorId === user._id;
    const isAdmin = user.roles.includes("admin");
    if (!isOwner && !isAdmin) throw new Error("Not authorized");

    await ctx.db.delete(args.id);
  },
});
