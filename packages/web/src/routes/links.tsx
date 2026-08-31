import { createFileRoute } from "@tanstack/react-router";
import { Youtube } from "lucide-react";
import type { ReactNode } from "react";
import { APP_NAME, APP_DESCRIPTION, APP_URL } from "@mealvana/shared";
import { AppleMark, PlayMark } from "@/components/app-store-buttons";
import { trackEvent } from "@/lib/analytics";
import {
  APP_LINKS,
  LATEST_EPISODE,
  LINKS_PAGE_SOURCE,
  readPlatform,
  type LinkDestination,
} from "@/lib/links-page";

const PAGE_TITLE = `${APP_NAME} | Get the app & listen to the podcast`;
const PAGE_DESCRIPTION =
  "Download Mealvana Endurance for iOS or Android, and listen to the latest episode of the podcast on YouTube, Spotify, or Apple Podcasts.";
const PAGE_URL = `${APP_URL}/links`;
const OG_IMAGE = `${APP_URL}/appicon.png`;

export const Route = createFileRoute("/links")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:alt", content: `${APP_NAME} app icon` },
      { property: "og:site_name", content: APP_NAME },
      /* `summary`, not `summary_large_image`: /appicon.png is square and gets
       * letterboxed in a large card. Swap both if a 1200x630 image lands. */
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: LinksPage,
});

/* The Spotify wordless mark, and an Apple Podcasts mic, as inline SVGs — same
 * approach as app-store-buttons.tsx, so the page needs no icon dependency.
 * Spotify's geometry is the official mark; the Apple Podcasts glyph is a
 * simplified mic-in-circle rather than the gradient original. */

function SpotifyMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 496 512" aria-hidden="true" className={className} fill="#1DB954">
      <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z" />
    </svg>
  );
}

function ApplePodcastsMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="12" fill="#9933CC" />
      <path
        fill="#fff"
        d="M12 4.75a2.6 2.6 0 0 1 2.6 2.6v4.05a2.6 2.6 0 0 1-5.2 0V7.35a2.6 2.6 0 0 1 2.6-2.6z"
      />
      <path
        fill="#fff"
        d="M7 10.6a.95.95 0 0 1 1.9 0 3.1 3.1 0 0 0 6.2 0 .95.95 0 0 1 1.9 0 5.05 5.05 0 0 1-4.1 4.96v2.14a.95.95 0 0 1-1.9 0v-2.14A5.05 5.05 0 0 1 7 10.6z"
      />
    </svg>
  );
}

/* Every outbound link on the page routes through here so the Mixpanel call
 * can't be forgotten on a new link. Renders a real <a>. */
function OutboundLink({
  href,
  destination,
  className,
  children,
  ariaLabel,
}: {
  href: string;
  destination: LinkDestination;
  className: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      onClick={() =>
        trackEvent(
          "Outbound Link Clicked",
          /* readPlatform() is called here, not at mount: the ?src= parameter
           * sits in the address bar for the whole visit, and reading it at
           * click time keeps this component free of any state or effect. */
          { destination, source: LINKS_PAGE_SOURCE, ...readPlatform() },
          /* These links navigate in the same tab, so the document unloads
           * immediately. `send_immediately` bypasses Mixpanel's ~5s request
           * batcher (which does not flush on pagehide, so a queued event would
           * be lost when the visitor leaves for the App Store and never comes
           * back), and sendBeacon survives the unload where an XHR wouldn't. */
          { transport: "sendBeacon", send_immediately: true },
        )
      }
      className={`flex min-h-14 w-full items-center gap-3 rounded-xl px-5 py-3.5 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
    >
      {children}
    </a>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-heading text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </h2>
  );
}

function LinksPage() {
  return (
    <div className="mx-auto w-full max-w-md px-5 py-10 sm:py-14">
      {/* Header */}
      <header className="flex flex-col items-center text-center">
        <img
          src="/appicon.png"
          alt=""
          width={72}
          height={72}
          className="h-18 w-18 rounded-2xl shadow-sm"
        />
        <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground">
          {APP_NAME}
        </h1>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          Science-based fueling for runners, cyclists, and triathletes.
        </p>
      </header>

      {/* Get the app */}
      <section aria-labelledby="get-the-app" className="mt-10">
        <SectionHeading>
          <span id="get-the-app">Get the app</span>
        </SectionHeading>
        <div className="mt-3 flex flex-col gap-3">
          <OutboundLink
            href={APP_LINKS.appStore}
            destination="app_store"
            className="bg-blackberry text-cream active:bg-blackberry-light"
          >
            <AppleMark className="h-6 w-6 shrink-0 text-cream" />
            <span>Download for iPhone</span>
          </OutboundLink>
          <OutboundLink
            href={APP_LINKS.googlePlay}
            destination="google_play"
            className="bg-blackberry text-cream active:bg-blackberry-light"
          >
            <PlayMark className="h-6 w-6 shrink-0" />
            <span>Download for Android</span>
          </OutboundLink>
        </div>
      </section>

      {/* Latest episode */}
      <section aria-labelledby="latest-episode" className="mt-10">
        <SectionHeading>
          <span id="latest-episode">Latest episode</span>
        </SectionHeading>
        <p className="mt-3 font-heading text-xl font-bold leading-snug text-foreground">
          {LATEST_EPISODE.title}
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <OutboundLink
            href={LATEST_EPISODE.youtube}
            destination="youtube"
            ariaLabel={`Watch "${LATEST_EPISODE.title}" on YouTube`}
            className="border border-border bg-card text-foreground active:bg-cream-dark"
          >
            <Youtube className="h-6 w-6 shrink-0 text-[#FF0000]" aria-hidden="true" />
            <span>Watch on YouTube</span>
          </OutboundLink>
          <OutboundLink
            href={LATEST_EPISODE.spotify}
            destination="spotify"
            ariaLabel={`Listen to "${LATEST_EPISODE.title}" on Spotify`}
            className="border border-border bg-card text-foreground active:bg-cream-dark"
          >
            <SpotifyMark className="h-6 w-6 shrink-0" />
            <span>Listen on Spotify</span>
          </OutboundLink>
          <OutboundLink
            href={LATEST_EPISODE.applePodcasts}
            destination="apple_podcasts"
            ariaLabel={`Listen to "${LATEST_EPISODE.title}" on Apple Podcasts`}
            className="border border-border bg-card text-foreground active:bg-cream-dark"
          >
            <ApplePodcastsMark className="h-6 w-6 shrink-0" />
            <span>Listen on Apple Podcasts</span>
          </OutboundLink>
        </div>
      </section>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        {APP_DESCRIPTION}
      </p>
    </div>
  );
}
