import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { createFileRoute } from "@tanstack/react-router";
import { trackEvent } from "@/lib/analytics";
import { APP_NAME, COACH_CALL_BOOKING_URL } from "@mealvana/shared";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  ChefHat,
  ChevronDown,
  KeyRound,
  ListChecks,
  MapPin,
  MessageCircle,
  ShoppingCart,
  Utensils,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import coachCss from "@/styles/coach.css?url";

// Coach acquisition page. Keep the call as the single conversion goal.
// Claim and asset sources: .scratch/coach-page/review-2026-09-22/README.md.
export const Route = createFileRoute("/coach")({
  head: () => ({
    meta: [
      { title: `For Coaches | ${APP_NAME}` },
      {
        name: "description",
        content: `${APP_NAME} plans your athletes' fueling from the training you write, then shows you what they actually ate. Review fuel logs and adherence in your coach dashboard. Book a 30-minute demo.`,
      },
    ],
    links: [{ rel: "stylesheet", href: coachCss }],
  }),
  component: CoachPage,
});

// Every step shows a real app screenshot. No illustrations, no invented athletes.
const STEPS: Array<{
  icon: LucideIcon;
  title: string;
  body: string;
  screenshot: { src: string; alt: string };
}> = [
  {
    icon: KeyRound,
    title: "Connect your athletes",
    body: "Send each athlete a pairing code from your coach dashboard. They enter it in the app to connect with you.",
    screenshot: {
      src: "/images/coach/coach-connection.png",
      alt: "The Coach Connection screen in the Mealvana app, where an athlete enters their coach's pairing code",
    },
  },
  {
    icon: CalendarDays,
    title: "Bring in their training",
    body: "Import planned workouts from a connected training platform, or add them yourself in the coach dashboard. Each one shows up in the athlete's app.",
    screenshot: {
      src: "/images/coach/athlete-plan.png",
      alt: "A planned 12-mile run in the Mealvana app with its date, time and pace",
    },
  },
  {
    icon: Utensils,
    title: "Mealvana plans their fueling",
    body: "Each workout becomes daily targets and a plan for what to eat and drink before, during and after it. The athlete generates it in the app. You don't write it.",
    screenshot: {
      src: "/images/coach/fueling-detail.png",
      alt: "The run's fueling plan in the Mealvana app, with a pre-workout snack, a top-off and during-run targets",
    },
  },
  {
    icon: BarChart3,
    title: "See what they actually ate",
    body: "After each workout the athlete logs what they took in and how it felt. You review fuel logs and adherence in your coach dashboard.",
    screenshot: {
      src: "/images/screenshots/feedback.png",
      alt: "The Log Workout Fuel screen in the Mealvana app, with the foods consumed, a rating and how the carbs felt",
    },
  },
];

// Status as of 2026-09-23: carb loading shipped in 1.17. Meal planning,
// shopping lists and Kroger are built and on the dev backend, not yet in the
// production app (../mealvana_endurance/docs/implement_mealplanning/README.md,
// docs/kroger/README.md).
const BEYOND: Array<{ icon: LucideIcon; title: string; body: string }> = [
  {
    icon: Wheat,
    title: "Carb loading",
    body: "Race-week carb loading plans sized to the athlete's body weight and race distance, with a daily target and food picks for each meal.",
  },
  {
    icon: ChefHat,
    title: "Meal planning",
    body: "Days of meals built around the training week and fitted to the athlete's diet, so the fueling targets turn into actual food.",
  },
  {
    icon: ListChecks,
    title: "Shopping lists",
    body: "Every plan ends in a shopping list grouped by aisle, with what they already have checked off.",
  },
  {
    icon: ShoppingCart,
    title: "Kroger ordering",
    body: "One tap sends the list to a Kroger cart, matched to their local store.",
  },
];

const FAQS = [
  {
    question: "Do I need to be a dietitian?",
    answer:
      "No. Mealvana calculates fueling targets from each athlete's training using nutrition models validated by Dr. Rachel Mitchell, our nutrition science advisor. You can support their day-to-day fueling within your role as a coach. Athletes who need clinical nutrition care should work with a qualified professional.",
  },
  {
    question: "What if I don't use a training platform?",
    answer:
      "You can add workouts for an athlete directly in the coach dashboard. If you already use TrainingPeaks, Final Surge, V.O2 or Runna, athletes can connect their account to import planned workouts.",
  },
  {
    question: "What happens when I change an athlete's training?",
    answer:
      "Change the week and their daily targets move with it. For an updated workout fueling plan, the athlete uses Regenerate Plan in the app.",
  },
  {
    question: "Do I have to give my athletes a fueling plan?",
    answer:
      "No. Mealvana builds the plan from the workout, and the athlete generates it in the app. Your side is the training and the conversation. The coach dashboard shows you what they logged so you can talk about it at your next check-in.",
  },
  {
    question: "What do my athletes pay?",
    answer:
      "Athletes subscribe on their own, at $24.99 a month or $199.99 a year after a 7-day free trial. Founding member pricing runs from October 1 through November 30, 2026, at half that: $12.49 a month or $99.99 a year. It is available with or without a coach, and athletes keep the founding price while they stay subscribed.",
  },
  {
    question: "How does my coach account stay free?",
    answer:
      "Coach accounts are free to start. They stay free while five or more of your paired athletes are active on Mealvana. Active means they have used the app in the last 14 days. We can walk through the details on your coach call.",
  },
  {
    question: "What is the founding coach program?",
    answer:
      "A small first group of coaches who bring Mealvana to their athletes this fall and tell us what to fix. Founding coaches get a share of the revenue from the athletes they bring in. Ask about it on your call.",
  },
  {
    question: "What happens on the coach call?",
    answer:
      "We'll meet on Zoom for 30 minutes, walk through an athlete's fueling plan and the coach dashboard, and hear how fueling fits into your coaching. Bring your questions about your training platform, your roster or the founding coach program.",
  },
  {
    question: "Can an athlete use Mealvana without a coach?",
    answer:
      "Yes. Athletes can use Mealvana on their own. Pairing with you lets you review their training and fueling in your coach dashboard.",
  },
];

// Local layout samples only. Replace with approved quotes before publishing.
const COACH_TESTIMONIALS = import.meta.env.DEV
  ? [
      {
        quote:
          "I used to answer the same fueling questions every week. Now my athletes have daily targets built around the training I write.",
        role: "Running coach",
      },
      {
        quote:
          "I'm not a dietitian and I don't want to play one. This lets me point athletes at numbers that have a source behind them.",
        role: "Triathlon coach",
      },
      {
        quote:
          "When I move a long run, their targets for the day move too. I didn't have to change anything else.",
        role: "Marathon coach",
      },
    ]
  : [];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// Same photos the About page shows, from the Sanity teamMember documents.
const FOUNDERS = [
  {
    name: "Xuan Huang",
    role: "Founder",
    src: "https://cdn.sanity.io/images/sigrvh1t/production/c3b589f1815df3f8901b73ccd8addb1293e5c9f8-2024x2094.jpg?w=176&h=176&fit=crop&crop=focalpoint&auto=format",
  },
  {
    name: "Lee Martin",
    role: "CTO",
    src: "https://cdn.sanity.io/images/sigrvh1t/production/2eb89fa258bb8b49318f23f88e721f621bed16d0-2024x2732.jpg?w=176&h=176&fit=crop&crop=focalpoint&auto=format",
  },
];

// Fades and lifts its children in the first time they scroll into view.
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

const STEP_DURATION_S = 6;

// Steps advance on their own while the section is on screen, until the
// visitor picks one.
function StepWalkthrough() {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const playing = autoplay && inView && !reduceMotion;

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(
      () => setActive((step) => (step + 1) % STEPS.length),
      STEP_DURATION_S * 1000,
    );
    return () => clearTimeout(timer);
  }, [active, playing]);

  return (
    <div className="coach-walkthrough" ref={ref}>
      <ol className="coach-steps">
        {STEPS.map((step, index) => (
          <li key={step.title}>
            <button
              type="button"
              className="coach-step"
              data-active={index === active}
              aria-current={index === active ? "step" : undefined}
              aria-controls="coach-step-stage"
              onClick={() => {
                setActive(index);
                setAutoplay(false);
              }}
            >
              <span className="coach-step-number">0{index + 1}</span>
              <span className="coach-step-icon">
                <step.icon size={20} aria-hidden="true" />
              </span>
              <span className="coach-step-text">
                <strong>{step.title}</strong>
                <span>{step.body}</span>
              </span>
              {index === active && playing && (
                <motion.span
                  key={active}
                  className="coach-step-progress"
                  aria-hidden="true"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: STEP_DURATION_S, ease: "linear" }}
                />
              )}
            </button>
          </li>
        ))}
      </ol>
      <div className="coach-step-stage" id="coach-step-stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={STEPS[active].screenshot.src}
            className="coach-step-visual"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            <Phone
              src={STEPS[active].screenshot.src}
              alt={STEPS[active].screenshot.alt}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

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
      className="coach-button"
    >
      Book a 30-minute demo <ArrowRight size={17} aria-hidden="true" />
      <span className="sr-only">opens in a new tab</span>
    </a>
  );
}

const COACH_INTEGRATIONS = [
  { name: "TrainingPeaks", src: "/images/integrations/training-peaks.svg" },
  { name: "Final Surge", src: "/images/integrations/final-surge.svg" },
  { name: "Garmin", src: "/images/integrations/garmin.svg" },
  { name: "V.O2" },
  { name: "Runna" },
];

function IntegrationMarquee() {
  return (
    <div
      className="coach-integrations"
      aria-label="Connected training platforms"
    >
      <div className="coach-container coach-integrations-inner">
        <p>
          Keep the training tools
          <br />
          <strong>you already coach with.</strong>
        </p>
        <div className="coach-marquee">
          <div className="coach-marquee-track">
            {[false, true].map((duplicate) => (
              <ul
                className="coach-integration-group"
                key={String(duplicate)}
                aria-hidden={duplicate || undefined}
              >
                {COACH_INTEGRATIONS.map((integration) => (
                  <li key={integration.name}>
                    {integration.src ? (
                      <img
                        src={integration.src}
                        alt={integration.name}
                        width={170}
                        height={30}
                      />
                    ) : (
                      <span className="coach-integration-wordmark">
                        {integration.name}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Phone({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`coach-phone ${className}`}>
      <img
        src={src}
        alt={alt}
        width={552}
        height={1200}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
      <span className="coach-phone-speaker" aria-hidden="true" />
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="coach-feature">
      <span className="coach-feature-icon">
        <Icon size={21} aria-hidden="true" />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}

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
    for (const el of document.querySelectorAll("[data-coach-section]"))
      observer.observe(el);
    return () => observer.disconnect();
  }, []);
}

function CoachPage() {
  useSectionViews();
  return (
    <MotionConfig reducedMotion="user">
      <div className="coach-page">
        <section data-coach-section="hero" className="coach-hero">
          <div className="coach-container coach-hero-grid">
            <div className="coach-hero-copy">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT }}
              >
                Your athletes' fueling, <em>handled.</em>
              </motion.h1>
              <motion.p
                className="coach-hero-description"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: EASE_OUT }}
              >
                You handle the training.
                <br />
                Mealvana does the rest.
              </motion.p>
              <motion.div
                className="coach-hero-actions"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: EASE_OUT }}
              >
                <CoachCallButton placement="hero" />
                <a href="#how-it-works" className="coach-text-link">
                  See how it works <ArrowDown size={16} aria-hidden="true" />
                </a>
              </motion.div>
            </div>
            <div className="coach-hero-product">
              <motion.div
                className="coach-hero-phone-slot"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: EASE_OUT }}
              >
                <Phone
                  src="/images/coach/athlete-plan.png"
                  alt="Mealvana app showing a 12-mile run and its before-workout fueling targets"
                  className="coach-hero-phone-back"
                  priority
                />
              </motion.div>
              <motion.div
                className="coach-hero-phone-slot"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.5,
                  type: "spring",
                  damping: 20,
                }}
              >
                <Phone
                  src="/images/coach/fueling-detail.png"
                  alt="The same run's fueling plan, with a pre-workout snack, top-off and during-run targets"
                  className="coach-hero-phone-front"
                  priority
                />
              </motion.div>
            </div>
          </div>
          <div className="coach-hero-bottom coach-container">
            <span>
              Run <i /> Bike <i /> Swim <i /> Triathlon
            </span>
          </div>
        </section>

        <IntegrationMarquee />

        <section
          data-coach-section="credential"
          className="coach-section coach-science"
        >
          <Reveal className="coach-container coach-science-inner">
            <h2>
              You're not a dietitian.
              <br />
              <em>You don't have to be.</em>
            </h2>
            <p className="coach-lead">
              Mealvana reads each workout you write and turns it into daily
              fueling targets and a plan for what to eat and drink around it. The
              models draw on peer-reviewed research and the ISSN and ACSM position
              stands, validated by Dr. Rachel Mitchell, our nutrition science
              advisor.
            </p>
            <p className="coach-science-note">
              You see how they fuel from your coach dashboard, and you support
              them within your role as a coach.
            </p>
          </Reveal>
        </section>

        <section
          id="how-it-works"
          data-coach-section="how-it-works"
          className="coach-section coach-workflow"
        >
          <div className="coach-container">
            <Reveal className="coach-section-intro">
              <div>
                <h2>
                  Your training.
                  <br />
                  <em>Their fueling. Connected.</em>
                </h2>
              </div>
              <p className="coach-lead">
                Keep coaching where you already coach. Mealvana gives your
                athletes the next step.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <StepWalkthrough />
            </Reveal>
          </div>
        </section>

        <section
          data-coach-section="dashboard"
          className="coach-section coach-dashboard"
        >
          <div className="coach-container">
            <Reveal className="coach-section-intro">
              <div>
                <h2>
                  See what they ate.
                  <br />
                  <em>Have a better conversation.</em>
                </h2>
              </div>
              <p className="coach-lead">
                You don't have to hand anyone a diet. Bring their fuel logs into
                your next check-in and see what they completed, what they logged
                and how it compared with the plan.
              </p>
            </Reveal>
            <div className="coach-dashboard-grid">
              <Reveal className="coach-dashboard-visual">
                <Phone
                  src="/images/screenshots/feedback.png"
                  alt="A fuel log in the Mealvana app: the foods and drinks the athlete took in, a star rating and how the carbs felt"
                />
              </Reveal>
              <Reveal className="coach-dashboard-features" delay={0.15}>
                <Feature icon={BarChart3} title="Review your roster">
                  One table for the week: workouts completed, fuel logs filed,
                  adherence, last completed and next event. Click any athlete for
                  their full report.
                </Feature>
                <Feature icon={Utensils} title="Read each fuel log">
                  What they took in, how the carbs felt and any notes they left,
                  next to what the plan called for.
                </Feature>
                <Feature icon={MessageCircle} title="Keep the conversation going">
                  Message each athlete in the app, with their training and fueling
                  in front of you.
                </Feature>
              </Reveal>
            </div>
          </div>
        </section>

        <section
          data-coach-section="beyond"
          className="coach-section coach-beyond"
        >
          <div className="coach-container">
            <Reveal className="coach-section-intro">
              <div>
                <h2>
                  The rest of the week.
                  <br />
                  <em>Handled too.</em>
                </h2>
              </div>
              <p className="coach-lead">
                Fueling doesn't stop when the workout does. Carb loading is in
                the app today. Meal planning, shopping lists and Kroger ordering
                ship next.
              </p>
            </Reveal>
            <div className="coach-beyond-grid">
              <Reveal className="coach-beyond-visual">
                <Phone
                  src="/images/coach/carb-loading.png"
                  alt="A carb loading day in the Mealvana app, with a daily carbohydrate target and breakfast picks"
                  className="coach-beyond-phone-back"
                />
                <Phone
                  src="/images/coach/shopping-list.png"
                  alt="A shopping list in the Mealvana app, grouped by aisle, with a Shop with Kroger button"
                  className="coach-beyond-phone-front"
                />
              </Reveal>
              <Reveal className="coach-beyond-features" delay={0.15}>
                {BEYOND.map((feature) => (
                  <Feature
                    key={feature.title}
                    icon={feature.icon}
                    title={feature.title}
                  >
                    {feature.body}
                  </Feature>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        {/* Prices: ../mealvana_endurance/docs/revenuecat-spec-for-lee.md.
            Details (annual, trial, active definition) live in the FAQ. */}
        <section data-coach-section="cost" className="coach-section coach-cost">
          <div className="coach-container">
            <Reveal className="coach-section-intro">
              <div>
                <h2>
                  Free for coaches.
                  <br />
                  <em>Athletes pay for the app.</em>
                </h2>
              </div>
            </Reveal>
            <div className="coach-cost-grid">
              <Reveal className="coach-pricing-card">
                <span className="coach-pricing-kicker">Your coach account</span>
                <h3>Free</h3>
                <p>
                  Stays free while five or more of your athletes are active in
                  the app.
                </p>
              </Reveal>
              <Reveal
                className="coach-pricing-card coach-pricing-card-athlete"
                delay={0.15}
              >
                <span className="coach-pricing-kicker">Your athletes</span>
                <h3>
                  $12.49<small>/month</small>
                </h3>
                <p>
                  Founding member price through November 30, 2026. Half the
                  regular $24.99, locked in while they stay subscribed.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <section data-coach-section="faq" className="coach-section coach-faq">
          <Reveal className="coach-container coach-faq-grid">
            <div>
              <h2>
                Before we
                <br /> <em>talk.</em>
              </h2>
              <p className="coach-lead">
                The details that matter when you're bringing something new to your
                athletes.
              </p>
            </div>
            <div>
              {FAQS.map((faq) => (
                <details className="coach-faq-item" key={faq.question}>
                  <summary>
                    {faq.question}
                    <ChevronDown size={20} aria-hidden="true" />
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </section>

        {COACH_TESTIMONIALS.length > 0 && (
          <section
            data-coach-section="testimonials"
            className="coach-section coach-testimonials"
          >
            <div className="coach-container">
              <div className="coach-testimonials-heading">
                <h2>From the coaches.</h2>
              </div>
              <div className="coach-quote-grid">
                {COACH_TESTIMONIALS.map((testimonial) => (
                  <figure className="coach-quote" key={testimonial.role}>
                    <span className="coach-quote-mark" aria-hidden="true">
                      “
                    </span>
                    <blockquote>{testimonial.quote}</blockquote>
                    <figcaption>{testimonial.role}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        <section data-coach-section="who-we-are" className="coach-team">
          <Reveal className="coach-container coach-team-inner">
            <span className="coach-team-location">
              <MapPin size={18} aria-hidden="true" /> Birmingham, Alabama
            </span>
            <div>
              <h2>Built by athletes who have been there.</h2>
              <p>
                We're a small team of endurance athletes who struggled with our
                own race fueling. We built Mealvana to help athletes make a plan
                they can use. It's live on the App Store and Google Play.
              </p>
              <ul className="coach-founders">
                {FOUNDERS.map((founder) => (
                  <li key={founder.name}>
                    <img
                      src={founder.src}
                      alt={founder.name}
                      width={88}
                      height={88}
                      loading="lazy"
                    />
                    <span>
                      <strong>{founder.name}</strong>
                      <span>{founder.role}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        <section
          id="coach-call"
          data-coach-section="final-cta"
          className="coach-final"
        >
          <Reveal className="coach-container coach-final-inner">
            <div>
              <h2>
                Let's talk about
                <br />
                <em>your athletes.</em>
              </h2>
              <p>
                We'll walk you through an athlete's fueling plan and listen to how
                fueling actually goes wrong on your roster.
              </p>
            </div>
            <div className="coach-final-action">
              <CoachCallButton placement="final" />
            </div>
          </Reveal>
        </section>
      </div>
    </MotionConfig>
  );
}
