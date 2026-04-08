import { createFileRoute, Link } from "@tanstack/react-router";
import { ViewportFade } from "@/components/viewport-fade";
import {
  APP_NAME,
  APP_STORE_LINK,
  PLAY_STORE_LINK,
  WEB_APP_URL,
} from "@mealvana/shared";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Demo | Mealvana Endurance" },
      {
        name: "description",
        content:
          "See Mealvana Endurance in action. Watch demo videos and download the app.",
      },
    ],
  }),
  component: DemoPage,
});

function DemoPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <ViewportFade>
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground">
            See {APP_NAME} in Action
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Watch how athletes use {APP_NAME} to dial in their race-day
            nutrition.
          </p>
        </div>
      </ViewportFade>

      <ViewportFade>
        <div className="mt-12 aspect-video overflow-hidden rounded-xl border border-border bg-blackberry">
          <div className="flex h-full items-center justify-center text-cream/50">
            <p className="text-lg">Demo video coming soon</p>
          </div>
        </div>
      </ViewportFade>

      <ViewportFade>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <h3 className="font-heading text-lg font-bold text-foreground">
              Create Your Plan
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Input your sport, event distance, and body stats. Our algorithm
              builds a personalized fueling strategy.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <h3 className="font-heading text-lg font-bold text-foreground">
              Train with Confidence
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Practice your nutrition plan during training. Refine it based on
              what your gut tells you.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <h3 className="font-heading text-lg font-bold text-foreground">
              Race Ready
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              On race day, follow your tested plan. Know exactly what to eat,
              when, and how much.
            </p>
          </div>
        </div>
      </ViewportFade>

      <ViewportFade>
        <div className="mt-16 rounded-xl bg-blackberry p-10 text-center text-cream">
          <h2 className="font-heading text-2xl font-bold">
            Ready to try it yourself?
          </h2>
          <p className="mt-2 text-cream/70">
            Download the app or try the web version.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={APP_STORE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <img
                src="/images/app-store-badge.svg"
                alt="Download on the App Store"
                className="h-12"
              />
            </a>
            <a
              href={PLAY_STORE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <img
                src="/images/google-play-badge.svg"
                alt="Get it on Google Play"
                className="h-12"
              />
            </a>
          </div>
          <a
            href={WEB_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-cream/70 underline hover:text-cream"
          >
            Or try the web version
          </a>
        </div>
      </ViewportFade>
    </div>
  );
}
