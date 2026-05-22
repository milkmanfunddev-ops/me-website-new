import { APP_STORE_LINK, PLAY_STORE_LINK } from "@mealvana/shared";

/* The Apple logo and the (multi-color) Google Play triangle as inline SVGs, so
 * the compact buttons render anywhere — including the footer, which doesn't
 * load Font Awesome. Geometry matches the official marks. */

function AppleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 384 512" aria-hidden="true" className={className} fill="currentColor">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C73.6 141.6 24 184.8 24 272.4c0 25.9 4.7 52.7 14.2 80.4 12.6 36.4 58 125.6 105.4 124.2 24.8-.6 42.3-17.6 74.5-17.6 31.3 0 47.5 17.6 75.4 17.6 47.8-.7 88.9-81.7 100.9-118.2-64.1-30.2-60.7-88.5-60.7-90.1zM262.1 104.5c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

function PlayMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" className={className}>
      {/* Top facet */}
      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" fill="#ff3d00" />
      {/* Left spine */}
      <path
        d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z"
        fill="#00c3ff"
      />
      {/* Right tip */}
      <path
        d="M472.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8z"
        fill="#ffce00"
      />
      {/* Bottom facet */}
      <path d="M104.6 499l220.7-221.3 60.1 60.1L104.6 499z" fill="#00e676" />
    </svg>
  );
}

/**
 * App Store + Google Play download buttons. Single source of truth across the
 * site.
 *
 * - `variant="full"` (default): the official badge images. Used in the homepage
 *   jumbotron and the main download CTA section.
 * - `variant="compact"`: narrow, official-style pill buttons (logo + label).
 *   Used in the footer and the calculator, where the full badges are excessive.
 */
export function AppStoreButtons({
  className = "flex flex-wrap items-center gap-4",
  imgClassName = "h-14",
  variant = "full",
}: {
  className?: string;
  imgClassName?: string;
  variant?: "full" | "compact";
}) {
  if (variant === "compact") {
    return (
      <div className={className}>
        <a
          href={APP_STORE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download on the App Store"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black transition-transform hover:scale-105"
        >
          <AppleMark className="h-5 w-5 text-white" />
        </a>
        <a
          href={PLAY_STORE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get it on Google Play"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black transition-transform hover:scale-105"
        >
          <PlayMark className="h-5 w-5" />
        </a>
      </div>
    );
  }

  return (
    <div className={className}>
      <a
        href={APP_STORE_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-transform hover:scale-105"
      >
        <img src="/appstore.png" alt="Download on the App Store" className={imgClassName} />
      </a>
      <a
        href={PLAY_STORE_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-transform hover:scale-105"
      >
        <img src="/playstore.png" alt="Get it on Google Play" className={imgClassName} />
      </a>
    </div>
  );
}
