import { describe, it, expect } from "vitest";
import { cn, formatCents, formatDate, pluralize } from "@/lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("merges class names", () => {
      expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("handles conditional classes", () => {
      expect(cn("base", false && "hidden", "visible")).toBe("base visible");
    });

    it("resolves tailwind conflicts", () => {
      const result = cn("px-4", "px-8");
      expect(result).toBe("px-8");
    });
  });

  describe("formatCents", () => {
    it("formats cents to dollars", () => {
      expect(formatCents(1999)).toBe("$19.99");
    });

    it("formats zero", () => {
      expect(formatCents(0)).toBe("$0.00");
    });

    it("formats large amounts", () => {
      expect(formatCents(99999)).toBe("$999.99");
    });
  });

  describe("formatDate", () => {
    it("formats ISO date string", () => {
      const result = formatDate("2025-06-15T10:00:00Z");
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      // Should contain month and year
      expect(result).toContain("2025");
    });

    it("handles date-only strings", () => {
      const result = formatDate("2025-01-01");
      expect(result).toBeTruthy();
    });
  });

  describe("pluralize", () => {
    it("returns singular for count of 1", () => {
      expect(pluralize(1, "reply", "replies")).toBe("reply");
    });

    it("returns plural for count > 1", () => {
      expect(pluralize(5, "reply", "replies")).toBe("replies");
    });

    it("returns plural for count of 0", () => {
      expect(pluralize(0, "reply", "replies")).toBe("replies");
    });

    it("auto-pluralizes with s when no plural given", () => {
      expect(pluralize(3, "item")).toBe("items");
    });
  });
});
