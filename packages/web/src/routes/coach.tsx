import { useEffect, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ViewportFade } from "@/components/viewport-fade";
import { trackEvent } from "@/lib/analytics";
import { APP_NAME, COACH_CALL_BOOKING_URL } from "@mealvana/shared";
import {
  ArrowRight,
  CalendarDays,
  FlaskConical,
  KeyRound,
  LayoutDashboard,
  Utensils,
  type LucideIcon,
} from "lucide-react";

/* Coach acquisition page. Outreach emails to coaches link here, and the one
 * thing it asks for is a coach call. Each claim was checked against the
 * Endurance app's code and docs. Don't add user counts, testimonials, coach
 * names, statistics, ratings or the rev-share percentage. */

export const Route = createFileRoute("/coach")({
  head: () => ({
    meta: [
      { title: `For Coaches | ${APP_NAME}` },
      {
        name: "description",
        content:
          `${APP_NAME} turns the training you write into a day-by-day fueling plan for each athlete. Coach accounts are free to start. Book a 30-minute demo.`,
      },
    ],
  }),
  component: CoachPage,
});

const STEPS: Array<{ icon: LucideIcon; title: string; body: string }> = [
  {
    icon: KeyRound,
    title: "Share your coach code",
    body: "Each athlete enters your coach code in the app. That pairs their account with yours.",
  },
  {
    icon: CalendarDays,
    title: "Their planned workouts come in",
    body: "Mealvana imports planned workouts from TrainingPeaks, Final Surge and V.O2. Change the week and their daily targets move with it. If you don't use a training platform, add workouts for an athlete from the coach dashboard.",
  },
  {
    icon: Utensils,
    title: "Each athlete gets a fueling plan",
    body: "The app builds a day-by-day fueling plan from each athlete's training.",
  },
  {
    icon: LayoutDashboard,
    title: "You see how they fuel",
    body: "The coach dashboard, on the web, shows each athlete's fuel logs and adherence.",
  },
];

/* Testimonial placeholder. Hidden from visitors while this list is empty. Add
 * approved coach quotes here and the section renders before the final call to
 * action. */
const COACH_TESTIMONIALS: Array<{ quote: string; name: string; role: string }> =
  [];

/* The /coach funnel ends at this click. The booking itself happens on
 * Google's site, where Mixpanel can't see it. */
function CoachCallButton({ placement }: { placement: "hero" | "final" }) {
  return (
    <a
      href={COACH_CALL_BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackEvent(
          "coach_cta_clicked",
          { button: placement },
          { send_immediately: true },
        )
      }
      className="inline-flex items-center justify-center gap-2 rounded-full bg-orange px-8 py-4 font-heading text-sm font-bold text-white shadow-lg shadow-orange/25 transition-colors hover:bg-orange-dark"
    >
      Book a 30-minute demo
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

function SectionHeading({
  children,
  onDark = false,
}: {
  children: ReactNode;
  onDark?: boolean;
}) {
  return (
    <h2
      className={`font-heading text-3xl font-bold tracking-tight sm:text-4xl ${onDark ? "text-cream" : "text-blackberry"}`}
    >
      {children}
    </h2>
  );
}

/* `coach_section_viewed` once per section per page view, when the section
 * reaches the middle of the screen. A line rather than a visible fraction,
 * because on a phone some sections are taller than the screen. */
function useSectionViews() {
  useEffect(() => {
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const section = (entry.target as HTMLElement).dataset.coachSection;
          if (!entry.isIntersecting || !section || seen.has(section)) continue;
          seen.add(section);
          observer.unobserve(entry.target);
          trackEvent("coach_section_viewed", { section });
        }
      },
      { rootMargin: "0px 0px -50% 0px" },
    );
    for (const el of document.querySelectorAll("[data-coach-section]")) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
}

function CoachPage() {
  useSectionViews();

  return (
    <div className="bg-cream">
      <section
        data-coach-section="hero"
        className="relative overflow-hidden bg-blackberry"
      >
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-orange/10 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-electrolyte/8 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-cream/60">
            For run and triathlon coaches
          </p>
          <h1 className="mt-5 font-heading text-4xl font-black leading-[1.05] tracking-tight text-cream sm:text-6xl">
            Your athletes' fueling, handled.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/70 sm:text-xl">
            {APP_NAME} turns the training you write into a day-by-day fueling
            plan for each athlete.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <CoachCallButton placement="hero" />
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-cream/20 bg-cream/5 px-8 py-4 font-heading text-sm font-bold text-cream transition-colors hover:border-cream/30 hover:bg-cream/10"
            >
              See how it works
            </a>
          </div>
          <p className="mt-5 text-sm text-cream/50">
            A 30-minute coach call on Zoom. We walk you through a fueling plan.
          </p>
        </div>
      </section>

      <section
        data-coach-section="credential"
        className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <ViewportFade>
          <div className="flex items-start gap-5">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange/10 sm:flex">
              <FlaskConical className="h-6 w-6 text-orange" aria-hidden="true" />
            </div>
            <div>
              <SectionHeading>The nutrition science is in the software</SectionHeading>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                The app does the nutrition work, so you don't have to step
                outside your role as a coach.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Its models draw on more than 60 peer-reviewed studies and the
                ISSN and ACSM position stands. We reviewed them with a PhD
                nutrition scientist. The app shows a source next to each number.
              </p>
            </div>
          </div>
        </ViewportFade>
      </section>

      <section
        id="how-it-works"
        data-coach-section="how-it-works"
        className="scroll-mt-20 bg-card py-20"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ViewportFade>
            <SectionHeading>How it works</SectionHeading>
          </ViewportFade>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <ViewportFade delay={i * 0.05} className="h-full">
                  <div className="h-full rounded-2xl border border-border bg-background p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blackberry font-heading text-sm font-bold text-cream">
                        {i + 1}
                      </span>
                      <step.icon className="h-5 w-5 text-orange" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 font-heading text-lg font-bold text-blackberry">
                      {step.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </ViewportFade>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        data-coach-section="cost"
        className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <ViewportFade>
          <SectionHeading>What it costs</SectionHeading>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Coach accounts are free to start. They stay free while five or more
            of your athletes are on Mealvana.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Starting in October, your athletes get member pricing through your
            coach code.
          </p>
        </ViewportFade>
      </section>

      <section
        data-coach-section="founding-coach"
        className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8"
      >
        <ViewportFade>
          <div className="rounded-3xl border border-orange/20 bg-orange/5 p-8 sm:p-10">
            <SectionHeading>Founding coaches</SectionHeading>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Founding coaches get revenue share and promotion from us. Ask
              about the program on the call.
            </p>
          </div>
        </ViewportFade>
      </section>

      <section
        data-coach-section="who-we-are"
        className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8"
      >
        <ViewportFade>
          <SectionHeading>Who we are</SectionHeading>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            We're a team of endurance athletes in Birmingham, Alabama.
            {APP_NAME} is live on the App Store and Google Play.
          </p>
        </ViewportFade>
      </section>

      {COACH_TESTIMONIALS.length > 0 && (
        <section
          data-coach-section="testimonials"
          className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {COACH_TESTIMONIALS.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <blockquote className="leading-relaxed text-foreground">
                  "{testimonial.quote}"
                </blockquote>
                <figcaption className="mt-4 text-sm text-muted-foreground">
                  {testimonial.name}, {testimonial.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section
        data-coach-section="final-cta"
        className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8"
      >
        <ViewportFade>
          <div className="rounded-3xl bg-blackberry p-8 text-center sm:p-12">
            <SectionHeading onDark>Book a coach call</SectionHeading>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-cream/70">
              30 minutes on Zoom. We'll walk you through a fueling plan and
              answer your questions.
            </p>
            <div className="mt-8">
              <CoachCallButton placement="final" />
            </div>
          </div>
        </ViewportFade>
      </section>
    </div>
  );
}
