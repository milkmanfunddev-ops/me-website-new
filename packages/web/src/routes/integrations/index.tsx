import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ViewportFade } from "@/components/viewport-fade";

const INTEGRATIONS = [
  {
    name: "Garmin Connect",
    slug: "garmin",
    logo: "/images/integrations/garmin.svg",
    logoHeight: "h-6",
    status: "live" as const,
    blurb:
      "Approved Garmin Health API partner. Activities, sleep, and stress metrics push into Mealvana automatically from any Fenix, Forerunner, or Edge.",
  },
  {
    name: "TrainingPeaks",
    slug: "training-peaks",
    logo: "/images/integrations/training-peaks.svg",
    logoHeight: "h-5",
    status: "live" as const,
    blurb:
      "Two-way Partner API integration. Planned workouts drive the fueling plan; nutrition macros write back as metrics your coach can see.",
  },
  {
    name: "Final Surge",
    slug: "final-surge",
    logo: "/images/integrations/final-surge.svg",
    logoHeight: "h-5",
    status: "live" as const,
    blurb:
      "14-day fueling plan in 15–20 seconds from your coach's Final Surge workouts. Running, cycling, swim, and triathlon.",
  },
  {
    name: "Strava",
    slug: "strava",
    logo: "/images/integrations/strava.svg",
    logoHeight: "h-6",
    status: "coming-soon" as const,
    blurb:
      "Run, ride, and swim sync from Strava is on the roadmap. Until then, Garmin, TrainingPeaks, and Final Surge cover most setups.",
  },
];

export const Route = createFileRoute("/integrations/")({
  head: () => ({
    meta: [
      {
        title:
          "Integrations | Mealvana Endurance — Strava, Garmin, TrainingPeaks, Final Surge",
      },
      {
        name: "description",
        content:
          "Mealvana Endurance integrates with Strava, Garmin Connect, TrainingPeaks, and Final Surge. Your training drives your fueling plan — automatically.",
      },
    ],
  }),
  component: IntegrationsIndexPage,
});

function IntegrationsIndexPage() {
  return (
    <div>
      <section className="relative bg-blackberry py-20 sm:py-28">
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-orange/10 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading text-4xl font-black text-cream sm:text-5xl lg:text-6xl"
          >
            Works with the platforms you already use.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-cream/60"
          >
            Mealvana Endurance connects directly with Strava, Garmin Connect,
            TrainingPeaks, and Final Surge. Your training drives your fueling
            plan — no manual workout entry required.
          </motion.p>
        </div>
      </section>

      <section className="bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {INTEGRATIONS.map((integration, i) => (
              <ViewportFade key={integration.slug} delay={i * 0.06}>
                <Link
                  to={`/integrations/${integration.slug}` as string}
                  className="group relative flex h-full flex-col rounded-3xl border border-border bg-cream-dark p-8 transition-all duration-300 hover:border-orange/30 hover:shadow-lg hover:shadow-orange/5 hover:-translate-y-1"
                >
                  {integration.status === "coming-soon" && (
                    <span className="absolute right-5 top-5 rounded-full bg-blackberry/10 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-blackberry">
                      Coming soon
                    </span>
                  )}
                  <div className="flex items-center gap-4">
                    <img
                      src={integration.logo}
                      alt={integration.name}
                      className={`${integration.logoHeight} w-auto object-contain`}
                    />
                  </div>
                  <h2 className="mt-5 font-heading text-2xl font-bold text-blackberry">
                    {integration.name}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {integration.blurb}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 font-heading text-sm font-bold text-orange">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </ViewportFade>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
