import { describe, it, expect } from "vitest";
import {
  APPLE_PROVIDER_TOKEN,
  campaignStoreUrl,
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

describe("campaignStoreUrl", () => {
  it("tags the App Store link with the provider and campaign tokens", () => {
    const url = new URL(campaignStoreUrl("appStore", "instagram"));
    expect(url.searchParams.get("pt")).toBe(APPLE_PROVIDER_TOKEN);
    expect(url.searchParams.get("ct")).toBe("instagram");
    expect(url.searchParams.get("mt")).toBe("8");
    expect(url.hostname).toBe("apps.apple.com");
  });

  it("tags the Play link with an encoded UTM referrer", () => {
    const url = new URL(campaignStoreUrl("googlePlay", "tiktok"));
    // Play takes ONE referrer value containing the UTM string.
    expect(url.searchParams.get("referrer")).toBe(
      "utm_source=tiktok&utm_medium=social&utm_campaign=links_page",
    );
    // ...which must be escaped in the raw URL, or Play sees three params.
    expect(url.search).toContain("referrer=utm_source%3Dtiktok%26");
  });

  it("keeps the Play link's existing query parameters", () => {
    const url = new URL(campaignStoreUrl("googlePlay", "instagram"));
    expect(url.searchParams.get("id")).toBe("com.milkman.mealvanaendurance");
    expect(url.searchParams.get("hl")).toBe("en_US");
  });

  it("still produces a usable link for an untagged visitor", () => {
    const url = new URL(campaignStoreUrl("appStore", "direct"));
    expect(url.searchParams.get("ct")).toBe("direct");
    expect(url.pathname).toContain("id6751113738");
  });

  it("gives each platform a distinct campaign", () => {
    const ig = new URL(campaignStoreUrl("appStore", "instagram"));
    const tt = new URL(campaignStoreUrl("appStore", "tiktok"));
    expect(ig.searchParams.get("ct")).not.toBe(tt.searchParams.get("ct"));
  });
});
