"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM_EMAIL = "support@mealvana.io";
const SUPPORT_INBOX = "support@mealvana.io";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendViaResend(payload: {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  reply_to?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[Resend] RESEND_API_KEY is not set in Convex env");
    return;
  }

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API ${res.status}: ${body}`);
  }
}

export const sendContactNotification = internalAction({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (_ctx, args) => {
    const subject = `[Support] ${args.subject}`;
    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
        <h2 style="margin-bottom:16px;">New support message</h2>
        <p><strong>From:</strong> ${escapeHtml(args.name)} &lt;${escapeHtml(args.email)}&gt;</p>
        <p><strong>Subject:</strong> ${escapeHtml(args.subject)}</p>
        <div style="background:#f8f6eb;padding:15px;border-radius:8px;margin-top:16px;white-space:pre-wrap;">${escapeHtml(args.message)}</div>
      </div>
    `;

    await sendViaResend({
      from: `Mealvana Support <${FROM_EMAIL}>`,
      to: SUPPORT_INBOX,
      reply_to: args.email,
      subject,
      html,
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
    const total = (args.totalCents / 100).toFixed(2);
    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
        <h2>Thanks for your order, ${escapeHtml(args.name)}!</h2>
        <p>Your order <strong>${escapeHtml(args.orderId)}</strong> has been received.</p>
        <p><strong>Total:</strong> $${total}</p>
        <p>We'll send another email when it ships.</p>
      </div>
    `;

    await sendViaResend({
      from: `Mealvana <${FROM_EMAIL}>`,
      to: args.email,
      subject: `Order confirmation — ${args.orderId}`,
      html,
    });
  },
});
