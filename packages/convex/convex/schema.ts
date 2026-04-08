import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    roles: v.array(v.union(v.literal("user"), v.literal("admin"))),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  contactSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    status: v.union(
      v.literal("new"),
      v.literal("read"),
      v.literal("responded"),
    ),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  newsletterSubscribers: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    source: v.union(
      v.literal("footer"),
      v.literal("homepage"),
      v.literal("blog"),
    ),
    subscribedAt: v.number(),
    mailchimpSynced: v.boolean(),
  })
    .index("by_email", ["email"])
    .index("by_mailchimpSynced", ["mailchimpSynced"]),

  discussions: defineTable({
    authorId: v.id("users"),
    title: v.string(),
    body: v.string(),
    category: v.union(
      v.literal("general"),
      v.literal("nutrition"),
      v.literal("training"),
      v.literal("app"),
      v.literal("race-reports"),
    ),
    slug: v.string(),
    isPinned: v.boolean(),
    isLocked: v.boolean(),
    viewCount: v.number(),
    replyCount: v.number(),
    lastReplyAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_lastReplyAt", ["lastReplyAt"])
    .index("by_createdAt", ["createdAt"])
    .index("by_slug", ["slug"])
    .searchIndex("search_title", { searchField: "title" }),

  discussionReplies: defineTable({
    discussionId: v.id("discussions"),
    authorId: v.id("users"),
    body: v.string(),
    parentReplyId: v.optional(v.id("discussionReplies")),
    isEdited: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_discussionId", ["discussionId"])
    .index("by_parentReplyId", ["parentReplyId"]),

  blogComments: defineTable({
    sanityPostId: v.string(),
    authorId: v.id("users"),
    body: v.string(),
    parentCommentId: v.optional(v.id("blogComments")),
    isEdited: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_sanityPostId", ["sanityPostId"])
    .index("by_authorId", ["authorId"]),

  orders: defineTable({
    userId: v.id("users"),
    stripeSessionId: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
    items: v.array(
      v.object({
        productId: v.string(),
        title: v.string(),
        priceCents: v.number(),
        quantity: v.number(),
      }),
    ),
    totalCents: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("fulfilled"),
      v.literal("cancelled"),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_stripeSessionId", ["stripeSessionId"]),
});
