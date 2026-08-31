import mixpanel, { type RequestOptions } from "mixpanel-browser";

/**
 * Marketing-site analytics, consent-gated.
 *
 * <AnalyticsConsentBanner /> (mounted in __root) is the only caller of
 * `initAnalytics()`, and it is the sole entry point on purpose. The gate below
 * exists so that wiring analytics up cannot reintroduce the violation by
 * accident — `initAnalytics()` is a no-op until consent is on
 * file, and in the EEA/UK consent must be an affirmative act (ePrivacy requires
 * consent BEFORE a persistent identifier is stored on the device, and Mixpanel
 * persists its distinct_id in localStorage).
 *
 * Mount <AnalyticsConsentBanner /> (components/analytics-consent-banner.tsx) to
 * collect that consent. The banner shows itself only when analytics is actually
 * configured, so it stays invisible while the token is unset.
 */

/**
 * Master switch, ON as of 2026-08-31 — a deliberate product decision, not a
 * side effect of deploying. Setting it back to `false` stops all analytics: no
 * Mixpanel runs and the consent banner never appears, even with
 * VITE_MIXPANEL_TOKEN set.
 *
 * `true` alone still tracks nothing. `analyticsIsConfigured()` also requires
 * VITE_MIXPANEL_TOKEN, which Vite inlines at BUILD time — so the token must be
 * set in the Vercel project environment and the site redeployed before any
 * event is sent. Until then this stays inert.
 */
const WEB_ANALYTICS_ENABLED = true;

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

/**
 * True when this visitor must be asked BEFORE anything starts.
 *
 * The EEA/UK case only. Everyone else gets notice-and-opt-out: the banner is
 * still shown and Decline still works, but analytics does not wait for a tap —
 * which is what `mayInitialize()` has always permitted for them. Gating those
 * visitors too meant the overwhelming majority (who scroll past a banner sat
 * below the buttons they came to press) were never counted at all.
 */
export function mustAskBeforeTracking(): boolean {
  return needsConsentDecision() && requiresOptIn();
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

/**
 * Record a refusal and actually stop tracking.
 *
 * Setting the flag is not enough now that analytics can already be running when
 * this is called (non-EEA visitors start on notice, before they have touched
 * the banner). Without the opt-out below, "Decline" would only take effect on
 * the next page load, and the distinct_id already written to localStorage would
 * survive — a decline button that doesn't decline.
 *
 * `opt_out_tracking()` stops further events and records the opt-out in
 * Mixpanel's own storage. It is guarded on `initialized` because calling it
 * before `mixpanel.init()` throws. Clearing `initialized` here is what makes
 * trackEvent() inert again for the rest of this page view.
 */
export function denyAnalyticsConsent() {
  setConsentStatus("denied");

  if (initialized) {
    try {
      mixpanel.opt_out_tracking();
    } catch {
      // Never let a failure here block the UI: the "denied" flag above is
      // already stored, so the next page load will not initialize at all.
    }
    initialized = false;
  }
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

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (initialized) {
    mixpanel.identify(userId);
    if (traits) {
      mixpanel.people.set(traits);
    }
  }
}
