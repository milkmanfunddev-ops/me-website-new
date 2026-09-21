import { useEffect, useState } from "react";
import {
  getAnalyticsState,
  optBackIntoAnalytics,
  optOutOfAnalytics,
  type AnalyticsState,
} from "@/lib/analytics";

/** What the visitor reads for each state, and the button that changes it. */
const CONTROL: Record<
  AnalyticsState,
  { message: string; action?: { label: string; run: () => void } }
> = {
  on: {
    message: "Analytics is on in this browser.",
    action: { label: "Opt out", run: optOutOfAnalytics },
  },
  "opted-out": {
    message: "You have opted out. This browser sends no analytics.",
    action: { label: "Opt back in", run: optBackIntoAnalytics },
  },
  region: {
    message:
      "Analytics is off in this browser, because its timezone or language places you in the EEA or UK.",
  },
  off: { message: "Analytics is not running on this site." },
};

/**
 * The analytics disclosure and opt-out control on /privacy (ADR 0001).
 *
 * The state depends on localStorage and Intl, which don't exist during SSR, so
 * it is read on mount and the status line renders only after that.
 */
export function AnalyticsOptOut() {
  const [state, setState] = useState<AnalyticsState | null>(null);

  useEffect(() => {
    setState(getAnalyticsState());
  }, []);

  const control = state ? CONTROL[state] : null;

  return (
    <section
      id="analytics"
      aria-labelledby="analytics-heading"
      className="mt-12 rounded-lg border border-border p-6"
    >
      <h2
        id="analytics-heading"
        className="font-heading text-xl font-bold text-foreground"
      >
        Website analytics
      </h2>
      <p className="mt-3 text-muted-foreground">
        This website uses Mixpanel to see how it is used: the pages you view,
        the buttons and links you click, the site that sent you here, and your
        device and browser type. Mixpanel stores a random ID in your browser so
        it can tell a return visit from a new one.
      </p>
      <p className="mt-3 text-muted-foreground">
        We do not run analytics for visitors whose timezone or browser language
        places them in the European Economic Area or the United Kingdom.
      </p>
      {control && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p role="status" className="text-sm font-medium text-foreground">
            {control.message}
          </p>
          {control.action && (
            <button
              type="button"
              onClick={() => {
                control.action?.run();
                setState(getAnalyticsState());
              }}
              className="shrink-0 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              {control.action.label}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
