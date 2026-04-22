import { createFileRoute } from "@tanstack/react-router";
import { IntegrationPage } from "@/components/integration-page";
import { faqPageJsonLd } from "@/lib/structured-data";

const PARTNER = "TrainingPeaks";

const FAQS = [
  {
    question: "Does Mealvana Endurance integrate with TrainingPeaks?",
    answer:
      "Yes. Mealvana Endurance is a TrainingPeaks Partner API integration. Planned workouts, completed workouts, athlete profile data, and upcoming events flow into Mealvana; nutrition macros and metrics flow back to TrainingPeaks. It's a true two-way integration, not a read-only mirror.",
  },
  {
    question: "What TrainingPeaks data does Mealvana read and write?",
    answer:
      "Mealvana uses the TrainingPeaks Partner API scopes athlete:profile, events:read, events:write, file:write, metrics:read, metrics:write, nutrition:read, nutrition:write, webhook:read-subscriptions, webhook:write-subscriptions, workouts:read, workouts:details, workouts:wod, and workouts:plan. That means every planned and completed workout adjusts your fueling plan, and your carb/protein/sodium targets write back into TrainingPeaks as metrics your coach can see.",
  },
  {
    question: "Why is the Mealvana + TrainingPeaks integration valuable for coaches?",
    answer:
      "TrainingPeaks is where most certified coaches plan structured workouts and track TSS. Mealvana turns each planned workout into a per-session fueling plan — pre-workout 1 g/kg carbs, during-session 25–115 g/hr scaled by Intensity Factor, post-session recovery — and writes the macro targets back into TrainingPeaks as metrics. Coaches running RRCA, USAT, ACE, NASM, or ACSM-certified programs see workout and fueling compliance in one place.",
  },
  {
    question: "How does race planning work with TrainingPeaks events?",
    answer:
      "When you add an upcoming race as an event in TrainingPeaks, Mealvana Endurance auto-fetches it and builds a race-day plan: a 3-day carb-load, pre-race hydration tier (5–7 ml/kg body weight 2–4 hours before), race-day by-hour fueling timeline, and a post-race recovery protocol. The plan updates if you edit the event's distance or date in TrainingPeaks.",
  },
  {
    question: "How do I connect TrainingPeaks to Mealvana Endurance?",
    answer:
      "In Mealvana Endurance, go to Settings → Integrations → TrainingPeaks and tap Connect. You'll be sent to oauth.trainingpeaks.com (or the sandbox on beta builds) to approve. Once approved, your athlete profile, the next 30 days of planned workouts, and all upcoming events sync within seconds.",
  },
  {
    question: "Does the TrainingPeaks integration require a Premium TrainingPeaks subscription?",
    answer:
      "Any active TrainingPeaks account (including free Basic) works with the Mealvana Endurance integration. Premium TrainingPeaks features (structured workout libraries, PMC charts) remain in TrainingPeaks — Mealvana complements them with a fueling layer, it doesn't try to replace them.",
  },
  {
    question: "What happens when my coach changes a workout in TrainingPeaks?",
    answer:
      "TrainingPeaks pushes workout-updated webhooks to Mealvana, so when your coach swaps a 90-minute Z2 for a 60-minute tempo interval, Mealvana recalculates IF, duration, and total carb demand — usually in under a minute. You'll see the updated pre-workout target before your next meal.",
  },
  {
    question: "Is Mealvana an official TrainingPeaks partner?",
    answer:
      "Yes. Mealvana uses TrainingPeaks' Partner API with the client ID \"mealvana\" and all scopes required for two-way nutrition integration. The connection tokens are standard OAuth 2.0 with a 1-hour access token lifetime; Mealvana handles refresh transparently so you never have to re-authenticate mid-training-block.",
  },
  {
    question: "Can I use Mealvana with TrainingPeaks and also Strava / Garmin?",
    answer:
      "Yes. Most athletes plan in TrainingPeaks and record in Garmin or Strava — Mealvana de-duplicates activities across all three so a single run doesn't inflate training load. If a Garmin activity is linked to a TrainingPeaks planned workout, Mealvana reconciles them and uses the richer data for fueling.",
  },
];

export const Route = createFileRoute("/integrations/training-peaks")({
  head: () => ({
    meta: [
      {
        title:
          "TrainingPeaks Integration | Mealvana Endurance — Two-Way Fueling for Coached Athletes",
      },
      {
        name: "description",
        content:
          "Mealvana Endurance is a TrainingPeaks Partner API integration. Planned workouts and events drive fueling; macros write back as TrainingPeaks metrics.",
      },
      {
        property: "og:title",
        content: "TrainingPeaks Integration | Mealvana Endurance",
      },
      {
        property: "og:description",
        content:
          "Two-way TrainingPeaks integration for endurance athletes and certified coaches.",
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
  component: TrainingPeaksIntegrationPage,
});

function TrainingPeaksIntegrationPage() {
  return (
    <IntegrationPage
      partnerName={PARTNER}
      partnerLogo="/images/integrations/training-peaks.svg"
      logoHeightClass="h-6"
      tagline="TrainingPeaks drives the plan. Mealvana fuels it."
      intro="Mealvana Endurance is a TrainingPeaks Partner API integration. Planned workouts, completed workouts, athlete profiles, and upcoming events sync into Mealvana — and the carb, protein, and sodium targets Mealvana generates write back into TrainingPeaks as metrics coaches can see. Built for the RRCA, USAT, ACE, NASM, and ACSM-certified coaches who live in TrainingPeaks."
      syncRows={[
        {
          label: "What comes in from TrainingPeaks",
          value:
            "Planned workouts, completed workouts, workout details, athlete profile, upcoming events, and coach-athlete relationships — via the athlete:profile, events:read, workouts:read/details/plan, and webhook:read-subscriptions scopes.",
        },
        {
          label: "What Mealvana writes back",
          value:
            "Daily nutrition macros (carbs, protein, fat, sodium, fluid), pre/during/post-workout targets, and adherence metrics — via the metrics:write, nutrition:write, events:write, and file:write scopes. Coaches see fueling alongside TSS in TrainingPeaks.",
        },
        {
          label: "Race planning",
          value:
            "Any event added in TrainingPeaks auto-triggers a Mealvana race-day plan: 3-day carb load, pre-race hydration (5–7 ml/kg, 2–4 hours pre), by-hour race fueling, and post-race recovery. Edit the event in TrainingPeaks and the plan updates.",
        },
        {
          label: "Auth & token model",
          value:
            "Standard OAuth 2.0. Access tokens expire after 1 hour (600 s) and Mealvana handles refresh automatically. Sandbox endpoint oauth.sandbox.trainingpeaks.com on beta builds, production oauth.trainingpeaks.com otherwise.",
        },
        {
          label: "Real-time updates",
          value:
            "TrainingPeaks webhooks notify Mealvana when a coach edits a planned workout. Mealvana typically recalculates Intensity Factor, duration, and carb demand in under a minute.",
        },
        {
          label: "Cost",
          value:
            "Works with any TrainingPeaks account — Basic (free) or Premium. No TrainingPeaks upgrade required for the Mealvana connection.",
        },
      ]}
      howToSteps={[
        {
          title: "Open Settings → Integrations",
          body: "In the Mealvana Endurance app, tap profile → Settings → Integrations → TrainingPeaks.",
        },
        {
          title: "Sign in via OAuth",
          body: "Mealvana opens TrainingPeaks' official OAuth page. You sign in with your TrainingPeaks credentials, not Mealvana.",
        },
        {
          title: "Approve the scopes",
          body: "Review and approve the Partner API scopes. You can revoke them any time from TrainingPeaks → Account Settings → Applications.",
        },
        {
          title: "Workouts and events populate",
          body: "Your athlete profile, next 30 days of planned workouts, and upcoming events sync within seconds. Macros start writing back as metrics immediately.",
        },
      ]}
      faqs={FAQS}
      relatedIntegrations={[
        { name: "Strava", href: "/integrations/strava" },
        { name: "Garmin", href: "/integrations/garmin" },
        { name: "Final Surge", href: "/integrations/final-surge" },
      ]}
    />
  );
}
