import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ViewportFade } from "@/components/viewport-fade";
import { NewsletterForm } from "@/components/newsletter-form";
import {
  APP_NAME,
  APP_DESCRIPTION,
  FEATURES,
  APP_STORE_LINK,
  PLAY_STORE_LINK,
  WEB_APP_URL,
} from "@mealvana/shared";
import {
  Brain,
  FlaskConical,
  Heart,
  Clock,
  TrendingUp,
  Target,
  Calendar,
  WifiOff,
  Activity,
  Calculator,
  Database,
  CloudSun,
  ChevronDown,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

/* ------------------------------------------------------------------ */
/*  Icon map                                                          */
/* ------------------------------------------------------------------ */

const iconMap: Record<string, LucideIcon> = {
  Brain,
  FlaskConical,
  Heart,
  Clock,
  TrendingUp,
  Target,
  Calendar,
  WifiOff,
  Activity,
  Calculator,
  Database,
  CloudSun,
};

/* ------------------------------------------------------------------ */
/*  FAQ data                                                          */
/* ------------------------------------------------------------------ */

const FAQ_ITEMS = [
  {
    question: "What sports does Mealvana Endurance support?",
    answer:
      "Mealvana Endurance supports running, cycling, triathlon, swimming, and general endurance training. Nutrition plans adapt to each sport's unique energy demands and fueling windows.",
  },
  {
    question: "How are the nutrition plans personalized?",
    answer:
      "Plans are generated using AI-powered linear programming optimization combined with ACSM formulas and 50+ peer-reviewed studies. We factor in your body metrics, training load, race goals, food preferences, and dietary restrictions.",
  },
  {
    question: "Can I use Mealvana Endurance offline?",
    answer:
      "Yes. The app is built with an offline-first architecture so your meal plans, fueling guides, and training logs are always available — even on remote trails or during race day without cell service.",
  },
  {
    question: "Is there a free version?",
    answer:
      "Mealvana Endurance offers a free tier that includes basic fueling calculations and a limited number of meal plans. Premium unlocks AI-powered plans, gut training protocols, carb loading calculators, and race-day nutrition timelines.",
  },
  {
    question: "Does it integrate with my training platform?",
    answer:
      "We support integrations with Strava, Garmin, Final Surge, and TrainingPeaks. Sync your workouts so nutrition recommendations automatically adjust to your actual training load.",
  },
  {
    question: "How does gut training work?",
    answer:
      "Gut training progressively increases your carbohydrate intake during long sessions so your GI system adapts to race-day fueling demands. Mealvana provides weekly targets and tracks your tolerance over time.",
  },
];

/* ------------------------------------------------------------------ */
/*  Testimonial data                                                  */
/* ------------------------------------------------------------------ */

const TESTIMONIALS = [
  {
    quote:
      "I bonked at mile 18 of every marathon until Mealvana dialed in my fueling. Ran a 12-minute PR at Chicago with zero GI issues.",
    name: "Sarah Chen",
    sport: "Marathon Runner",
  },
  {
    quote:
      "The carb loading calculator took the guesswork out of my Ironman prep. I've never felt stronger on the run leg.",
    name: "James Okafor",
    sport: "Triathlete",
  },
  {
    quote:
      "As a cycling coach, I recommend Mealvana to every athlete I work with. The science-backed approach is exactly what this space needed.",
    name: "Emily Vasquez",
    sport: "Cycling Coach",
  },
];

/* ------------------------------------------------------------------ */
/*  Partner logos                                                      */
/* ------------------------------------------------------------------ */

const PARTNERS = ["Strava", "Garmin", "Final Surge", "TrainingPeaks"];

/* ------------------------------------------------------------------ */
/*  Reusable small components                                         */
/* ------------------------------------------------------------------ */

function OrangePillLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-full bg-orange px-8 py-3.5 font-heading text-sm font-bold text-white transition-colors hover:bg-orange-dark"
      >
        {children}
      </a>
    );
  }
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-orange px-8 py-3.5 font-heading text-sm font-bold text-white transition-colors hover:bg-orange-dark"
    >
      {children}
    </a>
  );
}

function OutlinedPillLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full border-2 border-blackberry px-8 py-3.5 font-heading text-sm font-bold text-blackberry transition-colors hover:bg-blackberry hover:text-cream"
    >
      {children}
    </a>
  );
}

function SectionHeading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`font-heading text-3xl font-bold tracking-tight text-blackberry sm:text-4xl lg:text-5xl ${className}`}
    >
      {children}
    </h2>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-heading text-lg font-bold text-blackberry pr-4">
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-5 text-muted-foreground leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page component                                               */
/* ------------------------------------------------------------------ */

function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* ---------------------------------------------------------- */}
      {/*  1. Hero Section                                           */}
      {/* ---------------------------------------------------------- */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center bg-cream">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
          <ViewportFade>
            <div className="max-w-xl">
              <h1 className="font-heading text-5xl font-black leading-[1.1] tracking-tight text-blackberry sm:text-6xl lg:text-7xl">
                Fuel Smarter.
                <br />
                Race Stronger.
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
                {APP_DESCRIPTION}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <OrangePillLink href={APP_STORE_LINK} external>
                  Download the App
                </OrangePillLink>
                <OutlinedPillLink href="#features">
                  See How It Works
                </OutlinedPillLink>
              </div>
            </div>
          </ViewportFade>

          <ViewportFade delay={0.15}>
            <div className="flex justify-center lg:justify-end">
              <div className="aspect-[9/16] w-72 rounded-3xl bg-blackberry-light shadow-2xl" />
            </div>
          </ViewportFade>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/*  2. Social Proof / Integration Partners Bar                */}
      {/* ---------------------------------------------------------- */}
      <section className="border-y border-border bg-cream-dark">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <ViewportFade>
            <p className="text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Works with your favorite platforms
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-10 sm:gap-16">
              {PARTNERS.map((name) => (
                <div
                  key={name}
                  className="flex h-10 w-28 items-center justify-center rounded-lg bg-muted grayscale transition duration-300 hover:grayscale-0"
                >
                  <span className="text-sm font-medium text-muted-foreground">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </ViewportFade>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/*  3. Bento Features Grid                                    */}
      {/* ---------------------------------------------------------- */}
      <section id="features" className="bg-cream py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ViewportFade>
            <div className="text-center">
              <SectionHeading>Everything You Need to Fuel Right</SectionHeading>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                12 purpose-built features designed by sport scientists and
                endurance athletes.
              </p>
            </div>
          </ViewportFade>

          <div className="mt-16 space-y-4">
            {Array.from({ length: 6 }, (_, rowIndex) => {
              const isEven = rowIndex % 2 === 0;
              const first = FEATURES[rowIndex * 2];
              const second = FEATURES[rowIndex * 2 + 1];
              if (!first || !second) return null;

              return (
                <div
                  key={rowIndex}
                  className={`grid gap-4 ${isEven ? "grid-cols-1 md:grid-cols-[2fr_1fr]" : "grid-cols-1 md:grid-cols-[1fr_2fr]"}`}
                >
                  <ViewportFade delay={0}>
                    <FeatureCard feature={first} />
                  </ViewportFade>
                  <ViewportFade delay={0.1}>
                    <FeatureCard feature={second} />
                  </ViewportFade>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/*  4. Three-Step Process                                     */}
      {/* ---------------------------------------------------------- */}
      <section className="bg-cream-dark py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ViewportFade>
            <div className="text-center">
              <SectionHeading>How It Works</SectionHeading>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                Three simple steps from training to race day.
              </p>
            </div>
          </ViewportFade>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Train",
                desc: "Log your workouts and let the app learn your training patterns and energy demands.",
              },
              {
                step: "02",
                title: "Fuel",
                desc: "Get personalized nutrition plans optimized for your body, goals, and schedule.",
              },
              {
                step: "03",
                title: "Race",
                desc: "Execute on race day with confidence using a science-backed fueling timeline.",
              },
            ].map((item, i) => (
              <ViewportFade key={item.step} delay={i * 0.1}>
                <div className="rounded-2xl border border-border bg-cream p-8 text-center">
                  <span className="font-heading text-6xl font-black text-orange">
                    {item.step}
                  </span>
                  <h3 className="mt-4 font-heading text-2xl font-bold text-blackberry">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </ViewportFade>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/*  5. Science Section                                        */}
      {/* ---------------------------------------------------------- */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
            <ViewportFade>
              <div>
                <SectionHeading>
                  Built on 50+ Peer-Reviewed Studies
                </SectionHeading>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  Every recommendation is grounded in exercise science — not
                  guesswork, fads, or anecdote.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "ACSM carbohydrate and hydration formulas",
                    "PubMed-indexed sport nutrition research",
                    "Evidence-based personalization algorithms",
                    "Progressive gut training protocols",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <Link
                    to="/blog/how-mealvana-calculates-fueling"
                    className="inline-flex items-center gap-2 font-heading text-sm font-bold text-orange transition-colors hover:text-orange-dark"
                  >
                    Read the Science
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </ViewportFade>

            <ViewportFade delay={0.15}>
              <div className="flex justify-center">
                <div className="aspect-square w-full max-w-md rounded-3xl bg-cream-dark border border-border flex items-center justify-center">
                  <FlaskConical className="h-24 w-24 text-blackberry-light" />
                </div>
              </div>
            </ViewportFade>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/*  6. Testimonials                                           */}
      {/* ---------------------------------------------------------- */}
      <section className="bg-cream-dark py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ViewportFade>
            <div className="text-center">
              <SectionHeading>Athletes Trust Mealvana</SectionHeading>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                Hear from endurance athletes who fueled their best performances.
              </p>
            </div>
          </ViewportFade>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <ViewportFade key={t.name} delay={i * 0.1}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-cream p-8">
                  <blockquote className="flex-1 text-lg leading-relaxed text-foreground">
                    "{t.quote}"
                  </blockquote>
                  <div className="mt-6 border-t border-border pt-4">
                    <p className="font-heading font-bold text-blackberry">
                      {t.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{t.sport}</p>
                  </div>
                </div>
              </ViewportFade>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/*  7. Stats Section                                          */}
      {/* ---------------------------------------------------------- */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ViewportFade>
            <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
              {[
                { value: "12", label: "Features" },
                { value: "50+", label: "Studies" },
                { value: "5", label: "Sports" },
                { value: "1", label: "App" },
              ].map((stat) => (
                <div key={stat.label}>
                  <span className="font-heading text-5xl font-black text-blackberry sm:text-6xl lg:text-7xl">
                    {stat.value}
                  </span>
                  <p className="mt-2 text-lg text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </ViewportFade>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/*  8. App Screenshots                                        */}
      {/* ---------------------------------------------------------- */}
      <section className="bg-cream-dark py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ViewportFade>
            <div className="text-center">
              <SectionHeading>See It In Action</SectionHeading>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                Clean, focused design built for athletes on the move.
              </p>
            </div>
          </ViewportFade>

          <div className="mt-16 flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {[1, 2, 3, 4].map((n) => (
              <ViewportFade key={n} delay={n * 0.08}>
                <div className="aspect-[9/16] w-56 shrink-0 snap-center rounded-3xl bg-blackberry-light shadow-lg sm:w-64" />
              </ViewportFade>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/*  9. Download CTA                                           */}
      {/* ---------------------------------------------------------- */}
      <section className="bg-blackberry py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ViewportFade>
            <div className="text-center">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-cream sm:text-4xl lg:text-5xl">
                Start Fueling Smarter Today
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-text-dark-secondary">
                Download {APP_NAME} and take the guesswork out of race-day
                nutrition.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={APP_STORE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/appstore.png"
                    alt="Download on the App Store"
                    className="h-14"
                  />
                </a>
                <a
                  href={PLAY_STORE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/playstore.png"
                    alt="Get it on Google Play"
                    className="h-14"
                  />
                </a>
              </div>
              <p className="mt-6">
                <a
                  href={WEB_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-dark-secondary underline underline-offset-4 transition-colors hover:text-cream"
                >
                  Or try the web version
                </a>
              </p>
            </div>
          </ViewportFade>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/*  10. FAQ Accordion                                         */}
      {/* ---------------------------------------------------------- */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ViewportFade>
            <div className="text-center">
              <SectionHeading>Frequently Asked Questions</SectionHeading>
            </div>
          </ViewportFade>

          <ViewportFade delay={0.1}>
            <div className="mt-12">
              {FAQ_ITEMS.map((item) => (
                <FaqItem
                  key={item.question}
                  question={item.question}
                  answer={item.answer}
                />
              ))}
            </div>
          </ViewportFade>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/*  11. Newsletter Section                                    */}
      {/* ---------------------------------------------------------- */}
      <section className="bg-cream-dark py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <ViewportFade>
            <div className="text-center">
              <SectionHeading>Get Fueling Tips Delivered Weekly</SectionHeading>
              <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
                Science-backed nutrition insights for endurance athletes.
                No spam, unsubscribe anytime.
              </p>
            </div>
          </ViewportFade>

          <ViewportFade delay={0.1}>
            <div className="mt-10">
              <NewsletterForm source="homepage" className="mx-auto max-w-md" />
            </div>
          </ViewportFade>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/*  12. Pre-footer CTA                                        */}
      {/* ---------------------------------------------------------- */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ViewportFade>
            <div className="text-center">
              <p className="font-heading text-2xl font-bold text-blackberry sm:text-3xl">
                Ready to fuel your next PR?
              </p>
              <div className="mt-8">
                <OrangePillLink href={APP_STORE_LINK} external>
                  Download Now
                </OrangePillLink>
              </div>
            </div>
          </ViewportFade>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature card component                                            */
/* ------------------------------------------------------------------ */

function FeatureCard({
  feature,
}: {
  feature: (typeof FEATURES)[number];
}) {
  const Icon = iconMap[feature.icon];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-cream-dark p-8 transition-colors hover:border-orange/30">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange/10">
          <Icon className="h-6 w-6 text-orange" />
        </div>
      )}
      <h3 className="mt-5 font-heading text-xl font-bold text-blackberry">
        {feature.title}
      </h3>
      <p className="mt-2 flex-1 leading-relaxed text-muted-foreground">
        {feature.description}
      </p>
    </div>
  );
}
