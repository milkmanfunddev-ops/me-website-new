"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { Resend } from "resend";

export const sendContactNotification = internalAction({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (_ctx, args) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Mealvana <notifications@mealvana.io>",
      to: "support@mealvana.io",
      subject: `New Contact Form: ${args.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${args.name}</p>
        <p><strong>Email:</strong> ${args.email}</p>
        <p><strong>Subject:</strong> ${args.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${args.message}</p>
      `,
    });
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
    const resend = new Resend(process.env.RESEND_API_KEY);

    const amount = (args.totalCents / 100).toFixed(2);

    await resend.emails.send({
      from: "Mealvana <orders@mealvana.io>",
      to: args.email,
      subject: "Order Confirmation - Mealvana Endurance",
      html: `
        <h2>Thank you for your order, ${args.name}!</h2>
        <p>Your order <strong>#${args.orderId}</strong> has been confirmed.</p>
        <p><strong>Total:</strong> $${amount}</p>
        <p>If you have questions, reply to this email or visit our support page.</p>
        <p>Happy training — and happy fueling!</p>
        <p>The Mealvana Team</p>
      `,
    });
  },
});
