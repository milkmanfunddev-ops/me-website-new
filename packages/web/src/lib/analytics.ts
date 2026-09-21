import mixpanel, { type RequestOptions } from "mixpanel-browser";

/**
 * Marketing-site analytics. The rule is ADR 0001 (docs/adr/0001-no-analytics-for-eea-uk-visitors.md):
 *
 * - A visitor whose timezone or browser language places them in the EEA or UK
 *   is never tracked.
 * - Everyone else is tracked unless they have opted out on /privacy.
 * - Nobody sees a consent banner.
 *
 * `initAnalytics()` runs on every page load from __root and does nothing
 * unless `mayTrack()` says yes.
 */

/**
 * Master switch, ON as of 2026-08-31 — a deliberate product decision, not a
 * side effect of deploying. Setting it back to `false` stops all analytics,
 * even with VITE_MIXPANEL_TOKEN set.
 *
 * `true` alone still tracks nothing. `analyticsIsConfigured()` also requires
 * VITE_MIXPANEL_TOKEN, which Vite inlines at BUILD time — so the token must be
 * set in the Vercel project environment and the site redeployed before any
 * event is sent.
 */
const WEB_ANALYTICS_ENABLED = true;

/**
 * Where the opt-out lives. The key and the "denied" value are the ones the old
 * consent banner wrote, so a visitor who pressed Decline there stays opted out.
 * The banner's "granted" value no longer means anything.
 */
const OPT_OUT_KEY = "mv_analytics_consent";
const OPTED_OUT = "denied";

/** EEA + UK, plus Switzerland. Matched against a language tag's region. */
const EEA_UK_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", "IS", "LI", "NO", "CH", "GB",
]);

/**
 * Languages spoken almost only in the EEA or UK, for a tag with no region such
 * as `de`. English, Spanish, French and Portuguese are left out: a bare `es` or
 * `fr` says nothing about where the visitor is.
 */
const EEA_UK_LANGUAGES = new Set([
  "de", "nl", "it", "pl", "cs", "sk", "sl", "hu", "ro", "bg", "hr", "el",
  "da", "sv", "fi", "et", "lv", "lt", "mt", "ga", "cy", "is", "no", "nb",
  "nn", "lb",
]);

/**
 * EEA timezones outside `Europe/`: the Canaries, Madeira, the Azores, Iceland
 * and the French overseas regions.
 */
const EEA_TIMEZONES_OUTSIDE_EUROPE = new Set([
  "Atlantic/Canary", "Atlantic/Madeira", "Atlantic/Azores", "Atlantic/Reykjavik",
  "Indian/Reunion", "Indian/Mayotte", "America/Guadeloupe", "America/Martinique",
  "America/Cayenne",
]);

/** `mixpanel.init()` has run on this page. It refuses to run twice. */
let started = false;
/** Events go out on this page view. Cleared by an opt-out. */
let initialized = false;

function getToken(): string | undefined {
  return import.meta.env.VITE_MIXPANEL_TOKEN;
}

/** True only when analytics is switched on AND a Mixpanel token is configured. */
export function analyticsIsConfigured(): boolean {
  return WEB_ANALYTICS_ENABLED && Boolean(getToken());
}

/**
 * Whether this visitor's device places them in the EEA or UK.
 *
 * Device signals only — no IP geolocation, which would mean collecting data to
 * decide whether we may collect data. Either signal is enough, because each
 * alone is weak: a German in Berlin may have an `en-US` browser, and a Brit on
 * holiday may report a non-European timezone. Over-including (e.g.
 * `Europe/Moscow`) only loses a visitor from the reports.
 */
function isEeaOrUkVisitor(): boolean {
  if (typeof window === "undefined") return true; // SSR: assume the strict case

  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    if (timeZone.startsWith("Europe/")) return true;
    if (EEA_TIMEZONES_OUTSIDE_EUROPE.has(timeZone)) return true;
  } catch {
    // Intl unavailable — fall through to the language check.
  }

  const [language, region] = (navigator.language ?? "").split("-");
  if (region) return EEA_UK_COUNTRIES.has(region.toUpperCase());
  return EEA_UK_LANGUAGES.has(language.toLowerCase());
}

function isOptedOut(): boolean {
  try {
    return window.localStorage.getItem(OPT_OUT_KEY) === OPTED_OUT;
  } catch {
    // localStorage can throw with storage blocked. Mixpanel persists its ID in
    // localStorage too, so it cannot run there either; treat it as opted out.
    return true;
  }
}

/**
 * Why analytics is or isn't running in this browser, for the /privacy control.
 *
 * - `off`: the site has analytics switched off or no token.
 * - `region`: timezone or browser language places the visitor in the EEA or UK.
 * - `opted-out`: the visitor opted out.
 * - `on`: this browser is tracked.
 */
export type AnalyticsState = "off" | "region" | "opted-out" | "on";

export function getAnalyticsState(): AnalyticsState {
  if (!analyticsIsConfigured()) return "off";
  if (isEeaOrUkVisitor()) return "region";
  if (isOptedOut()) return "opted-out";
  return "on";
}

/** Whether analytics may run for this visitor right now. */
export function mayTrack(): boolean {
  return getAnalyticsState() === "on";
}

/**
 * Initialize Mixpanel, or do nothing when `mayTrack()` says no. Safe to call
 * on every page load.
 */
export function initAnalytics() {
  const token = getToken();
  if (!token || initialized || !mayTrack()) return;

  if (!started) {
    mixpanel.init(token, {
      persistence: "localStorage",
      // Pageviews (again on each client-side route change), clicks and scroll
      // depth. Referrer and device come with every event. Form inputs are left
      // out, and element text is off by default.
      autocapture: {
        pageview: "url-with-path",
        click: true,
        scroll: true,
        input: false,
      },
      record_sessions_percent: 0,
    });
    started = true;
  }

  // Our own flag is the source of truth. An earlier opt-out also wrote one into
  // Mixpanel's storage, which would keep it silent after the visitor opted
  // back in.
  if (mixpanel.has_opted_out_tracking()) {
    mixpanel.opt_in_tracking();
  }

  initialized = true;
}

/**
 * Opt this browser out and stop tracking now, not on the next page load.
 *
 * `opt_out_tracking()` stops further events and records the opt-out in
 * Mixpanel's own storage. It is guarded on `initialized` because calling it
 * before `mixpanel.init()` throws. Clearing `initialized` (but not `started`) makes trackEvent()
 * inert for the rest of this page view.
 */
export function optOutOfAnalytics() {
  try {
    window.localStorage.setItem(OPT_OUT_KEY, OPTED_OUT);
  } catch {
    // Storage blocked: isOptedOut() already reads that as opted out.
  }

  if (initialized) {
    try {
      mixpanel.opt_out_tracking();
    } catch {
      // The stored flag above still stops the next page load.
    }
    initialized = false;
  }
}

/** Undo `optOutOfAnalytics()`. Still refused in the EEA and UK. */
export function optBackIntoAnalytics() {
  try {
    window.localStorage.removeItem(OPT_OUT_KEY);
  } catch {
    return;
  }
  initAnalytics();
}

/**
 * For an event fired immediately before a navigation, pass
 * `{ transport: "sendBeacon", send_immediately: true }` — both parts matter.
 * Mixpanel batches requests on a ~5s timer that does not flush on pagehide, so
 * without `send_immediately` the event just sits in the queue; and a plain XHR
 * gets cancelled when the document unloads, where a beacon survives.
 * See the outbound links on /links.
 */
export function trackEvent(
  name: string,
  properties?: Record<string, unknown>,
  options?: RequestOptions,
) {
  if (initialized) {
    mixpanel.track(name, properties, options);
  }
}

const STORE_HOSTS: Record<string, "app_store" | "google_play"> = {
  "apps.apple.com": "app_store",
  "play.google.com": "google_play",
};

function recordStoreClick(event: MouseEvent) {
  const link = (event.target as Element | null)?.closest?.("a[href]");
  if (!(link instanceof HTMLAnchorElement)) return;

  const store = STORE_HOSTS[link.hostname];
  if (!store) return;

  trackEvent(
    "app_store_clicked",
    { store, page: window.location.pathname },
    // Some store links open in the same tab. See trackEvent().
    { transport: "sendBeacon", send_immediately: true },
  );
}

/**
 * Record `app_store_clicked` for every click on a link to the App Store or
 * Google Play, on any page, however the link was built. Returns the cleanup.
 *
 * Listens in the capture phase so the event is queued before the browser
 * leaves the page. Does nothing for a visitor `mayTrack()` refuses, because
 * trackEvent() is inert until initAnalytics() has run.
 */
export function recordStoreClicks(): () => void {
  document.addEventListener("click", recordStoreClick, { capture: true });
  return () =>
    document.removeEventListener("click", recordStoreClick, { capture: true });
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (initialized) {
    mixpanel.identify(userId);
    if (traits) {
      mixpanel.people.set(traits);
    }
  }
}
