/* Validation harness: do the calculator's recommendations match what an actual
 * marathoner would do? Runs the real engine across a matrix of realistic runner
 * profiles, checks the recommended per-hour rates against published
 * sports-science ranges, and measures the gap between the headline totals
 * (rate x hours) and what the aid-station plan actually delivers.
 *
 * Research ranges used as expectations:
 *  - Carbs:   60-90 g/hr for races >2.5h, up to ~110 g/hr for fast/elite
 *             (Jeukendrup/ACSM; MAVR shows ~92 g/hr for a ~3h52 marathon).
 *  - Fluid:   400-800 mL/hr typical, up to ~1000 in heat (elites ~550 to thirst).
 *  - Sodium:  300-700 mg/hr normal, 700-1500 for salty / very-salty sweaters.
 *  - Pre-race carbs: 1-4 g/kg, 1-4h out (>=100 g typical).
 */

import { describe, expect, it } from "vitest";
import {
  buildPlan,
  carbRec,
  classifyConditions,
  finishTime,
  fluidPerHour,
  parsePace,
  sodiumRec,
  toC,
  toKg,
} from "@/lib/race-plan/engine";
import { AID_STATIONS_FULL, AID_STATIONS_HALF } from "@/lib/race-plan/course";
import type {
  BuildPlanInputs,
  RaceType,
  Saltiness,
  SweatRate,
} from "@/lib/race-plan/types";

interface Scenario {
  label: string;
  type: RaceType;
  pace: string; // mm:ss per mile
  weightLb: number;
  tempF: number;
  humidity: number;
  sweatRate: SweatRate;
  saltiness: Saltiness;
}

const SCENARIOS: Scenario[] = [
  { label: "Elite 2:30 full", type: "full", pace: "5:43", weightLb: 135, tempF: 45, humidity: 70, sweatRate: "average", saltiness: "normal" },
  { label: "Competitive 3:05 full", type: "full", pace: "7:03", weightLb: 150, tempF: 45, humidity: 70, sweatRate: "average", saltiness: "salty" },
  { label: "Default 3:43 full (cold)", type: "full", pace: "8:30", weightLb: 155, tempF: 40, humidity: 80, sweatRate: "average", saltiness: "salty" },
  { label: "Mid-pack 4:30 full", type: "full", pace: "10:18", weightLb: 175, tempF: 55, humidity: 60, sweatRate: "heavy", saltiness: "salty" },
  { label: "Slow 5:30 full (warm)", type: "full", pace: "12:35", weightLb: 200, tempF: 72, humidity: 70, sweatRate: "heavy", saltiness: "verysalty" },
  { label: "Recreational full (hot)", type: "full", pace: "9:30", weightLb: 160, tempF: 82, humidity: 85, sweatRate: "heavy", saltiness: "verysalty" },
  { label: "Half 1:45", type: "half", pace: "8:00", weightLb: 145, tempF: 50, humidity: 65, sweatRate: "average", saltiness: "normal" },
  { label: "Half 2:15", type: "half", pace: "10:18", weightLb: 170, tempF: 60, humidity: 70, sweatRate: "average", saltiness: "salty" },
];

function rowFor(s: Scenario) {
  const paceSec = parsePace(s.pace)!;
  const weightKg = toKg(String(s.weightLb), "lb")!;
  const tempC = toC(String(s.tempF), "F");
  const conditions = classifyConditions(tempC, s.humidity);
  const finish = finishTime(s.type, paceSec, "mi")!;
  const hours = finish / 3600;

  const carb = carbRec({ type: s.type, finishSec: finish, weightKg, conditions, saltiness: s.saltiness });
  const fluidPh = fluidPerHour(s.sweatRate, conditions);
  const sod = sodiumRec(s.saltiness);
  const sodPh = Math.round((sod.low + sod.high) / 2);
  const bfCarbs = Math.round((weightKg * 1.8) / 5) * 5;
  const bfPerKg = bfCarbs / weightKg;

  const inputs: BuildPlanInputs = {
    type: s.type,
    paceSec,
    paceUnit: "mi",
    weightKg,
    tempC,
    humidity: s.humidity,
    sweatRate: s.sweatRate,
    saltiness: s.saltiness,
    carbsPerHr: carb.mid, // test the RECOMMENDED rate
    hydration: "aid",
    bottleCount: 0,
    bottleVolMl: 0,
  };
  const plan = buildPlan(inputs, s.type === "full" ? AID_STATIONS_FULL : AID_STATIONS_HALF)!;

  // The headline totals are now computed from the plan, so they equal the sum
  // of the per-station rows by construction (internal consistency). The open
  // question is whether the delivered plan tracks the per-hour *targets*
  // (rate x hours) the runner was recommended.
  const stationCarbs = plan.planEvents.reduce((a, e) => a + e.carbs, 0);
  const stationFluid = plan.planEvents.reduce((a, e) => a + e.fluid, 0);
  const stationSod = plan.planEvents.reduce((a, e) => a + e.sodium, 0);

  return {
    s, conditions, hours, carb, fluidPh, sodPh, bfCarbs, bfPerKg, plan,
    headline: { carbs: plan.carbsTotal, fluid: plan.fluidTotal, sod: plan.sodTotal },
    delivered: { carbs: stationCarbs, fluid: stationFluid, sod: stationSod },
    target: {
      carbs: Math.round(carb.mid * hours),
      fluid: Math.round(fluidPh * hours),
      sod: Math.round(sodPh * hours),
    },
  };
}

describe("marathon nutrition recommendations — sanity vs published ranges", () => {
  it("prints a full comparison table", () => {
    const pad = (v: string | number, n: number) => String(v).padStart(n);
    const fmtClock = (h: number) =>
      `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;
    const lines: string[] = [];
    const gapPct = (got: number, want: number) =>
      want > 0 ? `${got - want > 0 ? "+" : ""}${Math.round(((got - want) / want) * 100)}%` : "0%";
    // tgt = recommended rate x hours; dlv = what the aid-station plan delivers.
    lines.push(
      "\n" +
        [
          "Scenario".padEnd(26),
          "h:mm".padStart(5),
          "carb tgt/dlv".padStart(13),
          "g%".padStart(5),
          "fluid tgt/dlv".padStart(14),
          "g%".padStart(5),
          "Na tgt/dlv".padStart(13),
          "g%".padStart(5),
        ].join(" "),
    );
    for (const s of SCENARIOS) {
      const r = rowFor(s);
      lines.push(
        [
          s.label.padEnd(26),
          fmtClock(r.hours).padStart(5),
          `${r.target.carbs}/${r.delivered.carbs}`.padStart(13),
          gapPct(r.delivered.carbs, r.target.carbs).padStart(5),
          `${r.target.fluid}/${r.delivered.fluid}`.padStart(14),
          gapPct(r.delivered.fluid, r.target.fluid).padStart(5),
          `${r.target.sod}/${r.delivered.sod}`.padStart(13),
          gapPct(r.delivered.sod, r.target.sod).padStart(5),
        ].join(" "),
      );
    }
    // eslint-disable-next-line no-console
    console.log(lines.join("\n") + "\n");
    expect(SCENARIOS.length).toBeGreaterThan(0);
  });

  it("carbs/hr stay within published endurance ranges (30-110 g/hr)", () => {
    for (const s of SCENARIOS) {
      const r = rowFor(s);
      expect(r.carb.low, `${s.label} low`).toBeGreaterThanOrEqual(30);
      expect(r.carb.high, `${s.label} high`).toBeLessThanOrEqual(110);
      expect(r.carb.high, `${s.label} high>=low`).toBeGreaterThanOrEqual(r.carb.low);
    }
  });

  it("faster runners are recommended more carbs than slower runners", () => {
    const elite = rowFor(SCENARIOS[0]);
    const slow = rowFor(SCENARIOS[4]);
    expect(elite.carb.mid).toBeGreaterThan(slow.carb.mid);
  });

  it("fluid/hr stays within 300-1125 mL/hr (1125 = heavy sweat x hot ceiling)", () => {
    // 1125 mL/hr (heavy 900 x hot 1.25) is the engine's designed maximum. It is
    // at the high end of published guidance ("800 mL/hr or more in heat"), so a
    // 'drink to thirst / avoid >2% body-weight loss' guardrail would be a good
    // copy addition — but the rate itself is within range for a heavy sweater.
    for (const s of SCENARIOS) {
      const r = rowFor(s);
      expect(r.fluidPh, `${s.label}`).toBeGreaterThanOrEqual(300);
      expect(r.fluidPh, `${s.label}`).toBeLessThanOrEqual(1125);
    }
  });

  it("sodium/hr stays within 300-1500 mg/hr and scales with saltiness", () => {
    for (const s of SCENARIOS) {
      const r = rowFor(s);
      expect(r.sodPh, `${s.label}`).toBeGreaterThanOrEqual(300);
      expect(r.sodPh, `${s.label}`).toBeLessThanOrEqual(1500);
    }
    expect(sodiumRec("verysalty").low).toBeGreaterThan(sodiumRec("normal").high);
  });

  it("pre-race breakfast carbs land in the 1-4 g/kg window (>=100 g typical)", () => {
    for (const s of SCENARIOS) {
      const r = rowFor(s);
      expect(r.bfPerKg, `${s.label} g/kg`).toBeGreaterThanOrEqual(1);
      expect(r.bfPerKg, `${s.label} g/kg`).toBeLessThanOrEqual(4);
    }
  });

  it("only labels a stop 'Gel' where the course actually stocks gels (else 'Your gel')", () => {
    // A marathoner needs ~10 gels but Rocket City stocks them at only 3 of 13
    // stations. The plan correctly schedules carry-your-own gels everywhere
    // else — those must NOT be labelled as if the aid station hands one out.
    const offersByNum = new Map(AID_STATIONS_FULL.map((s) => [s.num, s.offers]));
    for (const s of SCENARIOS.filter((x) => x.type === "full")) {
      const r = rowFor(s);
      for (const e of r.plan.planEvents) {
        if (e.label === "Gel") {
          expect((offersByNum.get(e.station!) || []).includes("gels"), `${s.label}: station ${e.station} labelled "Gel" but stocks none`).toBe(true);
        }
        if (e.label === "Your gel") {
          expect((offersByNum.get(e.station!) || []).includes("gels"), `${s.label}: station ${e.station} labelled "Your gel" but the course stocks gels`).toBe(false);
        }
      }
    }
  });

  it("headline totals equal the sum of the per-station rows (internal consistency)", () => {
    // The race-total row must equal what the timeline/table actually lists.
    for (const s of SCENARIOS) {
      const r = rowFor(s);
      expect(r.plan.carbsTotal, `${s.label} carbs`).toBe(r.delivered.carbs);
      expect(r.plan.fluidTotal, `${s.label} fluid`).toBe(r.delivered.fluid);
      expect(r.plan.sodTotal, `${s.label} sodium`).toBe(r.delivered.sod);
    }
  });

  it("aid-station plan tracks the recommended carb/fluid/sodium targets", () => {
    // Regression guard for the scheduling fix. Before it, the per-station plan
    // drifted -41% to +73% from the recommended rate x hours because per-station
    // amounts were fixed by action type, not by the runner's need. Now fuel,
    // fluid and sodium are scheduled to the target. Carbs land slightly UNDER
    // (discrete 25g gels + fluid-only final stretch) and never over-fuel.
    for (const s of SCENARIOS) {
      const r = rowFor(s);
      const carbRatio = r.delivered.carbs / r.target.carbs;
      expect(carbRatio, `${s.label} carbs ${r.delivered.carbs}/${r.target.carbs}`).toBeGreaterThanOrEqual(0.82);
      expect(carbRatio, `${s.label} carbs not over-fuel`).toBeLessThanOrEqual(1.05);

      const fluidRatio = r.delivered.fluid / r.target.fluid;
      expect(fluidRatio, `${s.label} fluid ${r.delivered.fluid}/${r.target.fluid}`).toBeGreaterThanOrEqual(0.85);
      expect(fluidRatio, `${s.label} fluid`).toBeLessThanOrEqual(1.12);

      const sodRatio = r.delivered.sod / r.target.sod;
      expect(sodRatio, `${s.label} sodium ${r.delivered.sod}/${r.target.sod}`).toBeGreaterThanOrEqual(0.88);
      expect(sodRatio, `${s.label} sodium`).toBeLessThanOrEqual(1.12);
    }
  });
});
