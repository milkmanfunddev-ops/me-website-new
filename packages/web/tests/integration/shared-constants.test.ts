import { describe, it, expect } from "vitest";
import {
  APP_NAME,
  APP_DESCRIPTION,
  APP_URL,
  WEB_APP_URL,
  APP_STORE_LINK,
  PLAY_STORE_LINK,
  FEATURES,
  CONTACT_EMAIL,
} from "@mealvana/shared";

describe("shared constants", () => {
  it("APP_NAME is defined", () => {
    expect(APP_NAME).toBeTruthy();
    expect(typeof APP_NAME).toBe("string");
  });

  it("APP_DESCRIPTION is defined", () => {
    expect(APP_DESCRIPTION).toBeTruthy();
  });

  it("APP_URL is a valid URL", () => {
    expect(APP_URL).toMatch(/^https?:\/\//);
  });

  it("WEB_APP_URL is a valid URL", () => {
    expect(WEB_APP_URL).toMatch(/^https?:\/\//);
  });

  it("store links are valid URLs", () => {
    expect(APP_STORE_LINK).toMatch(/^https?:\/\//);
    expect(PLAY_STORE_LINK).toMatch(/^https?:\/\//);
  });

  it("FEATURES has 12 items", () => {
    expect(FEATURES).toHaveLength(12);
  });

  it("each feature has required fields", () => {
    for (const feature of FEATURES) {
      expect(feature.title).toBeTruthy();
      expect(feature.description).toBeTruthy();
      expect(feature.icon).toBeTruthy();
    }
  });

  it("CONTACT_EMAIL is a valid email format", () => {
    expect(CONTACT_EMAIL).toMatch(/.+@.+\..+/);
  });
});
