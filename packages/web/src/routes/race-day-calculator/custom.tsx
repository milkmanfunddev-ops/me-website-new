import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { APP_NAME, APP_URL } from "@mealvana/shared";
import { NumberInput, Segmented } from "@/components/race-calculator/form-controls";
import {
  buildGenericPlan,
  carbRec,
  classifyConditions,
  fmtClock,
  fmtMmss,
  FULL_KM,
  HALF_KM,
  paceSecPerKm,
  parsePace,
  sodiumRec,
  toC,
  toKg,
} from "@/lib/race-plan/engine";
import type {
  GenericPlan,
  PaceUnit,
  Saltiness,
  SweatRate,
  TempUnit,
  WeightUnit,
} from "@/lib/race-plan/types";
import raceCalcCss from "@/styles/race-calculator.css?url";

const PAGE_TITLE = `Generic Marathon Fueling & Hydration Calculator | ${APP_NAME}`;
const PAGE_DESCRIPTION =
  "Build a free, personalized fueling, hydration, and sodium plan for any marathon, half, or custom-distance race — from your pace, body, sweat profile, and race-day forecast. No course or aid-station data required.";
const PAGE_URL = `${APP_URL}/race-day-calculator/custom`;
const LIBRARY_URL = `${APP_URL}/race-day-calculator`;

type DistType = "full" | "half" | "custom";
type DistUnit = "mi" | "km";

interface GenericState {
  distType: DistType;
  customDist: string;
  customDistUnit: DistUnit;
  pace: string;
  paceUnit: PaceUnit;
  weight: string;
  weightUnit: WeightUnit;
  temp: string;
  tempUnit: TempUnit;
  humidity: string;
  sweatRate: SweatRate;
  saltiness: Saltiness;
  carbsPerHr: string;
}

const DEFAULT_STATE: GenericState = {
  distType: "full",
  customDist: "26.2",
  customDistUnit: "mi",
  pace: "8:30",
  paceUnit: "mi",
  weight: "155",
  weightUnit: "lb",
  temp: "55",
  tempUnit: "F",
  humidity: "60",
  sweatRate: "average",
  saltiness: "salty",
  carbsPerHr: "70",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Generic Marathon Fueling & Hydration Calculator",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  url: PAGE_URL,
  description: PAGE_DESCRIPTION,
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@type": "Organization", name: APP_NAME, url: APP_URL },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Race Day Calculator", item: LIBRARY_URL },
    { "@type": "ListItem", position: 2, name: "Generic plan", item: PAGE_URL },
  ],
};

export const Route = createFileRoute("/race-day-calculator/custom")({
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
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(jsonLd) },
      { type: "application/ld+json", children: JSON.stringify(breadcrumbLd) },
    ],
  }),
  component: GenericCalculator,
});

function distanceKmFor(state: GenericState): number {
  if (state.distType === "full") return FULL_KM;
  if (state.distType === "half") return HALF_KM;
  const v = parseFloat(state.customDist) || 0;
  return state.customDistUnit === "mi" ? v * 1.609344 : v;
}

function GenericCalculator() {
  const [state, setState] = useState<GenericState>(DEFAULT_STATE);
  const [plan, setPlan] = useState<GenericPlan | null>(null);
  const planRef = useRef<HTMLDivElement>(null);

  function update(patch: Partial<GenericState>) {
    setState((s) => ({ ...s, ...patch }));
  }

  const paceSec = parsePace(state.pace);
  const weightKg = toKg(state.weight, state.weightUnit);
  const tempC = toC(state.temp, state.tempUnit);
  const humidity = parseFloat(state.humidity);
  const conditions = classifyConditions(tempC, humidity);
  const distKm = distanceKmFor(state);
  const distMi = distKm / 1.609344;
  const spk = paceSecPerKm(paceSec, state.paceUnit);
  const finishSec = spk && distKm > 0 ? spk * distKm : null;
  const hours = finishSec ? finishSec / 3600 : 0;

  const rec = carbRec({
    type: distKm > 30 ? "full" : "half",
    finishSec,
    weightKg,
    conditions,
    saltiness: state.saltiness,
  });
  const carbsTotal = Math.round((parseFloat(state.carbsPerHr) || 0) * hours);
  const sod = sodiumRec(state.saltiness);

  function generate() {
    const built = buildGenericPlan({
      distKm,
      paceSec,
      paceUnit: state.paceUnit,
      weightKg,
      tempC,
      humidity,
      sweatRate: state.sweatRate,
      saltiness: state.saltiness,
      carbsPerHr: parseFloat(state.carbsPerHr) || 0,
    });
    setPlan(built);
    setTimeout(() => {
      planRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
    }, 100);
  }

  const canGen = !!finishSec && (parseFloat(state.carbsPerHr) || 0) > 0;

  return (
    <div className="rcm">
      <div className="page">
        {/* HERO */}
        <section className="hero">
          <div>
            <Link to="/race-day-calculator" className="back-link">
              <i className="fa-solid fa-arrow-left"></i> All races
            </Link>
            <div className="eyebrow">
              <span className="dot"></span> Generic race plan
            </div>
            <h1 className="hero-title">
              Any race. <span className="accent">Your fueling plan.</span>
            </h1>
            <p className="hero-sub">
              Don't see your race in the library yet? Build a course-agnostic fueling, hydration, and sodium plan from
              your pace, body, and race-day forecast. Carb targets follow the same science as our course-specific
              calculators — just without the aid-station map.
            </p>
          </div>
        </section>

        {/* FORM */}
        <div className="form-card">
          <div className="form-head">
            <div>
              <h2>Race setup</h2>
              <p className="lede">
                Your plan is built from your pace, body, sweat profile, and the forecast you expect on race day — then
                spread across the clock from gun to finish.
              </p>
            </div>
            <div className="num">∞</div>
          </div>

          {/* 01 — Race */}
          <div className="form-section">
            <div className="label">
              <div className="step-num">01 · Race</div>
              <h4>Distance</h4>
              <div className="hint">Pick a standard distance, or enter your own for an ultra, 10-miler, or anything in between.</div>
            </div>
            <div className="form-row">
              <Segmented
                value={state.distType}
                onChange={(v) => update({ distType: v })}
                full
                options={[
                  { value: "full", label: "Full marathon", icon: "fa-medal" },
                  { value: "half", label: "Half marathon", icon: "fa-flag-checkered" },
                  { value: "custom", label: "Custom", icon: "fa-pen-ruler" },
                ]}
              />
              {state.distType === "custom" && (
                <div className="fld">
                  <label className="fld-lbl">Race distance</label>
                  <NumberInput
                    value={state.customDist}
                    onChange={(v) => update({ customDist: v })}
                    placeholder="26.2"
                    unit={state.customDistUnit}
                    units={["mi", "km"]}
                    onUnitChange={(u) => update({ customDistUnit: u })}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 02 — You */}
          <div className="form-section">
            <div className="label">
              <div className="step-num">02 · You</div>
              <h4>Pace &amp; body</h4>
              <div className="hint">Pace and weight feed the carb recommendation below. Your data isn't stored.</div>
            </div>
            <div className="form-row">
              <div className="form-grid-2">
                <div className="fld">
                  <label className="fld-lbl">Target pace</label>
                  <NumberInput
                    value={state.pace}
                    onChange={(v) => update({ pace: v })}
                    placeholder="8:30"
                    unit={state.paceUnit}
                    units={[
                      { label: "/km", value: "km" },
                      { label: "/mi", value: "mi" },
                    ]}
                    onUnitChange={(u) => update({ paceUnit: u })}
                    inputMode="text"
                  />
                </div>
                <div className="fld">
                  <label className="fld-lbl">
                    Weight{" "}
                    <span style={{ textTransform: "none", fontWeight: 400, opacity: 0.7 }}>(optional)</span>
                  </label>
                  <NumberInput
                    value={state.weight}
                    onChange={(v) => update({ weight: v })}
                    placeholder="155"
                    unit={state.weightUnit}
                    units={["kg", "lb"]}
                    onUnitChange={(u) => update({ weightUnit: u })}
                  />
                </div>
              </div>
              {paceSec && finishSec && (
                <div className="helper">
                  <i className="fa-solid fa-stopwatch" style={{ marginRight: 6, color: "var(--me-blackberry)" }}></i>
                  At{" "}
                  <strong>
                    {fmtMmss(paceSec)} {state.paceUnit === "mi" ? "/mi" : "/km"}
                  </strong>{" "}
                  over <strong>{distMi.toFixed(1)} mi</strong>, projected finish is{" "}
                  <strong>{fmtClock(finishSec)}</strong>.
                </div>
              )}
            </div>
          </div>

          {/* 03 — Weather */}
          <div className="form-section">
            <div className="label">
              <div className="step-num">03 · Weather</div>
              <h4>Race-day conditions</h4>
              <div className="hint">Warmer, more humid conditions raise your fluid and sodium needs and lower the carb ceiling.</div>
            </div>
            <div className="form-row">
              <div className="form-grid-2">
                <div className="fld">
                  <label className="fld-lbl">Expected temperature</label>
                  <NumberInput
                    value={state.temp}
                    onChange={(v) => update({ temp: v })}
                    placeholder="55"
                    unit={state.tempUnit}
                    units={[
                      { label: "°F", value: "F" },
                      { label: "°C", value: "C" },
                    ]}
                    onUnitChange={(u) => update({ tempUnit: u })}
                  />
                </div>
                <div className="fld">
                  <label className="fld-lbl">Expected humidity</label>
                  <NumberInput value={state.humidity} onChange={(v) => update({ humidity: v })} placeholder="60" suffix="%" />
                </div>
              </div>
              <div className="helper">
                <i className="fa-solid fa-cloud-sun" style={{ marginRight: 6, color: "var(--me-orange)" }}></i>
                Estimated conditions: <strong style={{ textTransform: "capitalize" }}>{conditions}</strong>.
              </div>
            </div>
          </div>

          {/* 04 — Body */}
          <div className="form-section">
            <div className="label">
              <div className="step-num">04 · Body</div>
              <h4>Sweat profile</h4>
              <div className="hint">If you cramp, see white streaks on clothing, or eyes sting — pick a saltier setting.</div>
            </div>
            <div className="form-row">
              <div className="fld">
                <label className="fld-lbl">Sweat rate</label>
                <Segmented
                  full
                  value={state.sweatRate}
                  onChange={(v) => update({ sweatRate: v })}
                  options={[
                    { value: "light", label: "Light · ~450 ml/hr" },
                    { value: "average", label: "Average · ~650 ml/hr" },
                    { value: "heavy", label: "Heavy · ~900 ml/hr" },
                  ]}
                />
              </div>
              <div className="fld">
                <label className="fld-lbl">Sweat saltiness</label>
                <Segmented
                  full
                  value={state.saltiness}
                  onChange={(v) => update({ saltiness: v })}
                  options={[
                    { value: "normal", label: "Normal" },
                    { value: "salty", label: "Salty" },
                    { value: "verysalty", label: "Very salty" },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* 05 — Fuel */}
          <div className="form-section">
            <div className="label">
              <div className="step-num">05 · Fuel</div>
              <h4>Carbs per hour</h4>
              <div className="hint">Faster finishers and heavier runners tolerate more; cool conditions allow the high end of your range.</div>
            </div>
            <div className="form-row">
              <div className="fld">
                <label className="fld-lbl">Target carbs / hr</label>
                <NumberInput value={state.carbsPerHr} onChange={(v) => update({ carbsPerHr: v })} placeholder="70" suffix="g/h" />
              </div>
              <div className="rec-card">
                <div className="ico">
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <div className="body">
                  <div className="pri">
                    Recommended {rec.low}–{rec.high} g/h · midpoint {rec.mid} g/h
                  </div>
                  <div className="why">
                    Based on {finishSec ? fmtClock(finishSec) : "—"} finish,{" "}
                    {weightKg ? `${Math.round(weightKg)} kg runner` : "unspecified weight"}, {conditions} conditions
                    {state.saltiness !== "normal" && `, ${state.saltiness === "verysalty" ? "very salty" : "salty"} sweat`}.
                    {state.saltiness !== "normal" && (
                      <>
                        {" "}
                        Aim for{" "}
                        <strong style={{ color: "var(--me-electrolyte)" }}>
                          {sod.low}–{sod.high} mg sodium/hr
                        </strong>
                        .
                      </>
                    )}
                  </div>
                </div>
                <button
                  className={`use ${String(state.carbsPerHr) === String(rec.mid) ? "applied" : ""}`}
                  onClick={() => update({ carbsPerHr: String(rec.mid) })}
                >
                  {String(state.carbsPerHr) === String(rec.mid) ? (
                    <>
                      <i className="fa-solid fa-check" style={{ marginRight: 6 }}></i>Applied
                    </>
                  ) : (
                    "Use this"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SUMMARY BAR */}
        <div className="summary">
          <div className="stat">
            <div className="l">Estimated finish</div>
            <div className="v">{fmtClock(finishSec)}</div>
          </div>
          <div className="stat">
            <div className="l">Distance</div>
            <div className="v">
              {distMi.toFixed(1)}
              <span className="u">mi · {distKm.toFixed(1)} km</span>
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
            <div className="l">Fluid / hr</div>
            <div className="v">
              <Fluid state={state} conditions={conditions} />
            </div>
          </div>
          <div className="stat">
            <div className="l">Sodium / hr</div>
            <div className="v">
              {Math.round((sod.low + sod.high) / 2)}
              <span className="u">mg</span>
            </div>
          </div>
          <button className="gen" onClick={generate} disabled={!canGen}>
            Generate plan
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        {/* OUTPUT */}
        <div ref={planRef}>{plan && <GenericPlanOutput plan={plan} state={state} />}</div>

        {/* Trust line */}
        <div className="rl-trust">
          <i className="fa-solid fa-circle-check"></i>
          Want aid-station-precise timing?{" "}
          <Link to="/race-day-calculator" style={{ color: "var(--me-blackberry)", marginLeft: 4, textDecoration: "underline" }}>
            Pick a supported race
          </Link>
        </div>
      </div>
    </div>
  );
}

/* Small helper so the live fluid/hr reflects sweat rate + conditions. */
function Fluid({ state, conditions }: { state: GenericState; conditions: ReturnType<typeof classifyConditions> }) {
  const base = state.sweatRate === "light" ? 450 : state.sweatRate === "heavy" ? 900 : 650;
  const mult = conditions === "hot" ? 1.25 : conditions === "warm" ? 1.1 : conditions === "cool" ? 0.9 : 1.0;
  const ml = Math.round(base * mult);
  return (
    <>
      {ml}
      <span className="u">ml</span>
    </>
  );
}

function GenericPlanOutput({ plan, state }: { plan: GenericPlan; state: GenericState }) {
  const [copied, setCopied] = useState(false);

  function copyPlan() {
    const lines: string[] = [];
    lines.push(`RACE PLAN · ${plan.distMi.toFixed(1)} MI`);
    lines.push(`Pace: ${state.pace} ${state.paceUnit === "mi" ? "/mi" : "/km"} · Finish: ${fmtClock(plan.finish)}`);
    lines.push(`Conditions: ${plan.conditions} · Carbs: ${plan.carbsPerHr} g/h · Fluid: ${plan.fluidPh} ml/h · Sodium: ${plan.sodPh} mg/h`);
    lines.push("");
    lines.push(`PRE-RACE (3 hr out): ~${plan.bfCarbs}g carbs · low fiber breakfast`);
    lines.push("");
    lines.push("BY THE CLOCK (per 30 min)");
    plan.intervals.forEach((iv) => {
      lines.push(
        `  ${fmtClock(iv.endSec)} · ${iv.carbs}g carbs · ${iv.fluid}ml fluid · ${iv.sodium}mg sodium`,
      );
    });
    lines.push("");
    lines.push(`TOTAL: ${plan.carbsTotal}g carbs · ${plan.fluidTotal}ml fluid · ${plan.sodTotal}mg sodium`);
    navigator.clipboard?.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <div className="plan-wrap" id="plan-output">
      <div className="plan-head">
        <div>
          <h2>Your race plan</h2>
          <p className="sub">
            Built for {plan.conditions} conditions at {state.pace} {state.paceUnit === "mi" ? "/mi" : "/km"} pace. Carry
            roughly the targets below and spread them evenly across each segment — top up at every aid station you pass.
          </p>
          <p
            style={{
              marginTop: 10,
              maxWidth: 640,
              fontFamily: "var(--font-body)",
              fontSize: 12.5,
              lineHeight: 1.55,
              color: "var(--me-blackberry-muted)",
            }}
          >
            <strong style={{ color: "var(--me-blackberry)" }}>Drink to thirst.</strong> These fluid and sodium
            numbers are targets, not quotas — don't force fluids past comfort or drink so much you gain weight.
            Over-drinking dilutes blood sodium (hyponatremia); finishing up to ~2% lighter is normal.
          </p>
        </div>
      </div>

      <div className="aid-table">
        <table>
          <thead>
            <tr>
              <th style={{ width: 120 }}>Elapsed</th>
              <th>Carbs</th>
              <th>Fluid</th>
              <th>Sodium</th>
              <th>Cue</th>
            </tr>
          </thead>
          <tbody>
            {plan.intervals.map((iv, i) => (
              <tr key={i}>
                <td>
                  <span className="num">{fmtClock(iv.endSec)}</span>
                </td>
                <td>
                  <span className="num">{iv.carbs}</span>
                  <span className="un">g</span>
                </td>
                <td>
                  <span className="num">{iv.fluid}</span>
                  <span className="un">ml</span>
                </td>
                <td>
                  <span className="num">{iv.sodium}</span>
                  <span className="un">mg</span>
                </td>
                <td>
                  <span className="pill drink">
                    <i className="fa-solid fa-bolt"></i>
                    {iv.carbs >= 22 ? "Gel + sips" : "Drink mix"}
                  </span>
                </td>
              </tr>
            ))}
            <tr style={{ background: "var(--me-blackberry)", color: "var(--me-cream)" }}>
              <td style={{ color: "var(--me-cream)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: 1.2 }}>
                <i className="fa-solid fa-flag-checkered" style={{ color: "var(--me-orange)", marginRight: 8 }}></i>
                Total
              </td>
              <td style={{ color: "var(--me-cream)" }}>
                <span className="num" style={{ color: "var(--me-electrolyte)" }}>{plan.carbsTotal}</span>
                <span className="un" style={{ color: "color-mix(in srgb, var(--me-cream) 55%, transparent)" }}>g</span>
              </td>
              <td style={{ color: "var(--me-cream)" }}>
                <span className="num" style={{ color: "var(--me-cream)" }}>{plan.fluidTotal}</span>
                <span className="un" style={{ color: "color-mix(in srgb, var(--me-cream) 55%, transparent)" }}>ml</span>
              </td>
              <td style={{ color: "var(--me-cream)" }}>
                <span className="num" style={{ color: "var(--me-cream)" }}>{plan.sodTotal}</span>
                <span className="un" style={{ color: "color-mix(in srgb, var(--me-cream) 55%, transparent)" }}>mg</span>
              </td>
              <td style={{ color: "var(--me-cream)" }}>
                <span className="num" style={{ color: "var(--me-orange)" }}>{fmtClock(plan.finish)}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="plan-sub-grid">
        <div className="breakfast">
          <div>
            <h3>Pre-race breakfast</h3>
            <div className="when">3 hr before gun · low fiber · low fat · sip water</div>
            <div className="items">
              <div className="it">
                <span>Bagel + honey + jam</span>
                <span className="g">75 g</span>
              </div>
              <div className="it">
                <span>Banana, ripe</span>
                <span className="g">25 g</span>
              </div>
              <div className="it">
                <span>Sports drink, 16 oz</span>
                <span className="g">20 g</span>
              </div>
              <div className="it">
                <span>Coffee, black</span>
                <span className="g">0 g</span>
              </div>
            </div>
          </div>
          <div className="total">
            <div className="v">{plan.bfCarbs}</div>
            <div className="l">g carbs · target</div>
          </div>
        </div>

        <div className="share-card">
          <h3>Take it with you</h3>
          <div className="desc">
            Copy a printable summary, or open Mealvana on your phone for reminders and in-race adjustments.
          </div>
          <button className="b1" onClick={copyPlan}>
            <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`}></i>
            {copied ? "Copied to clipboard" : "Copy plan as text"}
          </button>
          {copied && (
            <div className="copied">
              <i className="fa-solid fa-check"></i> Plain-text summary copied — paste it anywhere.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
