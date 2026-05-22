import { APP_STORE_LINK, PLAY_STORE_LINK } from "@mealvana/shared";

/**
 * App Store + Google Play download badges.
 * Single source of truth for the official store buttons used across the site
 * (homepage hero, "Start Fueling Smarter Today", pre-footer CTA, calculator).
 */
export function AppStoreButtons({
  className = "flex flex-wrap items-center gap-4",
  imgClassName = "h-14",
}: {
  className?: string;
  imgClassName?: string;
}) {
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
