import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import schema from "../convex/schema";
import { modules } from "./setup";
import { api, internal } from "../convex/_generated/api";

describe("orders", () => {
  async function setupUser(t: ReturnType<typeof convexTest>) {
    const userId = await t.mutation(internal.users.sync, {
      clerkId: "clerk_order_user",
      email: "order@example.com",
      name: "Order User",
    });
    return { userId, clerkId: "clerk_order_user" };
  }

  describe("create", () => {
    it("should create an order with pending status", async () => {
      const t = convexTest(schema, modules);
      const { userId } = await setupUser(t);

      const id = await t.run(async (ctx) => {
        return await ctx.db.insert("orders", {
          userId,
          stripeSessionId: "cs_test_123",
          items: [
            {
              productId: "prod_1",
              title: "Mealvana Pro",
              priceCents: 1999,
              quantity: 1,
            },
          ],
          totalCents: 1999,
          status: "pending",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      const order = await t.run(async (ctx) => {
        return await ctx.db.get(id);
      });

      expect(order!.status).toBe("pending");
      expect(order!.totalCents).toBe(1999);
      expect(order!.items.length).toBe(1);
    });
  });

  describe("getBySessionId", () => {
    it("should find order by stripe session ID", async () => {
      const t = convexTest(schema, modules);
      const { userId } = await setupUser(t);

      await t.run(async (ctx) => {
        await ctx.db.insert("orders", {
          userId,
          stripeSessionId: "cs_test_find",
          items: [
            {
              productId: "prod_1",
              title: "Pro Plan",
              priceCents: 2999,
              quantity: 1,
            },
          ],
          totalCents: 2999,
          status: "pending",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      const order = await t.query(api.orders.getBySessionId, {
        stripeSessionId: "cs_test_find",
      });

      expect(order).toBeDefined();
      expect(order!.stripeSessionId).toBe("cs_test_find");
    });
  });

  describe("confirmPaymentInternal", () => {
    it("should update order status to paid", async () => {
      const t = convexTest(schema, modules);
      const { userId } = await setupUser(t);

      await t.run(async (ctx) => {
        await ctx.db.insert("orders", {
          userId,
          stripeSessionId: "cs_confirm",
          items: [
            {
              productId: "prod_1",
              title: "Pro",
              priceCents: 1999,
              quantity: 1,
            },
          ],
          totalCents: 1999,
          status: "pending",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      await t.mutation(internal.orders.confirmPaymentInternal, {
        stripeSessionId: "cs_confirm",
        stripePaymentIntentId: "pi_test_123",
      });

      const order = await t.query(api.orders.getBySessionId, {
        stripeSessionId: "cs_confirm",
      });

      expect(order!.status).toBe("paid");
      expect(order!.stripePaymentIntentId).toBe("pi_test_123");
    });
  });
});
