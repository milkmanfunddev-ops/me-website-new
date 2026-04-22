import { createFileRoute } from "@tanstack/react-router";
import { IntegrationPage } from "@/components/integration-page";
import { faqPageJsonLd } from "@/lib/structured-data";

const PARTNER = "Final Surge";

const FAQS = [
  {
    question: "Does Mealvana Endurance integrate with Final Surge?",
    answer:
      "Yes. Mealvana Endurance connects to Final Surge's coaching platform and pulls your next 14 days of upcoming workouts in real time. The app converts each planned run, ride, or swim into a per-session fueling plan — pre-workout carbs, during-session g/hr, post-workout recovery — without any manual entry.",
  },
  {
    question: "What Final Surge data does Mealvana use?",
    answer:
      "Mealvana reads upcoming workouts from Final Surge via the Partner API (log.finalsurge.com/API/v1/UpcomingWorkouts), pulling workout type, planned duration, planned distance, and structured target metrics. Running, Cycling, Swimming, and Triathlon (including T1/T2 transition) workout types all come through.",
  },
  {
    question: "How fast does the Final Surge plan generation run?",
    answer:
      "Mealvana generates a complete 14-day fueling plan from Final Surge workouts in 15–20 seconds. The app fetches up to 5 chunks of workouts in parallel (Final Surge's concurrent-request ceiling) and runs each through Mealvana's carb, protein, sodium, and hydration calculations in a single pass.",
  },
  {
    question: "Why connect Final Surge instead of just logging workouts manually?",
    answer:
      "Because the moment your coach adjusts a planned workout in Final Surge — bumping a Sunday long run to 20 miles, or swapping a tempo for a threshold ride — Mealvana sees it and rebuilds the fueling plan without you touching anything. Manual entry drifts; a Final Surge sync stays aligned with what your coach actually prescribed.",
  },
  {
    question: "How do I connect Final Surge to Mealvana Endurance?",
    answer:
      "Open the Mealvana Endurance app → Settings → Integrations → Final Surge → Connect. Sign in with your Final Surge credentials, approve the Partner API permission, and within 15–20 seconds your next two weeks of workouts appear with a fueling plan attached to each.",
  },
  {
    question: "Which sports does the Final Surge integration support?",
    answer:
      "Running, Cycling, Swimming, Triathlon Bike, Triathlon Run, and T1/T2 transitions. If you log two or more workouts in the same discipline, Mealvana auto-detects that as your active sport and tunes carb and sodium defaults accordingly.",
  },
  {
    question: "Does Mealvana deduplicate workouts across Final Surge and Garmin?",
    answer:
      "Yes. Mealvana uses a client-side check plus a server-side UNIQUE constraint on (user_id, provider_workout_id) so that a single long run showing up in both Final Surge and Garmin Connect doesn't count twice toward training load — and therefore doesn't inflate your fueling targets.",
  },
  {
    question: "Can coaches use the Final Surge integration to manage athlete fueling?",
    answer:
      "Yes. Final Surge is built for coaches, and Mealvana's Coach Mode is designed for certified coaches (RRCA, USAT, ACE, NASM, ACSM) managing 10–50 athletes on $100–$300/month packages. Coaches see fueling adherence on every Final Surge workout — whether the athlete hit their carb and sodium targets — alongside the workout data they already review.",
  },
  {
    question: "What happens on race day for a Final Surge-planned race?",
    answer:
      "Any event or race marked in Final Surge triggers a Mealvana race-day plan: a 3-day carb load in the taper, pre-race hydration sized to 5–7 ml/kg body weight 2–4 hours pre-start, a by-hour race-day fueling timeline, and a post-race recovery protocol timed against your 18–36 hour glycogen replacement window.",
  },
];

export const Route = createFileRoute("/integrations/final-surge")({
  head: () => ({
    meta: [
      {
        title:
          "Final Surge Integration | Mealvana Endurance — Fueling Plans From Coached Workouts",
      },
      {
        name: "description",
        content:
          "Connect Final Surge to Mealvana Endurance. 14-day fueling plans from your coach's planned workouts — carbs, sodium, and hydration, automatically.",
      },
      {
        property: "og:title",
        content: "Final Surge Integration | Mealvana Endurance",
      },
      {
        property: "og:description",
        content:
          "Final Surge coached workouts become automated per-session fueling plans inside Mealvana Endurance.",
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
  component: FinalSurgeIntegrationPage,
});

function FinalSurgeIntegrationPage() {
  return (
    <IntegrationPage
      partnerName={PARTNER}
      partnerLogo="/images/integrations/final-surge.svg"
      logoHeightClass="h-6"
      tagline="Your coach's plan, fueled by Mealvana."
      intro="Mealvana Endurance connects to Final Surge's Partner API and turns your coached workouts into a 14-day fueling plan. Every run, ride, and swim your coach prescribes gets pre-workout carbs (1 g/kg), during-session g/hr scaled to Intensity Factor, and a post-session recovery window — all rebuilt automatically when your coach updates the plan."
      syncRows={[
        {
          label: "What comes in from Final Surge",
          value:
            "Up to 14 days of upcoming workouts (via GET log.finalsurge.com/API/v1/UpcomingWorkouts), including type, planned duration, planned distance, and structured target metrics. NumDays 1–7, NumWorkouts 1–21 per batch.",
        },
        {
          label: "Plan generation speed",
          value:
            "15–20 seconds for a full 14-day plan, using up to 5 parallel API requests (Final Surge's concurrent ceiling).",
        },
        {
          label: "Sport types supported",
          value:
            "Running, Cycling, Swimming, Triathlon Bike, Triathlon Run, T1/T2 transitions. Mealvana auto-detects your active sport after two or more logged workouts in the same discipline.",
        },
        {
          label: "Deduplication",
          value:
            "Client-side check plus a server-side UNIQUE(user_id, provider_workout_id) constraint means workouts showing up in both Final Surge and Garmin never double-count.",
        },
        {
          label: "Coach Mode",
          value:
            "Certified coaches (RRCA, USAT, ACE, NASM, ACSM) see Final Surge workout compliance and Mealvana fueling adherence side-by-side for each athlete.",
        },
        {
          label: "Cost",
          value:
            "Works with any Final Surge account. No Final Surge upgrade required for the Mealvana integration.",
        },
      ]}
      howToSteps={[
        {
          title: "Open Settings → Integrations",
          body: "In Mealvana Endurance, tap profile → Settings → Integrations → Final Surge.",
        },
        {
          title: "Sign in with Final Surge",
          body: "Enter your Final Surge credentials on Final Surge's own sign-in page. Mealvana never sees your password.",
        },
        {
          title: "Approve the Partner API access",
          body: "Grant Mealvana read access to upcoming workouts. You can revoke any time from Final Surge account settings.",
        },
        {
          title: "Fueling plan populates",
          body: "Within 15–20 seconds, the next 14 days of workouts appear in Mealvana with a per-session fueling plan already generated.",
        },
      ]}
      faqs={FAQS}
      relatedIntegrations={[
        { name: "Strava", href: "/integrations/strava" },
        { name: "Garmin", href: "/integrations/garmin" },
        { name: "TrainingPeaks", href: "/integrations/training-peaks" },
      ]}
    />
  );
}
