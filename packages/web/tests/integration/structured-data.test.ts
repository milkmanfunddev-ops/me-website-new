import { describe, it, expect } from "vitest";
import {
  organizationJsonLd,
  webSiteJsonLd,
  softwareApplicationJsonLd,
  articleJsonLd,
  faqPageJsonLd,
} from "@/lib/structured-data";

describe("Structured Data (JSON-LD)", () => {
  describe("organizationJsonLd", () => {
    it("should generate valid Organization schema", () => {
      const data = organizationJsonLd();
      expect(data["@context"]).toBe("https://schema.org");
      expect(data["@type"]).toBe("Organization");
      expect(data.name).toBeTruthy();
      expect(data.url).toBeTruthy();
      expect(data.logo).toContain("http");
    });
  });

  describe("webSiteJsonLd", () => {
    it("should generate valid WebSite schema", () => {
      const data = webSiteJsonLd();
      expect(data["@context"]).toBe("https://schema.org");
      expect(data["@type"]).toBe("WebSite");
      expect(data.name).toBeTruthy();
      expect(data.url).toBeTruthy();
    });
  });

  describe("softwareApplicationJsonLd", () => {
    it("should generate valid SoftwareApplication schema", () => {
      const data = softwareApplicationJsonLd();
      expect(data["@context"]).toBe("https://schema.org");
      expect(data["@type"]).toBe("SoftwareApplication");
      expect(data.applicationCategory).toBe("HealthApplication");
      expect(data.offers.price).toBe("0");
    });
  });

  describe("articleJsonLd", () => {
    it("should generate valid Article schema with all fields", () => {
      const data = articleJsonLd({
        title: "How to Fuel a Marathon",
        excerpt: "A guide to marathon nutrition",
        publishedAt: "2025-01-15T10:00:00Z",
        author: { name: "Dr. Smith" },
        slug: "how-to-fuel-a-marathon",
      });

      expect(data["@type"]).toBe("Article");
      expect(data.headline).toBe("How to Fuel a Marathon");
      expect(data.description).toBe("A guide to marathon nutrition");
      expect(data.author?.name).toBe("Dr. Smith");
      expect(data.url).toContain("how-to-fuel-a-marathon");
    });

    it("should handle missing optional fields", () => {
      const data = articleJsonLd({
        title: "Basic Post",
        publishedAt: "2025-01-01",
        slug: "basic-post",
      });

      expect(data.headline).toBe("Basic Post");
      expect(data.author).toBeUndefined();
      expect(data.image).toBeUndefined();
    });
  });

  describe("faqPageJsonLd", () => {
    it("should generate valid FAQPage schema", () => {
      const data = faqPageJsonLd([
        { question: "What is Mealvana?", answer: "A nutrition app." },
        { question: "Is it free?", answer: "Yes, with premium options." },
      ]);

      expect(data["@type"]).toBe("FAQPage");
      expect(data.mainEntity).toHaveLength(2);
      expect(data.mainEntity[0]["@type"]).toBe("Question");
      expect(data.mainEntity[0].name).toBe("What is Mealvana?");
      expect(data.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");
    });

    it("should handle empty FAQ list", () => {
      const data = faqPageJsonLd([]);
      expect(data.mainEntity).toHaveLength(0);
    });
  });
});
