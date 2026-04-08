"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import Stripe from "stripe";

export const createCheckoutSession = action({
  args: {
    items: v.array(
      v.object({
        title: v.string(),
        priceCents: v.number(),
        quantity: v.number(),
      }),
    ),
    successUrl: v.string(),
    cancelUrl: v.string(),
  },
  handler: async (_ctx, args) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const lineItems = args.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
        },
        unit_amount: item.priceCents,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: args.successUrl,
      cancel_url: args.cancelUrl,
    });

    return { sessionId: session.id, url: session.url };
  },
});
