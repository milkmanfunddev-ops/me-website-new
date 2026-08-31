import { describe, it, expect } from "vitest";
import {
  KNOWN_PLATFORMS,
  PLATFORM_PARAM,
  readPlatform,
} from "@/lib/links-page";

describe("readPlatform", () => {
  it("reads a known platform from the query string", () => {
    expect(readPlatform("?src=instagram")).toEqual({ platform: "instagram" });
    expect(readPlatform("?src=tiktok")).toEqual({ platform: "tiktok" });
  });

  it("recognises every platform in the allowlist", () => {
    for (const name of KNOWN_PLATFORMS) {
      expect(readPlatform(`?${PLATFORM_PARAM}=${name}`)).toEqual({
        platform: name,
      });
    }
  });

  it("is case- and whitespace-insensitive", () => {
    expect(readPlatform("?src=Instagram")).toEqual({ platform: "instagram" });
    expect(readPlatform("?src=%20TikTok%20")).toEqual({ platform: "tiktok" });
  });

  it("reports 'direct' when the parameter is absent or empty", () => {
    expect(readPlatform("")).toEqual({ platform: "direct" });
    expect(readPlatform("?utm_source=instagram")).toEqual({
      platform: "direct",
    });
    expect(readPlatform("?src=")).toEqual({ platform: "direct" });
  });

  it("keeps the parameter working alongside other query params", () => {
    expect(readPlatform("?utm_campaign=bio&src=tiktok&x=1")).toEqual({
      platform: "tiktok",
    });
  });

  it("buckets an unknown value to 'other' but keeps it for debugging", () => {
    // The typo case: a mangled bio link should be diagnosable, not silent.
    expect(readPlatform("?src=instgram")).toEqual({
      platform: "other",
      platform_raw: "instgram",
    });
  });

  it("sanitises hostile input rather than passing it through", () => {
    const result = readPlatform("?src=" + encodeURIComponent("<script>x</script>"));
    expect(result.platform).toBe("other");
    expect(result.platform_raw).toBe("scriptxscript");
  });

  it("bounds the length of an unknown value", () => {
    const result = readPlatform("?src=" + "a".repeat(200));
    expect(result.platform_raw).toHaveLength(32);
  });

  it("omits platform_raw when nothing survives sanitisation", () => {
    expect(readPlatform("?src=" + encodeURIComponent("!!!"))).toEqual({
      platform: "other",
    });
  });
});
