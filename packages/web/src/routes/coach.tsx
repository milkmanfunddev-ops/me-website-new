import { useEffect, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { trackEvent } from "@/lib/analytics";
import { APP_NAME, COACH_CALL_BOOKING_URL } from "@mealvana/shared";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  FlaskConical,
  KeyRound,
  MapPin,
  MessageCircle,
  Monitor,
  Target,
  Utensils,
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
        content: `${APP_NAME} turns your athletes' training into daily fueling targets and practical fueling plans. Review fuel logs and adherence in your coach dashboard. Book a 30-minute demo.`,
      },
    ],
    links: [{ rel: "stylesheet", href: coachCss }],
  }),
  component: CoachPage,
});

const STEPS: Array<{ icon: LucideIcon; title: string; body: string }> = [
  {
    icon: KeyRound,
    title: "Connect your athletes",
    body: "Send each athlete a pairing code from your coach dashboard. They enter it in the app to connect with you.",
  },
  {
    icon: CalendarDays,
    title: "Bring in their training",
    body: "Import planned workouts from a connected training platform, or add workouts yourself in the coach dashboard.",
  },
  {
    icon: Utensils,
    title: "Give them a fueling plan",
    body: "Each athlete gets daily targets and can generate a plan for what to eat and drink around their workout.",
  },
  {
    icon: BarChart3,
    title: "See how they fuel",
    body: "Review completed workouts, fuel logs and adherence from your coach dashboard on the web.",
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
    question: "What do my athletes pay?",
    answer:
      "Athletes subscribe separately. Founding member pricing runs from October 1 through November 30, 2026, at half the regular price. It is available with or without a coach, and athletes keep that price while they stay subscribed.",
  },
  {
    question: "How does my coach account stay free?",
    answer:
      "Coach accounts are free to start. They stay free while five or more of your paired athletes are active on Mealvana. Active means they have used the app in the last 14 days. We can walk through the details on your coach call.",
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

// An editorial illustration of shipped report fields, not a screenshot or real
// athlete data. Rows use generic athlete identifiers.
function ReportIllustration() {
  return (
    <figure className="coach-report-figure">
      <div className="coach-report-window">
        <div className="coach-window-bar">
          <span className="coach-window-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>Mealvana / Coach dashboard</span>
          <Monitor size={14} aria-hidden="true" />
        </div>
        <div className="coach-report-body">
          <div className="coach-report-heading">
            <div>
              <h3>Athlete reports</h3>
            </div>
            <span className="coach-report-period">This week</span>
          </div>
          <div className="coach-report-table-wrap">
            <table className="coach-report-table">
              <caption className="sr-only">
                Illustrative report with fictional athlete data
              </caption>
              <thead>
                <tr>
                  <th scope="col">Athlete</th>
                  <th scope="col">Completed</th>
                  <th scope="col">Fuel logs</th>
                  <th scope="col">Adherence</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: "01",
                    completed: "4/5",
                    logs: "4/4",
                    adherence: "92%",
                    width: "92%",
                  },
                  {
                    id: "02",
                    completed: "3/4",
                    logs: "2/3",
                    adherence: "76%",
                    width: "76%",
                  },
                  {
                    id: "03",
                    completed: "5/5",
                    logs: "5/5",
                    adherence: "88%",
                    width: "88%",
                  },
                ].map((athlete) => (
                  <tr key={athlete.id}>
                    <th scope="row">
                      <span className="coach-athlete-avatar">{athlete.id}</span>
                      <span>Athlete {athlete.id}</span>
                    </th>
                    <td>{athlete.completed}</td>
                    <td>{athlete.logs}</td>
                    <td>
                      <span>{athlete.adherence}</span>
                      <span
                        className="coach-adherence-track"
                        aria-hidden="true"
                      >
                        <i style={{ width: athlete.width }} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="coach-report-foot">
            <CalendarDays size={16} aria-hidden="true" />
            <span>Weekly and custom date ranges</span>
            <ArrowRight size={16} aria-hidden="true" />
          </div>
        </div>
      </div>
    </figure>
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
    <div className="coach-page">
      <section data-coach-section="hero" className="coach-hero">
        <div className="coach-container coach-hero-grid">
          <div className="coach-hero-copy">
            <h1>
              Your athletes' fueling, <em>handled.</em>
            </h1>
            <p className="coach-hero-description">
              You write the training.
              <br />
              Give them a plan to fuel it.
            </p>
            <div className="coach-hero-actions">
              <CoachCallButton placement="hero" />
              <a href="#how-it-works" className="coach-text-link">
                See how it works <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="coach-hero-product">
            <div className="coach-orbit coach-orbit-one" aria-hidden="true" />
            <div className="coach-orbit coach-orbit-two" aria-hidden="true" />
            <Phone
              src="/images/coach/athlete-plan.png"
              alt="Mealvana app showing a 12-mile run and its before-workout fueling targets"
              className="coach-hero-phone-back"
              priority
            />
            <Phone
              src="/images/coach/fueling-detail.png"
              alt="The same run's fueling plan, with a pre-workout snack, top-off and during-run targets"
              className="coach-hero-phone-front"
              priority
            />
            <div className="coach-product-note">
              <span>
                <Utensils size={20} aria-hidden="true" />
              </span>
              <div>
                <strong>A plan for the whole workout</strong>
                <p>Before. During. Recovery.</p>
              </div>
            </div>
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
        <div className="coach-container coach-science-grid">
          <div>
            <h2>
              You're not a dietitian.
              <br />
              <em>You don't have to be.</em>
            </h2>
            <p className="coach-lead">
              You write the training. Mealvana reads each workout and turns it
              into daily fueling targets and a plan for what to eat and drink
              before, during and after it.
            </p>
            <p className="coach-science-note">
              You see how they fuel from your coach dashboard, and you support
              them within your role as a coach.
            </p>
          </div>
          <div className="coach-science-details">
            <Feature icon={FlaskConical} title="Grounded in nutrition research">
              Our models draw on peer-reviewed research and the ISSN and ACSM
              position stands.
            </Feature>
            <Feature icon={Check} title="Validated by experts">
              Our fueling models are reviewed by nutrition scientists, including
              Dr. Rachel Mitchell, our nutrition science advisor, who holds a
              PhD in nutrition science.
            </Feature>
            <Feature icon={BookOpen} title="The reasoning is there to read">
              Athletes can explore the research behind their targets in the app.
            </Feature>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        data-coach-section="how-it-works"
        className="coach-section coach-workflow"
      >
        <div className="coach-container">
          <div className="coach-section-intro">
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
          </div>
          <ol className="coach-steps">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <div className="coach-step-top">
                  <span>0{index + 1}</span>
                  <step.icon size={24} aria-hidden="true" />
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="coach-athlete-feature">
            <div className="coach-athlete-visual">
              <Phone
                src="/images/coach/fueling-detail.png"
                alt="A Mealvana fueling plan with food suggestions, timing, carbohydrate, fluid and sodium targets"
              />
              <div className="coach-plan-caption">
                <Utensils size={18} aria-hidden="true" />
                <span>
                  What to eat.
                  <br />
                  <strong>When to eat it.</strong>
                </span>
              </div>
            </div>
            <div className="coach-athlete-copy">
              <h2>
                Make fueling part
                <br />
                of the training.
              </h2>
              <p className="coach-lead">
                A target is useful. Knowing what to eat and when makes it
                practical.
              </p>
              <p>
                Mealvana helps athletes turn their workout into a fueling plan,
                with food suggestions and targets for before, during and after
                the session.
              </p>
              <ul className="coach-check-list">
                <li>
                  <Check aria-hidden="true" /> Daily targets that move with the
                  training week
                </li>
                <li>
                  <Check aria-hidden="true" /> Workout plans with food and drink
                  suggestions
                </li>
                <li>
                  <Check aria-hidden="true" /> Carbohydrate, fluid and sodium
                  targets
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        data-coach-section="dashboard"
        className="coach-section coach-dashboard"
      >
        <div className="coach-container">
          <div className="coach-section-intro">
            <div>
              <h2>
                See the fueling.
                <br />
                <em>Have a better conversation.</em>
              </h2>
            </div>
            <p className="coach-lead">
              Bring their fuel logs into your next check-in. See what they
              completed, what they logged and how it compares with the plan.
            </p>
          </div>
          <div className="coach-dashboard-grid">
            <ReportIllustration />
            <div className="coach-dashboard-features">
              <Feature icon={BarChart3} title="Review your roster">
                See completed workouts, fuel logs, adherence and the next event.
                Open an athlete's report for more detail.
              </Feature>
              <Feature icon={Target} title="Set targets for the athlete">
                Adjust pre, during and post-workout fueling targets from your
                dashboard.
              </Feature>
              <Feature icon={MessageCircle} title="Keep the conversation going">
                Message each athlete in the app, with their training and fueling
                available to review.
              </Feature>
            </div>
          </div>
        </div>
      </section>

      <section data-coach-section="cost" className="coach-section coach-cost">
        <div className="coach-container coach-cost-grid">
          <div>
            <h2>
              Free to start.
              <br />
              <em>Built for your roster.</em>
            </h2>
            <p className="coach-lead">
              Coach accounts stay free while five or more of your athletes are
              active on Mealvana.
            </p>
            <ul className="coach-check-list">
              <li>
                <Check aria-hidden="true" /> A web dashboard for your whole
                roster
              </li>
              <li>
                <Check aria-hidden="true" /> Pairing codes to connect each
                athlete
              </li>
              <li>
                <Check aria-hidden="true" /> Fueling reports, target controls
                and in-app messaging
              </li>
            </ul>
          </div>
          <div className="coach-pricing-card">
            <h3>Founding member pricing</h3>
            <p>
              Athletes who subscribe between October 1 and November 30, 2026 get
              half the regular price.
            </p>
            <div className="coach-pricing-foot">
              <Check size={19} aria-hidden="true" />
              <strong>They keep it while they stay subscribed.</strong>
            </div>
            <div className="coach-pricing-foot">
              <Check size={19} aria-hidden="true" />
              <span>
                Athletes subscribe on their own, so there's nothing for you to
                pay on their behalf.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section data-coach-section="founding-coach" className="coach-founding">
        <div className="coach-container coach-founding-inner">
          <div className="coach-founding-mark" aria-hidden="true">
            <img src="/appicon.png" alt="" width={72} height={72} />
          </div>
          <div>
            <h2>Help shape what comes next.</h2>
            <p>
              We're bringing together a small group of coaches to help us
              improve Mealvana with their athletes. The founding coach program
              includes revenue share. Bring your feedback and ask about the
              program on your call.
            </p>
          </div>
          <a href="#coach-call" className="coach-text-link">
            Let's talk <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section data-coach-section="faq" className="coach-section coach-faq">
        <div className="coach-container coach-faq-grid">
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
        </div>
      </section>

      {COACH_TESTIMONIALS.length > 0 && (
        <section
          data-coach-section="testimonials"
          className="coach-section coach-testimonials"
        >
          <div className="coach-container">
            <div className="coach-testimonials-heading">
              <h2>From the coaches.</h2>
              <p>Sample quotes for layout review</p>
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
        <div className="coach-container coach-team-inner">
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
          </div>
        </div>
      </section>

      <section
        id="coach-call"
        data-coach-section="final-cta"
        className="coach-final"
      >
        <div className="coach-container coach-final-inner">
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
        </div>
      </section>
    </div>
  );
}
