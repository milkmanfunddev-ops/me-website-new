import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  denyAnalyticsConsent,
  grantAnalyticsConsent,
  initAnalytics,
  mustAskBeforeTracking,
  needsConsentDecision,
  requiresOptIn,
} from "@/lib/analytics";

/**
 * Cookie/analytics consent banner.
 *
 * Renders only when analytics is actually configured AND this visitor still
 * owes us a decision — so while the Mixpanel token is unset (the current state
 * of the site) it never appears, and nobody is nagged for consent to something
 * that isn't running.
 *
 * Two behaviours, matching what the law actually asks for — and matching what
 * `mayInitialize()` has always permitted:
 *
 * - EEA/UK: consent for a persistent identifier must be collected BEFORE it is
 *   stored, so nothing starts until the visitor accepts. `initAnalytics()` is a
 *   no-op until then and this banner is what unblocks it.
 * - Everywhere else: notice-and-opt-out. The banner still appears and Decline
 *   still works (and now genuinely stops tracking), but analytics starts on
 *   arrival rather than waiting for a tap nobody makes.
 */
export function AnalyticsConsentBanner() {
  // Deliberately starts false: the decision depends on localStorage and Intl,
  // which don't exist during SSR. Rendering nothing on the server and deciding
  // on mount avoids a hydration mismatch.
  const [visible, setVisible] = useState(false);
  const [optIn, setOptIn] = useState(false);

  useEffect(() => {
    if (needsConsentDecision()) {
      setOptIn(requiresOptIn());
      setVisible(true);
    }

    // Outside the EEA/UK this runs even while the banner is up: the visitor is
    // being told, not asked. initAnalytics() still checks mayInitialize(), so a
    // previous "denied" is respected and the EEA/UK path stays blocked.
    if (!mustAskBeforeTracking()) {
      initAnalytics();
    }
  }, []);

  if (!visible) return null;

  const accept = () => {
    grantAnalyticsConsent();
    setVisible(false);
  };

  const decline = () => {
    denyAnalyticsConsent();
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Analytics consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 p-4 shadow-lg backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-700 dark:text-neutral-300">
          We&rsquo;d like to use analytics cookies to understand how the site is
          used. They&rsquo;re optional, and the site works the same without them.{" "}
          <Link
            to="/privacy"
            className="underline underline-offset-2 hover:no-underline"
          >
            Privacy Policy
          </Link>
        </p>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={decline}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            {/* In the EEA/UK "reject" must be as easy as "accept" — same
                prominence, one click, no dark patterns. */}
            Decline
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {optIn ? "Accept" : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
}
