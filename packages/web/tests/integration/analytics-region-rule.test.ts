import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mixpanelMock = vi.hoisted(() => ({
  init: vi.fn(),
  track: vi.fn(),
  opt_out_tracking: vi.fn(),
  opt_in_tracking: vi.fn(),
  has_opted_out_tracking: vi.fn().mockReturnValue(false),
}));
vi.mock("mixpanel-browser", () => ({ default: mixpanelMock }));

/** A visitor as the browser describes them: timezone and language only. */
function visitAs(timeZone: string, language: string) {
  const real = Intl.DateTimeFormat.prototype.resolvedOptions;
  vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockImplementation(
    function (this: Intl.DateTimeFormat) {
      return { ...real.call(this), timeZone };
    },
  );
  vi.spyOn(navigator, "language", "get").mockReturnValue(language);
}

/** Fresh module per test: it keeps `initialized` in module state. */
async function loadAnalytics() {
  vi.resetModules();
  return import("@/lib/analytics");
}

beforeEach(() => {
  vi.stubEnv("VITE_MIXPANEL_TOKEN", "test-token");
  window.localStorage.clear();
  vi.clearAllMocks();
  mixpanelMock.has_opted_out_tracking.mockReturnValue(false);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("the region rule", () => {
  it("allows a visitor in a US timezone with a US browser", async () => {
    visitAs("America/Chicago", "en-US");
    const analytics = await loadAnalytics();

    expect(analytics.mayTrack()).toBe(true);
    expect(analytics.getAnalyticsState()).toBe("on");
  });

  it("refuses a visitor in Europe/Berlin", async () => {
    visitAs("Europe/Berlin", "en-US");
    const analytics = await loadAnalytics();

    expect(analytics.mayTrack()).toBe(false);
    expect(analytics.getAnalyticsState()).toBe("region");
  });

  it("refuses a de-DE browser in a US timezone", async () => {
    visitAs("America/New_York", "de-DE");
    const analytics = await loadAnalytics();

    expect(analytics.mayTrack()).toBe(false);
  });

  it("refuses an en-GB browser in a US timezone", async () => {
    visitAs("America/Los_Angeles", "en-GB");
    const analytics = await loadAnalytics();

    expect(analytics.mayTrack()).toBe(false);
  });

  it("refuses a bare European language tag in a US timezone", async () => {
    visitAs("America/Chicago", "de");
    const analytics = await loadAnalytics();

    expect(analytics.mayTrack()).toBe(false);
  });

  it("allows Spanish and French from the Americas", async () => {
    for (const language of ["es-US", "es", "fr-CA"]) {
      visitAs("America/Chicago", language);
      const analytics = await loadAnalytics();

      expect(analytics.mayTrack(), language).toBe(true);
      vi.restoreAllMocks();
    }
  });

  it("refuses EEA timezones outside Europe/", async () => {
    for (const timeZone of ["Atlantic/Canary", "Atlantic/Azores", "Indian/Reunion"]) {
      visitAs(timeZone, "en-US");
      const analytics = await loadAnalytics();

      expect(analytics.mayTrack(), timeZone).toBe(false);
      vi.restoreAllMocks();
    }
  });

  it("ignores a consent granted under the old banner in the EEA", async () => {
    visitAs("Europe/Paris", "fr-FR");
    window.localStorage.setItem("mv_analytics_consent", "granted");
    const analytics = await loadAnalytics();

    expect(analytics.mayTrack()).toBe(false);
  });

  it("refuses an opted-out visitor in the US", async () => {
    visitAs("America/Chicago", "en-US");
    const analytics = await loadAnalytics();
    analytics.optOutOfAnalytics();

    expect(analytics.mayTrack()).toBe(false);
    expect(analytics.getAnalyticsState()).toBe("opted-out");
  });

  it("keeps a decline from the old banner as an opt-out", async () => {
    visitAs("America/Chicago", "en-US");
    window.localStorage.setItem("mv_analytics_consent", "denied");
    const analytics = await loadAnalytics();

    expect(analytics.mayTrack()).toBe(false);
  });

  it("reports off when no Mixpanel token is set", async () => {
    vi.stubEnv("VITE_MIXPANEL_TOKEN", "");
    visitAs("America/Chicago", "en-US");
    const analytics = await loadAnalytics();

    expect(analytics.mayTrack()).toBe(false);
    expect(analytics.getAnalyticsState()).toBe("off");
  });
});

describe("initAnalytics", () => {
  it("starts Mixpanel for an allowed visitor", async () => {
    visitAs("America/Chicago", "en-US");
    const analytics = await loadAnalytics();
    analytics.initAnalytics();

    expect(mixpanelMock.init).toHaveBeenCalledTimes(1);
  });

  it("does not start Mixpanel in Europe/Berlin", async () => {
    visitAs("Europe/Berlin", "de-DE");
    const analytics = await loadAnalytics();
    analytics.initAnalytics();
    analytics.trackEvent("anything");

    expect(mixpanelMock.init).not.toHaveBeenCalled();
    expect(mixpanelMock.track).not.toHaveBeenCalled();
  });

  it("does not start Mixpanel after a stored opt-out", async () => {
    visitAs("America/Chicago", "en-US");
    window.localStorage.setItem("mv_analytics_consent", "denied");
    const analytics = await loadAnalytics();
    analytics.initAnalytics();

    expect(mixpanelMock.init).not.toHaveBeenCalled();
  });

  it("stops tracking the moment a running visitor opts out", async () => {
    visitAs("America/Chicago", "en-US");
    const analytics = await loadAnalytics();
    analytics.initAnalytics();
    analytics.optOutOfAnalytics();
    analytics.trackEvent("after_opt_out");

    expect(mixpanelMock.opt_out_tracking).toHaveBeenCalledTimes(1);
    expect(mixpanelMock.track).not.toHaveBeenCalled();
  });

  it("resumes on the same page when a visitor opts out and back in", async () => {
    visitAs("America/Chicago", "en-US");
    const analytics = await loadAnalytics();
    analytics.initAnalytics();
    analytics.optOutOfAnalytics();
    mixpanelMock.has_opted_out_tracking.mockReturnValue(true);
    analytics.optBackIntoAnalytics();
    analytics.trackEvent("after_opt_in");

    expect(mixpanelMock.init).toHaveBeenCalledTimes(1);
    expect(mixpanelMock.opt_in_tracking).toHaveBeenCalledTimes(1);
    expect(mixpanelMock.track).toHaveBeenCalledWith("after_opt_in", undefined, undefined);
  });

  it("starts again when an opted-out visitor opts back in", async () => {
    visitAs("America/Chicago", "en-US");
    window.localStorage.setItem("mv_analytics_consent", "denied");
    mixpanelMock.has_opted_out_tracking.mockReturnValue(true);
    const analytics = await loadAnalytics();
    analytics.optBackIntoAnalytics();

    expect(analytics.getAnalyticsState()).toBe("on");
    expect(mixpanelMock.init).toHaveBeenCalledTimes(1);
    expect(mixpanelMock.opt_in_tracking).toHaveBeenCalledTimes(1);
  });
});
