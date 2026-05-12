import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

const practiceTypeValidator = v.union(
  v.literal("running"),
  v.literal("cycling"),
  v.literal("triathlon"),
  v.literal("swimming"),
  v.literal("dietitian"),
  v.literal("other"),
);

export const apply = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    practiceType: practiceTypeValidator,
    certifications: v.string(),
    athleteCount: v.optional(v.string()),
    websiteOrSocial: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("coachApplications", {
      name: args.name,
      email: args.email,
      phone: args.phone,
      practiceType: args.practiceType,
      certifications: args.certifications,
      athleteCount: args.athleteCount,
      websiteOrSocial: args.websiteOrSocial,
      message: args.message,
      status: "new",
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(
      0,
      internal.email.sendCoachApplicationNotification,
      {
        name: args.name,
        email: args.email,
        phone: args.phone,
        practiceType: args.practiceType,
        certifications: args.certifications,
        athleteCount: args.athleteCount,
        websiteOrSocial: args.websiteOrSocial,
        message: args.message,
      },
    );

    await ctx.scheduler.runAfter(
      0,
      internal.email.sendCoachApplicationConfirmation,
      {
        name: args.name,
        email: args.email,
      },
    );

    return id;
  },
});

export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("new"),
        v.literal("contacted"),
        v.literal("approved"),
        v.literal("declined"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    if (args.status) {
      return await ctx.db
        .query("coachApplications")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    }

    return await ctx.db.query("coachApplications").order("desc").collect();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("coachApplications"),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("approved"),
      v.literal("declined"),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    await ctx.db.patch(args.id, { status: args.status });
  },
});
