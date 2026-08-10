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
