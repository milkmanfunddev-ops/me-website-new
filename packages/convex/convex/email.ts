"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";

// Contact notifications are stored in Convex and viewable in the dashboard.
// No external email service needed — add Mailchimp transactional or Resend later if desired.

export const sendContactNotification = internalAction({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (_ctx, args) => {
    console.log(
      `[Contact Form] From: ${args.name} <${args.email}> Subject: ${args.subject}`,
    );
  },
});

export const sendOrderConfirmation = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
    orderId: v.string(),
    totalCents: v.number(),
  },
  handler: async (_ctx, args) => {
    console.log(
      `[Order Confirmation] To: ${args.name} <${args.email}> Order: ${args.orderId}`,
    );
  },
});
