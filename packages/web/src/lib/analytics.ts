import mixpanel from "mixpanel-browser";

/**
 * Marketing-site analytics, consent-gated.
 *
 * Status as of 2026-07-13: `initAnalytics()` is not called from anywhere, so no
 * Mixpanel currently runs on this site and nothing is written to localStorage.
 * The gate below exists so that whoever wires analytics up cannot reintroduce
 * the violation by accident — `initAnalytics()` is a no-op until consent is on
 * file, and in the EEA/UK consent must be an affirmative act (ePrivacy requires
 * consent BEFORE a persistent identifier is stored on the device, and Mixpanel
 * persists its distinct_id in localStorage).
 *
 * Mount <AnalyticsConsentBanner /> (components/analytics-consent-banner.tsx) to
 * collect that consent. The banner shows itself only when analytics is actually
 * configured, so it stays invisible while the token is unset.
 */

/**
 * Master switch. Analytics on this site is currently OFF — `initAnalytics()` is
 * not called from anywhere, so nothing tracks today.
 *
 * Flip to `true` to turn on consent-gated analytics. That is a deliberate
 * product decision, not a side effect of deploying: while it is `false` no
 * Mixpanel runs and the consent banner never appears, even if
 * VITE_MIXPANEL_TOKEN is set in the environment. Turning analytics on should be
 * an explicit act by whoever owns the analytics workstream.
 */
const WEB_ANALYTICS_ENABLED = false;

const CONSENT_KEY = "mv_analytics_consent";

export type ConsentStatus = "granted" | "denied" | "unknown";

/** EEA + UK: consent must be opt-in, so we may not initialize by default. */
const STRICT_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", "IS", "LI", "NO", "CH", "GB",
]);

let initialized = false;

function getToken(): string | undefined {
  return import.meta.env.VITE_MIXPANEL_TOKEN;
}

/** True only when analytics is switched on AND a Mixpanel token is configured. */
export function analyticsIsConfigured(): boolean {
  return WEB_ANALYTICS_ENABLED && Boolean(getToken());
}

/**
 * Whether this visitor needs opt-in consent (EEA/UK) rather than being
 * defaulted on.
 *
 * Uses device signals only — no IP geolocation, which would mean collecting
 * data to decide whether we may collect data. Both signals are checked and
 * either is enough, because each alone is weak: a German in Berlin may have an
 * `en-US` browser, and a Brit on holiday may report a non-European timezone.
 * Over-including (e.g. `Europe/Moscow`) only means asking someone who didn't
 * strictly need asking, which is harmless.
 */
export function requiresOptIn(): boolean {
  if (typeof window === "undefined") return true; // SSR: assume the stricter path

  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    if (timeZone.startsWith("Europe/")) return true;
  } catch {
    // Intl unavailable — fall through to the language check.
  }

  const country = navigator.language?.split("-")[1]?.toUpperCase();
  if (country && STRICT_COUNTRIES.has(country)) return true;

  return false;
}

export function getConsentStatus(): ConsentStatus {
  if (typeof window === "undefined") return "unknown";
  try {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    return stored === "granted" || stored === "denied" ? stored : "unknown";
  } catch {
    // localStorage can throw in private mode / with storage blocked. No stored
    // consent means no consent.
    return "unknown";
  }
}

/** True when we still owe this visitor the choice. */
export function needsConsentDecision(): boolean {
  return analyticsIsConfigured() && getConsentStatus() === "unknown";
}

function setConsentStatus(status: Exclude<ConsentStatus, "unknown">) {
  try {
    window.localStorage.setItem(CONSENT_KEY, status);
  } catch {
    // Non-fatal: we just re-ask next visit. Never fall back to assuming consent.
  }
}

export function grantAnalyticsConsent() {
  setConsentStatus("granted");
  initAnalytics();
}

export function denyAnalyticsConsent() {
  setConsentStatus("denied");
}

/**
 * Whether analytics may run right now.
 *
 * - EEA/UK: only on an explicit `granted`.
 * - Elsewhere: anything other than an explicit `denied` (disclosure + opt-out).
 */
function mayInitialize(): boolean {
  const status = getConsentStatus();
  if (status === "denied") return false;
  if (requiresOptIn()) return status === "granted";
  return true;
}

/**
 * Initialize Mixpanel — a no-op unless consent allows it.
 *
 * Safe to call on every page load: it will simply do nothing until the visitor
 * has consented, and `grantAnalyticsConsent()` calls it again once they do.
 */
export function initAnalytics() {
  if (!WEB_ANALYTICS_ENABLED) return;

  const token = getToken();
  if (!token || initialized) return;
  if (!mayInitialize()) return;

  mixpanel.init(token, {
    track_pageview: "url-with-path",
    persistence: "localStorage",
  });
  initialized = true;
}

export function trackEvent(name: string, properties?: Record<string, unknown>) {
  if (initialized) {
    mixpanel.track(name, properties);
  }
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (initialized) {
    mixpanel.identify(userId);
    if (traits) {
      mixpanel.people.set(traits);
    }
  }
}
