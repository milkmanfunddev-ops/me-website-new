import { APP_STORE_LINK, PLAY_STORE_LINK } from "@mealvana/shared";

/**
 * Config for the /links page — the single URL in the Instagram bio.
 *
 * Everything the page links to lives in this file. To publish a new podcast
 * episode, edit LATEST_EPISODE below and nothing else.
 */

/** Mixpanel `source` property shared by every outbound link on the page. */
export const LINKS_PAGE_SOURCE = "links_page";

/** Mixpanel `destination` property — one per outbound link. */
export type LinkDestination =
  | "app_store"
  | "google_play"
  | "youtube"
  | "spotify"
  | "apple_podcasts";

/** Store links are re-exported from @mealvana/shared so they can't drift from
 * the rest of the site. Change them there, not here. */
export const APP_LINKS = {
  appStore: APP_STORE_LINK,
  googlePlay: PLAY_STORE_LINK,
} as const;

/* ------------------------------------------------------------------------ */
/*  SWAP THE EPISODE HERE — title + three URLs, nothing else to touch.       */
/* ------------------------------------------------------------------------ */

export const LATEST_EPISODE = {
  title: "The Long Way to Kona: Grit, Data, and a Lot of Trial and Error",
  youtube: "https://youtu.be/df_bT31I5TE",
  spotify: "https://open.spotify.com/episode/6n3l9P9fAlJS5rQUiyqlU4",
  applePodcasts:
    "https://podcasts.apple.com/us/podcast/the-long-way-to-kona-grit-data-and-a-lot-of-trial-and-error/id1847987393?i=1000780302156",
} as const;

/* ------------------------------------------------------------------------ */

/* ------------------------------------------------------------------------ */
/*  WHICH SOCIAL PLATFORM SENT THEM — /links?src=instagram                   */
/* ------------------------------------------------------------------------ */

/**
 * Query parameter carrying the channel, e.g. /links?src=tiktok.
 *
 * One page serves every platform; only the bio link differs. The parameter
 * stays in the address bar for the whole visit, so it is still readable at the
 * moment the visitor taps an outbound link — which is the only moment that
 * matters, since nothing here is read on mount.
 */
export const PLATFORM_PARAM = "src";

/**
 * ADD A NEW CHANNEL HERE — one line, then use /links?src=<value> in that bio.
 *
 * An allowlist rather than passing the raw value through: `?src=` is public and
 * anyone (a crawler, a mangled share, someone poking at it) can put arbitrary
 * text there, and every distinct value would become a permanent property value
 * in Mixpanel. Unrecognised input buckets to "other" instead.
 */
export const KNOWN_PLATFORMS = [
  "instagram",
  "tiktok",
  "linkedin",
  "youtube",
  "newsletter",
] as const;

export type Platform = (typeof KNOWN_PLATFORMS)[number] | "other" | "direct";

/** Mixpanel properties describing where this visitor came from. */
export type PlatformProperties = {
  platform: Platform;
  /** Only set when `platform` is "other" — see below. */
  platform_raw?: string;
};

/**
 * Read the channel from a query string.
 *
 * Takes `search` so it stays pure and testable; defaults to the live URL.
 * Returns "direct" when the parameter is absent (someone reached /links without
 * going through a bio link) and "other" when it is present but unrecognised.
 *
 * In the "other" case the sanitised value rides along as `platform_raw`. That
 * exists for one specific failure: a typo in a bio link (`?src=instgram`) would
 * otherwise vanish silently into "other" with no way to tell a typo from a
 * crawler. Sanitising to a short [a-z0-9_-] slug keeps that field from becoming
 * the unbounded-cardinality problem the allowlist is there to prevent.
 */
export function readPlatform(search?: string): PlatformProperties {
  const query =
    search ?? (typeof window === "undefined" ? "" : window.location.search);

  let value: string | null = null;
  try {
    value = new URLSearchParams(query).get(PLATFORM_PARAM);
  } catch {
    // Malformed query string — treat as if it were absent.
    return { platform: "direct" };
  }

  if (!value) return { platform: "direct" };

  const normalized = value.trim().toLowerCase();
  if ((KNOWN_PLATFORMS as readonly string[]).includes(normalized)) {
    return { platform: normalized as Platform };
  }

  const slug = normalized.replace(/[^a-z0-9_-]/g, "").slice(0, 32);
  return slug
    ? { platform: "other", platform_raw: slug }
    : { platform: "other" };
}

/* ------------------------------------------------------------------------ */
/*  STORE CAMPAIGN LINKS — attributing installs, not just clicks             */
/* ------------------------------------------------------------------------ */

/**
 * Apple provider token, from App Store Connect → Analytics → Acquisition →
 * Campaigns ("Generate a Campaign Link").
 *
 * Not a secret: it appears in public marketing URLs by design, which is why it
 * sits in the repo rather than in an env var.
 */
export const APPLE_PROVIDER_TOKEN = "123134095";

/**
 * The store URL for a destination, tagged so the store itself can attribute the
 * install to a platform.
 *
 * Mixpanel stops at the click — once the visitor leaves for the store our
 * JavaScript is gone and we can never learn whether they installed. Only Apple
 * and Google know that, and only if the campaign rode along on the link:
 * Apple reads `ct` (App Store Connect → Campaigns), Google reads `referrer`
 * (Play Console → Acquisition).
 *
 * Deliberately NOT folded into APP_STORE_LINK / PLAY_STORE_LINK in
 * @mealvana/shared: those are used all over the site, and tagging them there
 * would attribute every footer and homepage link to this page's campaigns.
 */
export function campaignStoreUrl(
  store: "appStore" | "googlePlay",
  platform: Platform,
): string {
  const base = store === "appStore" ? APP_LINKS.appStore : APP_LINKS.googlePlay;

  try {
    const url = new URL(base);

    if (store === "appStore") {
      url.searchParams.set("pt", APPLE_PROVIDER_TOKEN);
      url.searchParams.set("ct", platform);
      url.searchParams.set("mt", "8");
    } else {
      /* Play takes one `referrer` value containing an encoded UTM string;
       * searchParams.set handles the inner escaping. */
      url.searchParams.set(
        "referrer",
        `utm_source=${platform}&utm_medium=social&utm_campaign=${LINKS_PAGE_SOURCE}`,
      );
    }

    return url.toString();
  } catch {
    // A malformed base URL must never cost us the download itself.
    return base;
  }
}
