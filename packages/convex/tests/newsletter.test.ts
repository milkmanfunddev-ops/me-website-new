import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import schema from "../convex/schema";
import { modules } from "./setup";
import { api } from "../convex/_generated/api";

describe("newsletter", () => {
  describe("subscribe", () => {
    it("should create a new subscriber", async () => {
      const t = convexTest(schema, modules);

      const id = await t.mutation(api.newsletter.subscribe, {
        email: "athlete@example.com",
        source: "homepage",
      });

      expect(id).toBeDefined();

      const sub = await t.run(async (ctx) => {
        return await ctx.db.get(id);
      });

      expect(sub!.email).toBe("athlete@example.com");
      expect(sub!.source).toBe("homepage");
      expect(sub!.mailchimpSynced).toBe(false);
    });

    it("should return existing ID for duplicate email", async () => {
      const t = convexTest(schema, modules);

      const id1 = await t.mutation(api.newsletter.subscribe, {
        email: "dupe@example.com",
        source: "homepage",
      });

      const id2 = await t.mutation(api.newsletter.subscribe, {
        email: "dupe@example.com",
        source: "footer",
      });

      expect(id1).toEqual(id2);

      // Verify only one record exists
      const all = await t.run(async (ctx) => {
        return await ctx.db
          .query("newsletterSubscribers")
          .collect();
      });

      expect(all.filter((s) => s.email === "dupe@example.com").length).toBe(1);
    });

    it("should accept optional name", async () => {
      const t = convexTest(schema, modules);

      const id = await t.mutation(api.newsletter.subscribe, {
        email: "named@example.com",
        name: "Athlete Name",
        source: "blog",
      });

      const sub = await t.run(async (ctx) => {
        return await ctx.db.get(id);
      });

      expect(sub!.name).toBe("Athlete Name");
    });
  });

  describe("listUnsynced", () => {
    it("should return only unsynced subscribers", async () => {
      const t = convexTest(schema, modules);

      await t.mutation(api.newsletter.subscribe, {
        email: "unsynced@example.com",
        source: "homepage",
      });

      const unsynced = await t.query(api.newsletter.listUnsynced, {});
      expect(unsynced.length).toBe(1);
      expect(unsynced[0].email).toBe("unsynced@example.com");
    });
  });

  describe("listSubscribers", () => {
    it("should require authentication", async () => {
      const t = convexTest(schema, modules);
      await expect(
        t.query(api.newsletter.listSubscribers, {}),
      ).rejects.toThrow("Not authenticated");
    });

    it("should list all subscribers when authenticated", async () => {
      const t = convexTest(schema, modules);

      await t.mutation(api.newsletter.subscribe, {
        email: "a@test.com",
        source: "homepage",
      });
      await t.mutation(api.newsletter.subscribe, {
        email: "b@test.com",
        source: "footer",
      });

      const list = await t
        .withIdentity({ subject: "admin" })
        .query(api.newsletter.listSubscribers, {});

      expect(list.length).toBe(2);
    });
  });
});
