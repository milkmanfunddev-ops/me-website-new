import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { APP_NAME, APP_URL } from "@mealvana/shared";
import { AppStoreButtons } from "@/components/app-store-buttons";
import { CourseMap } from "@/components/race-calculator/course-map";
import { RaceForm } from "@/components/race-calculator/race-form";
import { PlanOutput } from "@/components/race-calculator/plan-output";
import {
  buildPlan,
  classifyConditions,
  finishTime,
  fluidPerHour,
  fmtClock,
  parsePace,
  sodiumRec,
  toC,
  toKg,
} from "@/lib/race-plan/engine";
import { AID_STATIONS_FULL, AID_STATIONS_HALF } from "@/lib/race-plan/course";
import type { CalculatorState, Plan } from "@/lib/race-plan/types";
import raceCalcCss from "@/styles/race-calculator.css?url";

const PAGE_TITLE = `Rocket City Marathon 2026 Race Day Calculator | ${APP_NAME}`;
const PAGE_DESCRIPTION =
  "Build a free, personalized fueling and hydration race plan for the 2026 Rocket City Marathon — tailored to the Huntsville course, your pace, and December race-morning conditions, snapped to every aid station.";
const PAGE_URL = `${APP_URL}/race-day-calculator`;

const DEFAULT_STATE: CalculatorState = {
  type: "full",
  pace: "8:30",
  paceUnit: "mi",
  weight: "155",
  weightUnit: "lb",
  temp: "40",
  tempUnit: "F",
  humidity: "80",
  sweatRate: "average",
  saltiness: "salty",
  carbsPerHr: "80",
  hydration: "aid",
  bottleCount: 2,
  bottleVol: "20",
  bottleVolUnit: "oz",
};

// Apply ?type / ?pace / ?unit / ?carbs / ?hydration overrides from the URL.
function queryOverrides(): Partial<CalculatorState> {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const out: Partial<CalculatorState> = {};
  const type = p.get("type");
  if (type === "full" || type === "half") out.type = type;
  if (p.get("pace")) out.pace = p.get("pace")!;
  const unit = p.get("unit");
  if (unit === "mi" || unit === "km") out.paceUnit = unit;
  if (p.get("carbs")) out.carbsPerHr = p.get("carbs")!;
  const hydration = p.get("hydration");
  if (hydration === "aid" || hydration === "own" || hydration === "hybrid")
    out.hydration = hydration;
  return out;
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Rocket City Marathon 2026 Race Day Calculator",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  url: PAGE_URL,
  description: PAGE_DESCRIPTION,
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@type": "Organization", name: APP_NAME, url: APP_URL },
};

export const Route = createFileRoute("/race-day-calculator")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: PAGE_URL },
      { rel: "stylesheet", href: raceCalcCss },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/css/all.min.css",
      },
      {
        rel: "stylesheet",
        href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
        integrity: "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=",
        crossOrigin: "",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(jsonLd),
      },
    ],
  }),
  component: RaceDayCalculator,
});

function RaceDayCalculator() {
  const [state, setState] = useState<CalculatorState>(DEFAULT_STATE);
  const [plan, setPlan] = useState<Plan | null>(null);
  const planRef = useRef<HTMLDivElement>(null);

  // Apply URL overrides after mount (keeps SSR markup === first client render).
  useEffect(() => {
    const overrides = queryOverrides();
    if (Object.keys(overrides).length) setState((s) => ({ ...s, ...overrides }));
  }, []);

  function update(patch: Partial<CalculatorState>) {
    setState((s) => ({ ...s, ...patch }));
  }

  // Live computed summary
  const paceSec = parsePace(state.pace);
  const weightKg = toKg(state.weight, state.weightUnit);
  const tempC = toC(state.temp, state.tempUnit);
  const humidity = parseFloat(state.humidity);
  const conditions = classifyConditions(tempC, humidity);
  const finishSec = finishTime(state.type, paceSec, state.paceUnit);
  const hours = finishSec ? finishSec / 3600 : 0;
  const fluidPh = fluidPerHour(state.sweatRate, conditions);
  const fluidTotal = Math.round(fluidPh * hours);
  const fluidTotalOz = Math.round(fluidTotal / 29.5735);
  const carbsTotal = Math.round((parseFloat(state.carbsPerHr) || 0) * hours);
  const sod = sodiumRec(state.saltiness);
  const sodPh = Math.round((sod.low + sod.high) / 2);
  const sodTotal = Math.round(sodPh * hours);
  const distKm = state.type === "half" ? 21.1 : 42.2;

  function generate() {
    const built = buildPlan(
      {
        type: state.type,
        paceSec,
        paceUnit: state.paceUnit,
        weightKg,
        tempC,
        humidity,
        sweatRate: state.sweatRate,
        saltiness: state.saltiness,
        carbsPerHr: parseFloat(state.carbsPerHr) || 0,
        hydration: state.hydration,
        bottleCount: state.bottleCount,
        bottleVolMl:
          state.bottleVolUnit === "oz"
            ? (parseFloat(state.bottleVol) || 0) * 29.5735
            : parseFloat(state.bottleVol) || 0,
      },
      state.type === "half" ? AID_STATIONS_HALF : AID_STATIONS_FULL,
    );
    setPlan(built);
    setTimeout(() => {
      planRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
    }, 100);
  }

  const canGen = !!paceSec && (parseFloat(state.carbsPerHr) || 0) > 0;

  return (
    <div className="rcm">
      <div className="page">
        {/* HERO */}
        <section className="hero">
          <div>
            <div className="eyebrow">
              <span className="dot"></span> Race plan calculator
            </div>
            <h1 className="hero-title">
              Rocket City Marathon 2026 <span className="accent">race plan,</span> snapped to the course.
            </h1>
            <p className="hero-sub">
              Build a fueling and hydration plan tailored to the Huntsville course, your pace, and December
              race-morning conditions — aid stations and all.
            </p>
            <div className="hero-meta">
              <span className="dot"></span>
              Rocket City Marathon · Huntsville, AL · Sunday, December 13, 2026
            </div>
          </div>
          <AppStoreButtons variant="compact" className="flex flex-wrap items-center gap-3" />
        </section>

        {/* COURSE MAP */}
        <section id="calculator">
          <CourseMap raceType={state.type} paceUnit={state.paceUnit} hydration={state.hydration} />
        </section>

        {/* FORM */}
        <RaceForm state={state} set={update} />

        {/* SUMMARY BAR */}
        <div className="summary">
          <div className="stat">
            <div className="l">Estimated finish</div>
            <div className="v">{fmtClock(finishSec)}</div>
          </div>
          <div className="stat">
            <div className="l">Distance</div>
            <div className="v">
              {state.type === "half" ? "13.1" : "26.2"}
              <span className="u">mi · {distKm} km</span>
            </div>
          </div>
          <div className="stat">
            <div className="l">Total carbs</div>
            <div className="v">
              {carbsTotal || "—"}
              <span className="u">g</span>
            </div>
          </div>
          <div className="stat">
            <div className="l">Fluid target</div>
            <div className="v">
              {fluidTotal || "—"}
              <span className="u">ml · {fluidTotalOz}oz</span>
            </div>
          </div>
          <div className="stat">
            <div className="l">Sodium target</div>
            <div className="v">
              {sodTotal || "—"}
              <span className="u">mg</span>
            </div>
          </div>
          <button className="gen" onClick={generate} disabled={!canGen}>
            Generate plan
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        {/* PLAN OUTPUT */}
        <div ref={planRef}>{plan && <PlanOutput plan={plan} state={state} />}</div>

        {/* MARKETING */}
        <section className="mkt-wrap" id="mkt">
          <div className="mkt-card">
            <div>
              <h2>
                Race day starts the <span className="acc">week before.</span>
              </h2>
              <p>
                Your calculator plan covers gun-to-tape fueling. The app handles everything around it — daily
                training-day nutrition, carb-loading for race week, and a personalized race-morning breakfast timed to
                your start. Download it free on the App Store or Google Play.
              </p>
              <div className="ctas">
                <AppStoreButtons variant="compact" className="flex flex-wrap items-center gap-3" />
              </div>
            </div>
            <div className="mkt-tiles">
              <div className="mkt-tile">
                <div className="ico">
                  <i className="fa-solid fa-utensils"></i>
                </div>
                <div className="t">Daily fueling synced to your training load</div>
              </div>
              <div className="mkt-tile">
                <div className="ico">
                  <i className="fa-solid fa-wheat-awn"></i>
                </div>
                <div className="t">Race-week carb loading, scaled to your weight</div>
              </div>
              <div className="mkt-tile">
                <div className="ico">
                  <i className="fa-solid fa-mug-hot"></i>
                </div>
                <div className="t">Race-morning breakfast plan, timed to your gun</div>
              </div>
              <div className="mkt-tile">
                <div className="ico">
                  <i className="fa-solid fa-cloud-bolt"></i>
                </div>
                <div className="t">In-race adjustments if conditions change</div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust line (carried over from the prototype footer) */}
        <div
          style={{
            textAlign: "center",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--me-blackberry-muted)",
            paddingTop: 24,
          }}
        >
          <i className="fa-solid fa-circle-check" style={{ color: "var(--me-electrolyte)", marginRight: 6 }}></i>
          Course data verified with Rocket City Marathon 2026 organizers
        </div>
      </div>
    </div>
  );
}
