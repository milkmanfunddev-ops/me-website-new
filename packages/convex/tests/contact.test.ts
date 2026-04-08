import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import schema from "../convex/schema";
import { modules } from "./setup.test";
import { api } from "../convex/_generated/api";

describe("contact", () => {
  describe("submit", () => {
    it("should create a contact submission with status 'new'", async () => {
      const t = convexTest(schema, modules);

      const id = await t.mutation(api.contact.submit, {
        name: "Jane Doe",
        email: "jane@example.com",
        subject: "Question",
        message: "How do I use the app?",
      });

      expect(id).toBeDefined();

      const submission = await t.run(async (ctx) => {
        return await ctx.db.get(id);
      });

      expect(submission!.name).toBe("Jane Doe");
      expect(submission!.status).toBe("new");
      expect(submission!.createdAt).toBeTypeOf("number");
    });

    it("should schedule an email notification", async () => {
      const t = convexTest(schema, modules);

      await t.mutation(api.contact.submit, {
        name: "Test",
        email: "test@test.com",
        subject: "Test",
        message: "Test message",
      });

      // The scheduler should have queued the email action
      // In convex-test, scheduled functions are tracked
    });
  });

  describe("list", () => {
    it("should require authentication", async () => {
      const t = convexTest(schema, modules);
      await expect(t.query(api.contact.list, {})).rejects.toThrow(
        "Not authenticated",
      );
    });

    it("should list all submissions when authenticated", async () => {
      const t = convexTest(schema, modules);

      await t.mutation(api.contact.submit, {
        name: "A",
        email: "a@test.com",
        subject: "S",
        message: "M",
      });
      await t.mutation(api.contact.submit, {
        name: "B",
        email: "b@test.com",
        subject: "S",
        message: "M",
      });

      const list = await t
        .withIdentity({ subject: "admin" })
        .query(api.contact.list, {});

      expect(list.length).toBe(2);
    });

    it("should filter by status when provided", async () => {
      const t = convexTest(schema, modules);

      const id = await t.mutation(api.contact.submit, {
        name: "A",
        email: "a@test.com",
        subject: "S",
        message: "M",
      });

      await t.withIdentity({ subject: "admin" }).mutation(
        api.contact.updateStatus,
        { id, status: "read" },
      );

      const newOnly = await t
        .withIdentity({ subject: "admin" })
        .query(api.contact.list, { status: "new" });

      expect(newOnly.length).toBe(0);

      const readOnly = await t
        .withIdentity({ subject: "admin" })
        .query(api.contact.list, { status: "read" });

      expect(readOnly.length).toBe(1);
    });
  });

  describe("updateStatus", () => {
    it("should update submission status", async () => {
      const t = convexTest(schema, modules);

      const id = await t.mutation(api.contact.submit, {
        name: "Test",
        email: "test@test.com",
        subject: "Test",
        message: "Message",
      });

      await t
        .withIdentity({ subject: "admin" })
        .mutation(api.contact.updateStatus, {
          id,
          status: "responded",
        });

      const updated = await t.run(async (ctx) => {
        return await ctx.db.get(id);
      });

      expect(updated!.status).toBe("responded");
    });
  });
});
