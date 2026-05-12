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

const PRACTICE_TYPE_LABELS: Record<string, string> = {
  running: "Running coach",
  cycling: "Cycling coach",
  triathlon: "Triathlon coach",
  swimming: "Swimming coach",
  dietitian: "Endurance dietitian / RD",
  other: "Other",
};

export const sendCoachApplicationNotification = internalAction({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    practiceType: v.string(),
    certifications: v.string(),
    athleteCount: v.optional(v.string()),
    websiteOrSocial: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const practiceLabel =
      PRACTICE_TYPE_LABELS[args.practiceType] ?? args.practiceType;

    const row = (label: string, value: string) => `
      <tr>
        <td style="padding:8px 12px;font-weight:600;color:#5b3a78;width:170px;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:8px 12px;color:#2a1942;vertical-align:top;">${value}</td>
      </tr>
    `;

    const messageBlock = args.message
      ? `
        <div style="margin-top:20px;background:#f8f6eb;padding:16px 18px;border-radius:10px;border-left:4px solid #ef7d3b;color:#2a1942;white-space:pre-wrap;">
          ${escapeHtml(args.message)}
        </div>
      `
      : "";

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:640px;margin:0 auto;padding:24px;background:#fbf9ed;color:#2a1942;">
        <div style="background:#2a1942;color:#fbf9ed;padding:20px 24px;border-radius:12px 12px 0 0;">
          <h2 style="margin:0;font-size:20px;">New coach application</h2>
          <p style="margin:4px 0 0;color:#fbf9ed;opacity:0.8;font-size:14px;">From mealvana.io/coach_registration</p>
        </div>
        <div style="background:#ffffff;padding:8px 12px 16px;border-radius:0 0 12px 12px;border:1px solid #ece5db;border-top:0;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            ${row("Name", escapeHtml(args.name))}
            ${row("Email", `<a href="mailto:${escapeHtml(args.email)}" style="color:#ef7d3b;">${escapeHtml(args.email)}</a>`)}
            ${args.phone ? row("Phone", escapeHtml(args.phone)) : ""}
            ${row("Practice", escapeHtml(practiceLabel))}
            ${row("Certifications", escapeHtml(args.certifications))}
            ${args.athleteCount ? row("Athletes", escapeHtml(args.athleteCount)) : ""}
            ${args.websiteOrSocial ? row("Website / social", escapeHtml(args.websiteOrSocial)) : ""}
          </table>
          ${messageBlock}
        </div>
        <p style="margin-top:18px;font-size:12px;color:#6b5b7e;text-align:center;">
          Next step: review and reach out to onboard them at app.mealvana.io.
        </p>
      </div>
    `;

    await sendViaResend({
      from: `Mealvana Coaches <${FROM_EMAIL}>`,
      to: SUPPORT_INBOX,
      reply_to: args.email,
      subject: `[Coach Application] ${args.name} — ${practiceLabel}`,
      html,
    });
  },
});

export const sendCoachApplicationConfirmation = internalAction({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (_ctx, args) => {
    const firstName = args.name.split(" ")[0] || args.name;
    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#fbf9ed;color:#2a1942;">
        <div style="background:#2a1942;color:#fbf9ed;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
          <h2 style="margin:0;font-size:22px;">Thanks, ${escapeHtml(firstName)} — we got it.</h2>
        </div>
        <div style="background:#ffffff;padding:24px;border-radius:0 0 12px 12px;border:1px solid #ece5db;border-top:0;line-height:1.55;">
          <p style="margin:0 0 14px;">Thanks for applying to coach with Mealvana Endurance. We're onboarding coaches manually during our beta, so a real person will review your application and reach out within a few business days.</p>
          <p style="margin:0 0 14px;">When approved, you'll get a coach account on <a href="https://app.mealvana.io" style="color:#ef7d3b;">app.mealvana.io</a> with access to athlete management, nutrition plan editing, and progress tracking.</p>
          <p style="margin:0 0 4px;">In the meantime, feel free to reply directly to this email with anything you'd like us to know.</p>
          <p style="margin:24px 0 0;font-size:13px;color:#6b5b7e;">— The Mealvana Endurance team</p>
        </div>
      </div>
    `;

    await sendViaResend({
      from: `Mealvana Endurance <${FROM_EMAIL}>`,
      to: args.email,
      reply_to: SUPPORT_INBOX,
      subject: "We received your coach application",
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
