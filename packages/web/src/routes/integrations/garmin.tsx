import { createFileRoute } from "@tanstack/react-router";
import { IntegrationPage } from "@/components/integration-page";
import { faqPageJsonLd } from "@/lib/structured-data";

const PARTNER = "Garmin";

const FAQS = [
  {
    question: "Does Mealvana Endurance integrate with Garmin Connect?",
    answer:
      "Yes. Mealvana Endurance connects to Garmin Connect as an approved Garmin Health API partner. Every activity you sync from your Garmin watch or bike computer — along with sleep, stress, body composition, and daily metrics — automatically updates your fueling plan in Mealvana.",
  },
  {
    question: "What Garmin data does Mealvana Endurance read?",
    answer:
      "Mealvana uses ten Garmin Health API data streams: activities, activity details, body composition, dailies, epochs, sleep, and stress metrics, among others. That gives Mealvana enough signal to compute session intensity, estimate recovery debt (triggered when TSS ≥ 150 the day before), and adjust carb and sodium targets against ACSM formulas.",
  },
  {
    question: "How is the Garmin integration secured?",
    answer:
      "Garmin Connect connects via OAuth 2.0 with PKCE — a 64-byte code verifier and SHA-256 challenge, redirected through a secure deep link back to Mealvana Endurance. Mealvana never sees your Garmin password, and you can revoke the connection from Garmin Connect at any time.",
  },
  {
    question: "Why does Mealvana use Garmin's push model instead of a sync button?",
    answer:
      "Garmin's Health API is push-only: when your watch or bike computer syncs to Garmin Connect (via Garmin Connect Mobile or Garmin Express), Garmin pushes that activity to Mealvana automatically. There's no \"Sync Now\" button to tap — workouts land in Mealvana the moment Garmin has them, typically within seconds of finishing your activity.",
  },
  {
    question: "How do I connect my Garmin watch to Mealvana Endurance?",
    answer:
      "Open the Mealvana Endurance app → Settings → Integrations → Garmin Connect → Connect. Sign in to Garmin Connect, approve the Mealvana permissions, and you're back in the app. Your next workout will appear in Mealvana as soon as your Garmin device syncs.",
  },
  {
    question: "Does Mealvana work with my Garmin Fenix, Forerunner, or Edge?",
    answer:
      "Yes — anything that syncs to Garmin Connect works, including Fenix, Forerunner, Enduro, Epix, Venu, Edge bike computers, and Vivoactive. Mealvana reads the Garmin Connect feed, not the device directly, so any model that lands activities in Garmin Connect is supported.",
  },
  {
    question: "Can Garmin sleep and stress data improve my nutrition plan?",
    answer:
      "Yes. Garmin's sleep score and all-day stress metrics feed Mealvana's recovery-debt model, which tracks glycogen replacement windows out to 36 hours after a hard session. If you slept poorly after a TSS 180 long run, Mealvana holds carb intake slightly higher the next day to close the recovery gap.",
  },
  {
    question: "Does Garmin Connect's new nutrition logging replace Mealvana?",
    answer:
      "No. Garmin Connect+'s food-logging feature launched in January 2026 as a basic calorie/macro tracker. Mealvana Endurance is purpose-built for endurance athletes — it generates personalized fueling plans with phase-specific pre/during/post targets, gut-training protocols, and race-day timelines grounded in ACSM formulas and 50+ peer-reviewed studies. The two tools solve different problems and work well together: Garmin tracks the workout, Mealvana fuels it.",
  },
  {
    question: "What if I use Garmin for trail running or ultras in remote areas?",
    answer:
      "Mealvana Endurance is offline-first. On race day — whether you're on a 100-mile ultra or a remote gravel ride — your fueling timeline, carb-per-hour targets, and electrolyte plan are cached locally on your phone. When your Garmin syncs back to Garmin Connect post-race, Mealvana updates your recovery plan automatically.",
  },
];

export const Route = createFileRoute("/integrations/garmin")({
  head: () => ({
    meta: [
      {
        title:
          "Garmin Connect Integration | Mealvana Endurance — Automatic Fueling From Every Activity",
      },
      {
        name: "description",
        content:
          "Connect Garmin Connect to Mealvana Endurance. Activities, sleep, stress, and body-comp data automatically adjust your carb, sodium, and hydration plan.",
      },
      { property: "og:title", content: "Garmin Integration | Mealvana Endurance" },
      {
        property: "og:description",
        content:
          "Garmin Connect activities, sleep, and stress metrics feed personalized endurance nutrition plans built on ACSM formulas.",
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
  component: GarminIntegrationPage,
});

function GarminIntegrationPage() {
  return (
    <IntegrationPage
      partnerName={PARTNER}
      partnerLogo="/images/integrations/garmin.svg"
      logoHeightClass="h-7"
      tagline="Every Garmin sync becomes a fueling update."
      intro="Mealvana Endurance is an approved Garmin Health API partner. The moment your Fenix, Forerunner, or Edge syncs to Garmin Connect, Mealvana pulls in the activity, sleep score, stress metrics, and body composition and rebuilds your pre-run carbs, during-session g/hr, and recovery window — all against ACSM-derived formulas."
      syncRows={[
        {
          label: "What Garmin pushes to Mealvana",
          value:
            "Ten Health API streams: activities, activity details, body composition, dailies, epochs, sleep, and stress metrics (and more). Supports Fenix, Forerunner, Enduro, Epix, Venu, Edge, and Vivoactive — anything that reaches Garmin Connect.",
        },
        {
          label: "What Mealvana does with it",
          value:
            "Computes session intensity, triggers recovery debt when TSS ≥ 150 the day before, and scales carbs up to 115 g/hr for IF 1.10 sessions — weight-scaled to you. Sleep and stress feed the 36-hour glycogen replacement window.",
        },
        {
          label: "Sync model",
          value:
            "Push-only. Garmin pushes activities to Mealvana the moment your device syncs to Garmin Connect — typically seconds after you finish. No \"Sync Now\" button required.",
        },
        {
          label: "Auth",
          value:
            "OAuth 2.0 with PKCE (64-byte code verifier, SHA-256 challenge). Mealvana never sees your Garmin password; revoke any time from Garmin Connect.",
        },
        {
          label: "Cost",
          value:
            "Included with every Mealvana Endurance account. No Garmin Connect+ subscription required.",
        },
      ]}
      howToSteps={[
        {
          title: "Open Settings → Integrations",
          body: "In the Mealvana Endurance app, tap profile → Settings → Integrations → Garmin Connect.",
        },
        {
          title: "Tap Connect",
          body: "Mealvana opens Garmin Connect's OAuth page in a secure browser. You're signing in with Garmin, not with Mealvana.",
        },
        {
          title: "Approve permissions",
          body: "Grant Mealvana read access to activities, sleep, and daily metrics. You can revoke any time from Garmin Connect.",
        },
        {
          title: "Finish a workout",
          body: "As soon as your watch syncs, Garmin pushes the activity to Mealvana and your next meal plan updates automatically.",
        },
      ]}
      faqs={FAQS}
      relatedIntegrations={[
        { name: "Strava", href: "/integrations/strava" },
        { name: "TrainingPeaks", href: "/integrations/training-peaks" },
        { name: "Final Surge", href: "/integrations/final-surge" },
      ]}
    />
  );
}
