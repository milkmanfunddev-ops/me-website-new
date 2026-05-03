import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
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
  Zap,
  Shield,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "motion/react";

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
      "Plans are generated using AI-powered linear programming optimization combined with ACSM formulas and 50+ peer-reviewed studies. We factor in your body metrics, training load, race goals, food preferences, and dietary restrictions to create a fueling strategy tailored to each session.",
  },
  {
    question: "Can I use Mealvana Endurance offline?",
    answer:
      "Yes. The app is built with an offline-first architecture so your meal plans, fueling guides, and training logs are always available — even on remote trails or during race day without cell service.",
  },
  {
    question: "What's included in the free plan?",
    answer:
      "The free plan includes basic fueling calculations and a limited number of meal plans, so you can try Mealvana Endurance before upgrading. Premium unlocks AI-powered plans, gut training protocols, carb loading calculators, and race-day nutrition timelines.",
  },
  {
    question: "Does it integrate with my training platform?",
    answer:
      "We support integrations with Strava, Garmin, Final Surge, and TrainingPeaks. Sync your workouts so nutrition recommendations automatically adjust to your actual training load.",
  },
  {
    question: "How does gut training work?",
    answer:
      "Gut training progressively increases your carbohydrate intake during long sessions so your GI system adapts to race-day fueling demands. Mealvana Endurance provides weekly targets and tracks your tolerance over time.",
  },
];

/* ------------------------------------------------------------------ */
/*  Testimonial data                                                  */
/* ------------------------------------------------------------------ */

const TESTIMONIALS = [
  {
    quote:
      "I bonked at mile 18 of every marathon until Mealvana Endurance dialed in my fueling. Ran a 12-minute PR at Chicago with zero GI issues.",
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
      "As a cycling coach, I recommend Mealvana Endurance to every athlete I work with. The science-backed approach is exactly what this space needed.",
    name: "Emily Vasquez",
    sport: "Cycling Coach",
  },
];

/* ------------------------------------------------------------------ */
/*  Integration logos                                                  */
/* ------------------------------------------------------------------ */

const PARTNER_LOGOS = [
  { name: "Strava", src: "/images/integrations/strava.svg", height: "h-7" },
  { name: "Garmin", src: "/images/integrations/garmin.svg", height: "h-7" },
  {
    name: "Final Surge",
    src: "/images/integrations/final-surge.svg",
    height: "h-6",
  },
  {
    name: "TrainingPeaks",
    src: "/images/integrations/training-peaks.svg",
    height: "h-6",
  },
];

/* ------------------------------------------------------------------ */
/*  App screenshots for phone mockups                                  */
/* ------------------------------------------------------------------ */

const APP_SCREENSHOTS = [
  { src: "/images/screenshots/by-hour.png", label: "Hour-by-Hour Targets" },
  { src: "/images/screenshots/feedback.png", label: "Plan Feedback" },
  { src: "/images/screenshots/transparency.png", label: "How We Calculate" },
  { src: "/images/screenshots/new-activity.png", label: "Create Activity Plan" },
  { src: "/images/screenshots/event-detail.png", label: "Race Day Planner" },
];

/* ------------------------------------------------------------------ */
/*  Animated counter hook                                              */
/* ------------------------------------------------------------------ */

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return { count, ref };
}

/* ------------------------------------------------------------------ */
/*  Reusable components                                                */
/* ------------------------------------------------------------------ */

function PhoneMockup({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  return (
    <div
      className={`relative mx-auto w-[280px] rounded-[3rem] border-[8px] border-blackberry bg-blackberry p-1 shadow-2xl shadow-blackberry/40 ${className}`}
    >
      {/* Notch */}
      <div className="absolute left-1/2 top-0 z-10 h-7 w-[120px] -translate-x-1/2 rounded-b-2xl bg-blackberry" />
      {/* Screen */}
      <div className="overflow-hidden rounded-[2.4rem] bg-blackberry">
        <img
          src={src}
          alt="App screenshot"
          className="h-auto w-full"
          loading="lazy"
        />
      </div>
      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 h-1 w-[100px] -translate-x-1/2 rounded-full bg-cream/20" />
    </div>
  );
}

function FaqItem({
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="border-b border-blackberry/10"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-6 text-left transition-colors hover:text-orange"
      >
        <span className="font-heading text-lg font-bold text-blackberry pr-4">
          {question}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
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
            <div className="pb-6 text-muted-foreground leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page component                                               */
/* ------------------------------------------------------------------ */

function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* ============================================================ */}
      {/*  1. HERO — Dark, immersive, with phone mockup + athlete      */}
      {/* ============================================================ */}
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-blackberry">
        {/* Gradient mesh background */}
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-orange/10 blur-[120px]" />
          <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-electrolyte/8 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[500px] rounded-full bg-dragonfruit/6 blur-[80px]" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-8 lg:px-8 lg:py-32">
          {/* Left — Copy */}
          <div className="relative z-10 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cream/10 bg-cream/5 px-4 py-1.5 backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5 text-orange" />
                <span className="text-xs font-medium tracking-wide text-cream/70">
                  Built on sports science
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-5xl font-black leading-[1.05] tracking-tight text-cream sm:text-6xl lg:text-7xl"
            >
              Fuel Smarter.
              <br />
              <span className="bg-gradient-to-r from-orange via-orange-light to-electrolyte bg-clip-text text-transparent">
                Race Stronger.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-lg leading-relaxed text-cream/60 sm:text-xl"
            >
              {APP_DESCRIPTION}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <a
                href={APP_STORE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center rounded-full bg-orange px-8 py-4 font-heading text-sm font-bold text-white shadow-lg shadow-orange/25 transition-all hover:bg-orange-light hover:shadow-orange/40 hover:-translate-y-0.5"
              >
                Download Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-cream/20 bg-cream/5 px-8 py-4 font-heading text-sm font-bold text-cream backdrop-blur-sm transition-all hover:bg-cream/10 hover:border-cream/30"
              >
                See How It Works
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-10 flex items-center gap-6 text-cream/40"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="text-xs">50+ Studies</span>
              </div>
              <div className="h-3 w-px bg-cream/20" />
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span className="text-xs">Offline-First</span>
              </div>
              <div className="h-3 w-px bg-cream/20" />
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="text-xs">AI-Powered</span>
              </div>
            </motion.div>
          </div>

          {/* Right — Phone mockup + athlete image */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Athlete image behind phone */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute -bottom-16 -right-16 h-[420px] w-[420px] sm:h-[480px] sm:w-[480px] lg:h-[550px] lg:w-[550px]"
            >
              <img
                src="/images/athletes/woman-running.png"
                alt="Athlete running"
                className="h-full w-full object-contain opacity-25 lg:opacity-35"
              />
            </motion.div>

            {/* Primary phone */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, type: "spring", damping: 20 }}
              className="relative z-10"
            >
              <PhoneMockup src="/images/screenshots/new-activity.png" />
              {/* Floating UI card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -left-20 top-1/3 hidden rounded-2xl border border-cream/10 bg-blackberry-light/80 px-5 py-3 shadow-xl backdrop-blur-md lg:block"
              >
                <p className="text-xs font-bold text-electrolyte">Pre-Run Fuel</p>
                <p className="mt-0.5 text-lg font-heading font-black text-cream">
                  62g <span className="text-xs font-normal text-cream/50">carbs</span>
                </p>
              </motion.div>
            </motion.div>

            {/* Secondary phone (offset) */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 20 }}
              animate={{ opacity: 0.6, x: 0, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6 }}
              className="absolute -right-4 bottom-8 z-0 hidden lg:block"
              style={{ transform: "scale(0.72) rotate(6deg)" }}
            >
              <PhoneMockup src="/images/screenshots/activity.png" />
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream to-transparent" />
      </section>

      {/* ============================================================ */}
      {/*  2. PARTNER LOGOS — Infinite scroll marquee                   */}
      {/* ============================================================ */}
      <section className="relative bg-cream py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/60"
          >
            Integrates with your favorite platforms
          </motion.p>

          {/* Marquee */}
          <div className="relative mt-8 overflow-hidden">
            {/* Fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-cream to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-cream to-transparent" />

            <div className="flex animate-marquee items-center gap-16">
              {[...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS].map(
                (logo, i) => (
                  <div
                    key={`${logo.name}-${i}`}
                    className="flex shrink-0 items-center opacity-40 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                  >
                    <img
                      src={logo.src}
                      alt={logo.name}
                      className={`${logo.height} w-auto object-contain`}
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  3. SPORTS SHOWCASE — Runner, Biker, Swimmer                 */}
      {/* ============================================================ */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight text-blackberry sm:text-4xl lg:text-5xl">
              Built for Every Endurance Sport
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Whether you run, ride, or swim — get nutrition plans designed for
              your sport's unique demands.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              {
                sport: "Running",
                image: "/images/athletes/runner.png",
                desc: "Marathon, half-marathon, ultra, and trail running nutrition",
              },
              {
                sport: "Cycling",
                image: "/images/athletes/biker.png",
                desc: "Road, gravel, and mountain bike fueling strategies",
              },
              {
                sport: "Swimming",
                image: "/images/athletes/swimmer.png",
                desc: "Open water and pool training nutrition plans",
              },
            ].map((item, i) => (
              <motion.div
                key={item.sport}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="group relative overflow-hidden rounded-3xl bg-blackberry p-8 pb-0"
              >
                <h3 className="relative z-10 font-heading text-2xl font-bold text-cream">
                  {item.sport}
                </h3>
                <p className="relative z-10 mt-2 text-sm text-cream/50">
                  {item.desc}
                </p>
                <div className="mt-6 flex justify-center">
                  <img
                    src={item.image}
                    alt={item.sport}
                    className="h-64 w-64 object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  4. HOW IT WORKS — Visual 3-step process                     */}
      {/* ============================================================ */}
      <section id="how-it-works" className="bg-cream-dark py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight text-blackberry sm:text-4xl lg:text-5xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Three simple steps from training to race day.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Train",
                desc: "Track your workouts. We calculate your fueling needs.",
                icon: Activity,
              },
              {
                step: "02",
                title: "Fuel",
                desc: "Get a nutrition plan tailored to your body, goals, and schedule.",
                icon: Zap,
              },
              {
                step: "03",
                title: "Race",
                desc: "Execute on race day with confidence using a science-backed fueling timeline.",
                icon: Target,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="group relative rounded-3xl border border-border bg-cream p-10 text-center transition-all duration-300 hover:border-orange/20 hover:shadow-xl hover:shadow-orange/5"
              >
                {/* Big step number watermark */}
                <span className="absolute right-4 top-4 font-heading text-8xl font-black text-blackberry/[0.04]">
                  {item.step}
                </span>

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange/10 transition-colors group-hover:bg-orange/20">
                  <item.icon className="h-8 w-8 text-orange" />
                </div>
                <h3 className="mt-6 font-heading text-2xl font-bold text-blackberry">
                  {item.title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  5. FEATURES BENTO GRID                                      */}
      {/* ============================================================ */}
      <section id="features" className="bg-cream py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight text-blackberry sm:text-4xl lg:text-5xl">
              Everything You Need to Fuel Right
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              12 purpose-built features designed by sport scientists and
              endurance athletes.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => {
              const Icon = iconMap[feature.icon];
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: (i % 3) * 0.1, duration: 0.5 }}
                  className="group rounded-2xl border border-border bg-cream-dark p-8 transition-all duration-300 hover:border-orange/20 hover:shadow-lg hover:shadow-orange/5 hover:-translate-y-1"
                >
                  {Icon && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange/15 to-orange/5 transition-colors group-hover:from-orange/25 group-hover:to-orange/10">
                      <Icon className="h-6 w-6 text-orange" />
                    </div>
                  )}
                  <h3 className="mt-5 font-heading text-lg font-bold text-blackberry">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  6. APP SCREENSHOTS — Perspective phone showcase              */}
      {/* ============================================================ */}
      <section className="overflow-hidden bg-blackberry py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight text-cream sm:text-4xl lg:text-5xl">
              See It In Action
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-cream/50">
              Clean, focused design built for athletes on the move.
            </p>
          </motion.div>

          {/* Scrollable phone carousel */}
          <div className="relative mt-16">
            {/* Fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-blackberry to-transparent sm:w-24" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-blackberry to-transparent sm:w-24" />

            <div className="flex gap-8 overflow-x-auto pb-8 pt-4 snap-x snap-mandatory scrollbar-hide px-8 sm:px-16 sm:justify-center">
              {APP_SCREENSHOTS.map((screenshot, i) => (
                <motion.div
                  key={screenshot.label}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="shrink-0 snap-center"
                >
                  <PhoneMockup
                    src={screenshot.src}
                    className="transition-transform duration-300 hover:scale-105"
                  />
                  <p className="mt-4 text-center text-sm font-medium text-cream/40">
                    {screenshot.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  7. SCIENCE SECTION — With visual interest                    */}
      {/* ============================================================ */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left — Visual */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative mx-auto aspect-square w-full max-w-lg">
                {/* Decorative rings */}
                <div className="absolute inset-0 rounded-full border border-orange/10" />
                <div className="absolute inset-8 rounded-full border border-orange/10" />
                <div className="absolute inset-16 rounded-full border border-orange/10" />

                {/* Center content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-3xl bg-gradient-to-br from-blackberry to-blackberry-light p-12 shadow-2xl shadow-blackberry/30">
                    <FlaskConical className="h-20 w-20 text-orange" />
                    <p className="mt-4 text-center font-heading text-5xl font-black text-cream">
                      50+
                    </p>
                    <p className="text-center text-sm text-cream/60">
                      Peer-Reviewed Studies
                    </p>
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute left-4 top-1/4 rounded-xl bg-cream-dark border border-border px-4 py-2 shadow-lg"
                >
                  <p className="text-xs font-bold text-blackberry">ACSM Formulas</p>
                </motion.div>
                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute right-4 top-1/3 rounded-xl bg-cream-dark border border-border px-4 py-2 shadow-lg"
                >
                  <p className="text-xs font-bold text-blackberry">PubMed Indexed</p>
                </motion.div>
                <motion.div
                  animate={{ y: [-3, 7, -3] }}
                  transition={{ duration: 4.5, repeat: Infinity }}
                  className="absolute bottom-1/4 left-8 rounded-xl bg-cream-dark border border-border px-4 py-2 shadow-lg"
                >
                  <p className="text-xs font-bold text-blackberry">Evidence-Based</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Right — Copy */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="font-heading text-3xl font-bold tracking-tight text-blackberry sm:text-4xl lg:text-5xl">
                Built on Real Science
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Every recommendation is grounded in exercise science — not
                guesswork, fads, or anecdote.
              </p>
              <ul className="mt-8 space-y-5">
                {[
                  "ACSM carbohydrate and hydration formulas",
                  "PubMed-indexed sport nutrition research",
                  "Evidence-based personalization algorithms",
                  "Progressive gut training protocols",
                ].map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange/10">
                      <div className="h-2 w-2 rounded-full bg-orange" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-10">
                <Link
                  to="/blog/$slug"
                  params={{ slug: "how-mealvana-calculates-race-fueling" }}
                  className="group inline-flex items-center gap-2 font-heading text-sm font-bold text-orange transition-colors hover:text-orange-dark"
                >
                  Read the Science
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  8. STATS SECTION — Animated counters                        */}
      {/* ============================================================ */}
      <section className="bg-cream-dark py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { value: 12, suffix: "", label: "Features" },
              { value: 50, suffix: "+", label: "Studies" },
              { value: 5, suffix: "", label: "Sports" },
              { value: 1000, suffix: "+", label: "Foods" },
            ].map((stat) => (
              <StatItem key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  9. TESTIMONIALS — With visual polish                        */}
      {/* ============================================================ */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight text-blackberry sm:text-4xl lg:text-5xl">
              Athletes Trust Mealvana
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Hear from endurance athletes who fueled their best performances.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="group relative flex h-full flex-col rounded-3xl border border-border bg-cream-dark p-8 transition-all duration-300 hover:border-orange/20 hover:shadow-lg"
              >
                {/* Quote mark */}
                <span className="absolute -top-3 left-6 font-heading text-6xl text-orange/20">
                  &ldquo;
                </span>
                <blockquote className="relative z-10 mt-4 flex-1 text-lg leading-relaxed text-foreground">
                  {t.quote}
                </blockquote>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  {/* Avatar placeholder */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange to-orange-dark font-heading text-sm font-bold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-blackberry">
                      {t.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{t.sport}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  10. DOWNLOAD CTA — Dark, immersive                          */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden bg-blackberry py-24 sm:py-32">
        {/* Gradient bg */}
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-orange/8 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight text-cream sm:text-4xl lg:text-5xl">
              Start Fueling Smarter Today
            </h2>
            <p className="mt-4 text-lg text-cream/50">
              Download {APP_NAME} and take the guesswork out of race-day
              nutrition.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={APP_STORE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
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
                className="transition-transform hover:scale-105"
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
                className="text-sm text-cream/40 underline underline-offset-4 transition-colors hover:text-cream/70"
              >
                Or try the web version
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  11. FAQ ACCORDION                                           */}
      {/* ============================================================ */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight text-blackberry sm:text-4xl lg:text-5xl">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="mt-12">
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem
                key={item.question}
                question={item.question}
                answer={item.answer}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  12. NEWSLETTER                                              */}
      {/* ============================================================ */}
      <section className="bg-cream-dark py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight text-blackberry sm:text-4xl lg:text-5xl">
              Get Fueling Tips Delivered Weekly
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
              Science-backed nutrition insights for endurance athletes. No spam,
              unsubscribe anytime.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-10"
          >
            <NewsletterForm source="homepage" className="mx-auto max-w-md" />
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  13. PRE-FOOTER CTA                                          */}
      {/* ============================================================ */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="font-heading text-2xl font-bold text-blackberry sm:text-3xl">
              Ready to fuel your next PR?
            </p>
            <div className="mt-8">
              <a
                href={APP_STORE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center rounded-full bg-orange px-8 py-4 font-heading text-sm font-bold text-white shadow-lg shadow-orange/25 transition-all hover:bg-orange-light hover:shadow-orange/40 hover:-translate-y-0.5"
              >
                Download Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat counter component                                             */
/* ------------------------------------------------------------------ */

function StatItem({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const { count, ref } = useCountUp(value);
  return (
    <div className="text-center">
      <span
        ref={ref}
        className="font-heading text-5xl font-black text-blackberry sm:text-6xl lg:text-7xl"
      >
        {count}
        {suffix}
      </span>
      <p className="mt-2 text-lg text-muted-foreground">{label}</p>
    </div>
  );
}
