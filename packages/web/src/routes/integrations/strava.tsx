import { createFileRoute } from "@tanstack/react-router";
import { IntegrationPage } from "@/components/integration-page";
import { faqPageJsonLd } from "@/lib/structured-data";

const PARTNER = "Strava";

const FAQS = [
  {
    question: "Does Mealvana Endurance integrate with Strava?",
    answer:
      "Strava integration is coming soon to Mealvana Endurance. We're actively building it so that your runs, rides, and swims on Strava automatically shape your carbohydrate, sodium, and hydration targets inside Mealvana. Until then, you can log workouts manually in the app, or connect Garmin Connect, TrainingPeaks, or Final Surge, all of which are live today.",
  },
  {
    question: "When will the Strava integration launch?",
    answer:
      "We haven't announced a public launch date yet. The integration is on the roadmap and the Strava brand assets are already in the app. If you want to know the moment it ships, download Mealvana Endurance and opt in to product updates from Settings, or sign up for the newsletter on the homepage.",
  },
  {
    question: "What Strava data will Mealvana use when it's available?",
    answer:
      "The planned integration will read activity type (run, ride, swim, triathlon), distance, moving time, average heart rate, and perceived intensity. Mealvana will use that to compute your session's Intensity Factor (IF), place it on a 0.68 / 0.88 / 1.08 scale for conversational / tempo / all-out effort, and scale your carb demand — from roughly 25 g/hr at IF 0.55 up to 115 g/hr at IF 1.10 for a 75 kg athlete.",
  },
  {
    question: "Can I use Mealvana Endurance without Strava right now?",
    answer:
      "Yes. Mealvana Endurance is fully usable today. You can log training manually or connect Garmin Connect (approved Garmin Health API partner), TrainingPeaks (two-way Partner API), or Final Surge (Partner API) — all three are live and automatically feed fueling calculations.",
  },
  {
    question: "Will the Strava integration be free when it ships?",
    answer:
      "Yes. When Strava integration launches, connecting it to Mealvana Endurance will be included with every account, including the free tier. You will not need a Strava subscription upgrade on your side.",
  },
  {
    question: "Which Mealvana integrations work today?",
    answer:
      "Garmin Connect (push model via Health API), TrainingPeaks (two-way Partner API with full nutrition:write and metrics:write scopes), and Final Surge (14-day fueling plan from the Partner API) are all live today. Strava is in progress.",
  },
  {
    question: "Will it work for triathletes when Strava lands?",
    answer:
      "Yes. Strava's triathlon, swim, and bike activity types are planned to flow into Mealvana Endurance. For brick workouts and race-day multisport efforts, Mealvana stacks carb demand across sessions using a 1.1× compounding factor per additional endurance session, capped at 12 g/kg body weight per day.",
  },
  {
    question: "Can I get notified when the Strava integration goes live?",
    answer:
      "Yes. Sign up for the Mealvana Endurance newsletter on the homepage, or install the app and enable product update notifications. We'll announce the Strava launch on both channels at the same time.",
  },
];

export const Route = createFileRoute("/integrations/strava")({
  head: () => ({
    meta: [
      {
        title:
          "Strava Integration (Coming Soon) | Mealvana Endurance",
      },
      {
        name: "description",
        content:
          "Strava integration is coming soon to Mealvana Endurance. Until then, connect Garmin Connect, TrainingPeaks, or Final Surge for automated fueling plans.",
      },
      {
        property: "og:title",
        content: "Strava Integration Coming Soon | Mealvana Endurance",
      },
      {
        property: "og:description",
        content:
          "Strava support is on the Mealvana Endurance roadmap. Garmin, TrainingPeaks, and Final Surge are live today.",
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
  component: StravaIntegrationPage,
});

function StravaIntegrationPage() {
  return (
    <IntegrationPage
      partnerName={PARTNER}
      partnerLogo="/images/integrations/strava.svg"
      logoHeightClass="h-7"
      tagline="Strava support is coming soon."
      intro="Mealvana Endurance is actively building its Strava integration so that every run, ride, and swim you log on Strava will automatically shape your fueling plan. Until then, Garmin Connect, TrainingPeaks, and Final Surge are live today and cover most athlete setups — including athletes who also record to Strava."
      syncRows={[
        {
          label: "Status",
          value:
            "In progress. No public launch date yet. Follow the Mealvana newsletter or install the app to hear the moment it ships.",
        },
        {
          label: "What will sync (once live)",
          value:
            "Activity type (run, ride, swim, triathlon), distance, moving time, average heart rate, and perceived intensity for every activity on your Strava account.",
        },
        {
          label: "What to use today",
          value:
            "Garmin Connect (push from any Fenix, Forerunner, or Edge), TrainingPeaks (two-way Partner API), or Final Surge (Partner API). Each of these is a live integration that feeds the same fueling calculations.",
        },
        {
          label: "Cost (once live)",
          value:
            "The Strava integration will be free on every Mealvana Endurance account, including the free tier. No Strava subscription upgrade required.",
        },
        {
          label: "Who's building it",
          value:
            "Mealvana is built by Milkman Inc. in Birmingham, Alabama. The Strava brand assets are already in the app — we’re finishing the OAuth and activity-ingestion plumbing.",
        },
      ]}
      howToSteps={[
        {
          title: "Download Mealvana Endurance",
          body: "The Strava integration will land inside the existing app — no separate download. Get the app so the update reaches you automatically.",
        },
        {
          title: "Connect Garmin, TrainingPeaks, or Final Surge today",
          body: "All three are live Mealvana integrations. If you record to Strava from Garmin, connecting Garmin to Mealvana already covers your activity data.",
        },
        {
          title: "Opt in to product updates",
          body: "Inside the Mealvana app under Settings, enable product notifications. We ship integration launches there first.",
        },
        {
          title: "Subscribe to the newsletter",
          body: "On the Mealvana Endurance homepage, sign up to be notified the moment Strava support goes live.",
        },
      ]}
      faqs={FAQS}
      relatedIntegrations={[
        { name: "Garmin", href: "/integrations/garmin" },
        { name: "TrainingPeaks", href: "/integrations/training-peaks" },
        { name: "Final Surge", href: "/integrations/final-surge" },
      ]}
    />
  );
}
