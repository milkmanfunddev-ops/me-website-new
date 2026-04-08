import mixpanel from "mixpanel-browser";

let initialized = false;

export function initAnalytics() {
  const token = import.meta.env.VITE_MIXPANEL_TOKEN;
  if (token && !initialized) {
    mixpanel.init(token, {
      track_pageview: "url-with-path",
      persistence: "localStorage",
    });
    initialized = true;
  }
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
