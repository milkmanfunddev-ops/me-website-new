import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ArrowRight, ChevronDown, Check, X } from "lucide-react";
import { APP_STORE_LINK, PLAY_STORE_LINK } from "@mealvana/shared";
import { faqPageJsonLd } from "@/lib/structured-data";

const FAQS = [
  {
    question: "What's the difference between Mealvana Endurance and MAVR?",
    answer:
      "Both are AI-driven nutrition apps for endurance athletes, but they're built for different problems. Mealvana Endurance generates full daily nutrition plans — breakfast, lunch, dinner, snacks, and session fueling — built on ACSM metabolic formulas, ISSN sports-nutrition guidelines, and 50+ peer-reviewed studies. MAVR focuses on race-day and in-session fueling (carbs, caffeine, sodium) with a race-plan calculator. If you want a single app that plans your entire training week's meals and your race day, that's Mealvana. If you want a race-day fueling calculator, MAVR covers that slice.",
  },
  {
    question: "Which app is better for coached athletes?",
    answer:
      "Mealvana Endurance. It integrates two-way with TrainingPeaks (client ID \"mealvana\", Partner API, full workouts:read and metrics:write scopes) and with Final Surge (log.finalsurge.com/API/v1), and it has a dedicated Coach Mode targeting RRCA, USAT, ACE, NASM, and ACSM-certified coaches managing 10–50 athletes. Coach Mode surfaces fueling adherence on each TrainingPeaks or Final Surge workout alongside the coach's planned TSS. MAVR imports structured training blocks from Runna, TrainingPeaks, and COROS but does not have a coach-facing platform.",
  },
  {
    question: "Does Mealvana or MAVR integrate with more training platforms?",
    answer:
      "Mealvana Endurance integrates with Strava, Garmin Connect (approved Garmin Health API partner with OAuth 2.0 PKCE flow), TrainingPeaks (two-way Partner API), and Final Surge. MAVR integrates with Runna, TrainingPeaks, and COROS. If your stack is Garmin + Strava, Mealvana is the fit; if your stack is Runna + COROS, MAVR is the fit. TrainingPeaks users can use either, but only Mealvana writes nutrition metrics back into TrainingPeaks.",
  },
  {
    question: "Do both apps cover carb loading and gut training?",
    answer:
      "Yes, but with different depth. Mealvana Endurance generates multi-day carb load protocols (up to 9.0 g/kg body weight on race day or high-load days), has a dedicated 3-level gut-training multiplier (0.7 / 0.8 / 1.0) that scales carb intake across 21 during-workout templates, and runs on a carb cycling protocol (reduction to 3.0 g/kg on easy single-session days) for adaptation. MAVR provides race-day carb, sodium, and caffeine recommendations (60–90 g/hr, up to 120 g/hr with gut training) but does not generate full daily meal plans around it.",
  },
  {
    question: "Which app works better offline?",
    answer:
      "Mealvana Endurance is offline-first by design — every fueling plan, gut-training protocol, and race-day timeline is cached locally on your phone. Critical for remote training camps, ultras, and race locations with poor cell service. MAVR's race-plan calculator is primarily a web app with mobile companion views.",
  },
  {
    question: "What's the pricing difference?",
    answer:
      "Mealvana Endurance targets $9.99/month or $69.99/year with a 1-month free trial. Check each app's current pricing on the App Store or Google Play for the latest numbers — this space changes fast.",
  },
  {
    question: "Which has stronger scientific backing?",
    answer:
      "Mealvana Endurance grounds every recommendation in ACSM metabolic formulas, ISSN sports-nutrition guidelines, and a research base of 50+ peer-reviewed studies. Sweat-rate percentiles come from Barnes & Baker et al. (2019, n=1,303 athletes); sodium percentiles from Baker et al. (2016, n=506); pre-hydration protocols from ACSM (Sawka et al. 2007). Both apps are AI-powered; Mealvana pairs the AI with a deterministic formula-based fallback so recommendations are reproducible and auditable.",
  },
  {
    question: "Is Mealvana Endurance available on iOS and Android?",
    answer:
      "Yes, on both — plus a web app at app.mealvana.io. iOS App ID 6751113738, Android package com.milkman.mealvanaendurance.",
  },
  {
    question: "Can I try Mealvana Endurance for free?",
    answer:
      "Yes. Mealvana Endurance has a free tier with basic fueling calculations and a limited number of meal plans. Premium features (AI-powered plans, gut training protocols, carb loading calculators, by-hour race-day planning, training platform integrations, Coach Mode) come with a 1-month free trial on the $9.99/month or $69.99/year subscription.",
  },
];

type FeatureRow = {
  feature: string;
  mealvana: string | boolean;
  mavr: string | boolean;
  note?: string;
};

const FEATURE_ROWS: FeatureRow[] = [
  { feature: "Full daily meal plans (not just session fueling)", mealvana: true, mavr: false },
  { feature: "Race-day by-hour fueling timeline", mealvana: true, mavr: true },
  { feature: "Carb loading protocols (multi-day)", mealvana: true, mavr: "Limited" },
  { feature: "Gut training with progressive multipliers", mealvana: "3 levels (0.7/0.8/1.0)", mavr: "Acknowledged, not structured" },
  { feature: "Strava integration", mealvana: true, mavr: false },
  { feature: "Garmin Connect integration", mealvana: "Health API partner", mavr: false },
  { feature: "TrainingPeaks integration", mealvana: "Two-way Partner API", mavr: "Read-only" },
  { feature: "Final Surge integration", mealvana: true, mavr: false },
  { feature: "Runna integration", mealvana: false, mavr: true },
  { feature: "COROS integration", mealvana: false, mavr: true },
  { feature: "Coach Mode (certified coaches managing athletes)", mealvana: true, mavr: false },
  { feature: "Offline-first architecture", mealvana: true, mavr: "Limited" },
  { feature: "Scientific basis", mealvana: "ACSM + ISSN + 50+ studies", mavr: "AI-led" },
  { feature: "Available on iOS, Android, and Web", mealvana: true, mavr: "Web-first" },
];

export const Route = createFileRoute("/compare/mealvana-vs-mavr")({
  head: () => ({
    meta: [
      {
        title:
          "Mealvana Endurance vs MAVR: Which Nutrition App for Endurance Athletes? | 2026",
      },
      {
        name: "description",
        content:
          "Mealvana Endurance vs MAVR compared across integrations, meal planning, gut training, carb loading, coach features, and scientific basis. For runners, cyclists, and triathletes.",
      },
      {
        property: "og:title",
        content: "Mealvana Endurance vs MAVR — Which Nutrition App?",
      },
      {
        property: "og:description",
        content:
          "A side-by-side comparison of Mealvana Endurance and MAVR for endurance athletes and coaches.",
      },
      { property: "og:type", content: "article" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(faqPageJsonLd(FAQS)),
      },
    ],
  }),
  component: CompareMealvanaVsMavrPage,
});

function CompareMealvanaVsMavrPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bg-blackberry">
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-orange/10 blur-[120px]" />
          <div className="absolute right-0 top-1/3 h-[300px] w-[300px] rounded-full bg-electrolyte/8 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-cream/10 bg-cream/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-cream/60 backdrop-blur-sm"
          >
            Endurance nutrition apps · 2026
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 font-heading text-4xl font-black leading-[1.05] tracking-tight text-cream sm:text-5xl lg:text-6xl"
          >
            Mealvana Endurance vs MAVR
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-cream/60"
          >
            Both are AI-driven nutrition apps built for endurance athletes. They
            solve different pieces of the fueling problem — this page covers
            exactly where each one wins.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-cream to-transparent" />
      </section>

      {/* TL;DR */}
      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-cream-dark p-8 sm:p-10">
            <h2 className="font-heading text-2xl font-bold text-blackberry">
              Bottom line
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="font-heading text-lg font-bold text-orange">
                  Choose Mealvana Endurance if…
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {[
                    "You want full daily meal plans, not just race-day fueling.",
                    "Your stack is Strava, Garmin, TrainingPeaks, or Final Surge.",
                    "You coach (or are coached by) a certified endurance coach.",
                    "You train or race in remote areas and need offline-first.",
                    "You want recommendations traceable to ACSM and ISSN science.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-blackberry">
                  Choose MAVR if…
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {[
                    "You only need a race-day fueling calculator.",
                    "Your stack is Runna or COROS.",
                    "You don't want full meal planning.",
                    "You're comfortable web-first.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blackberry/60" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="bg-cream-dark py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-blackberry sm:text-4xl">
            Feature-by-feature
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Where each app fits for runners, cyclists, and triathletes.
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-cream">
            <table className="w-full text-left">
              <thead className="bg-blackberry text-cream">
                <tr>
                  <th className="px-6 py-4 font-heading text-sm font-bold">
                    Feature
                  </th>
                  <th className="px-6 py-4 font-heading text-sm font-bold">
                    Mealvana Endurance
                  </th>
                  <th className="px-6 py-4 font-heading text-sm font-bold">
                    MAVR
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {FEATURE_ROWS.map((row) => (
                  <tr key={row.feature} className="align-top">
                    <td className="px-6 py-4 text-sm font-medium text-blackberry">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      <Cell value={row.mealvana} highlight />
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      <Cell value={row.mavr} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Integrations and features listed for MAVR reflect publicly available
            information at the time of writing. Check each app's current site
            for updates.
          </p>
        </div>
      </section>

      {/* Integration detail */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-blackberry sm:text-4xl">
            Integrations compared
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            The simplest way to pick: which platforms does your training already
            live on?
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-orange/20 bg-cream-dark p-6">
              <p className="font-heading text-xs font-bold uppercase tracking-wider text-orange">
                Mealvana Endurance
              </p>
              <ul className="mt-4 space-y-2 text-sm text-foreground">
                {[
                  "Strava (one-way read)",
                  "Garmin Connect (Health API partner, push model)",
                  "TrainingPeaks (two-way Partner API)",
                  "Final Surge (Partner API, 14-day fueling)",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-cream-dark p-6">
              <p className="font-heading text-xs font-bold uppercase tracking-wider text-blackberry">
                MAVR
              </p>
              <ul className="mt-4 space-y-2 text-sm text-foreground">
                {[
                  "Runna",
                  "TrainingPeaks (read-only)",
                  "COROS",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blackberry/60" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-cream-dark py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-blackberry sm:text-4xl">
            Mealvana vs MAVR FAQ
          </h2>
          <div className="mt-10">
            {FAQS.map((faq, i) => (
              <CompareFaqRow
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blackberry py-20 text-center text-cream sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">
            Try Mealvana Endurance free.
          </h2>
          <p className="mt-4 text-cream/70">
            iOS, Android, and the web. Full nutrition plans for runners,
            cyclists, and triathletes. 1-month free trial on premium.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={APP_STORE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <img src="/appstore.png" alt="Download on the App Store" className="h-12" />
            </a>
            <a
              href={PLAY_STORE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <img src="/playstore.png" alt="Get it on Google Play" className="h-12" />
            </a>
          </div>
          <p className="mt-6 text-sm text-cream/40">
            Compare more:{" "}
            <Link
              to="/integrations"
              className="underline underline-offset-4 transition-colors hover:text-cream/80"
            >
              see every platform Mealvana integrates with
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

function Cell({ value, highlight = false }: { value: string | boolean; highlight?: boolean }) {
  if (value === true) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${highlight ? "text-orange" : "text-foreground/70"}`}>
        <Check className="h-4 w-4" />
        Yes
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center gap-1.5 text-muted-foreground/60">
        <X className="h-4 w-4" />
        No
      </span>
    );
  }
  return <span>{value}</span>;
}

function CompareFaqRow({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.04, duration: 0.45 }}
      className="border-b border-blackberry/10"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-orange"
      >
        <span className="pr-4 font-heading text-lg font-bold text-blackberry">
          {question}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="h-5 w-5 shrink-0 text-orange" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 leading-relaxed text-muted-foreground">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

