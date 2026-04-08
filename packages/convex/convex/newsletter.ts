import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";

export const subscribe = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    source: v.union(
      v.literal("footer"),
      v.literal("homepage"),
      v.literal("blog"),
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("newsletterSubscribers", {
      email: args.email,
      name: args.name,
      source: args.source,
      subscribedAt: Date.now(),
      mailchimpSynced: false,
    });
  },
});

export const syncToMailchimp = action({
  args: {},
  handler: async (ctx) => {
    const unsynced = await ctx.runQuery(
      // @ts-expect-error -- internal query
      "newsletter:listUnsynced",
    );

    if (unsynced.length === 0) return { synced: 0 };

    const apiKey = process.env.MAILCHIMP_API_KEY;
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

    if (!apiKey || !audienceId || !serverPrefix) {
      throw new Error("Mailchimp environment variables not configured");
    }

    const members = unsynced.map(
      (sub: { email: string; name?: string }) => ({
        email_address: sub.email,
        status: "subscribed" as const,
        merge_fields: sub.name ? { FNAME: sub.name } : {},
      }),
    );

    const response = await fetch(
      `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}`,
      {
        method: "POST",
        headers: {
          Authorization: `apikey ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          members,
          update_existing: true,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Mailchimp sync failed: ${response.statusText}`);
    }

    return { synced: members.length };
  },
});

export const listUnsynced = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_mailchimpSynced", (q) =>
        q.eq("mailchimpSynced", false),
      )
      .collect();
  },
});

export const listSubscribers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    return await ctx.db.query("newsletterSubscribers").order("desc").collect();
  },
});
