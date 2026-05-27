/* Race Plan Calculator — calculation engine.
 * Ported from the standalone prototype. Units are kept canonical (metric
 * internally) and converted at the edges. Logic mirrors the original 1:1. */

import type {
  AidAction,
  AidStation,
  BuildGenericInputs,
  BuildPlanInputs,
  Conditions,
  GenericInterval,
  GenericPlan,
  PaceUnit,
  Plan,
  PlanEvent,
  RaceType,
  Saltiness,
  SweatRate,
  WeightUnit,
} from "./types";

// Distance constants
export const FULL_KM = 42.195;
export const HALF_KM = 21.0975;

/** Parse `mm:ss` into seconds. Returns null when malformed. */
export function parsePace(pace: string | null | undefined): number | null {
  if (!pace) return null;
  const m = String(pace)
    .trim()
    .match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const min = parseInt(m[1], 10);
  const sec = parseInt(m[2], 10);
  if (sec >= 60) return null;
  return min * 60 + sec;
}

/** Format seconds as `h:mm:ss` or `m:ss`. */
export function fmtClock(seconds: number | null | undefined): string {
  if (seconds == null || !isFinite(seconds) || seconds <= 0) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Format seconds as `m:ss` (pace style). */
export function fmtMmss(seconds: number | null | undefined): string {
  if (seconds == null || !isFinite(seconds) || seconds <= 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Convert a weight string to kilograms. */
export function toKg(weight: string, unit: WeightUnit): number | null {
  const w = parseFloat(weight);
  if (!w) return null;
  return unit === "lb" ? w * 0.453592 : w;
}

/** Convert a temperature string to Celsius. */
export function toC(t: string, unit: "F" | "C"): number | null {
  const v = parseFloat(t);
  if (!isFinite(v)) return null;
  return unit === "F" ? ((v - 32) * 5) / 9 : v;
}

export function cToF(c: number): number {
  return (c * 9) / 5 + 32;
}

export function distanceKm(type: RaceType): number {
  return type === "half" ? HALF_KM : FULL_KM;
}
export function distanceMi(type: RaceType): number {
  return distanceKm(type) / 1.609344;
}

/** Pace per unit → canonical sec/km. */
export function paceSecPerKm(
  paceSec: number | null,
  unit: PaceUnit,
): number | null {
  if (!paceSec) return null;
  return unit === "mi" ? paceSec / 1.609344 : paceSec;
}

/** Projected finish time in seconds. */
export function finishTime(
  type: RaceType,
  paceSec: number | null,
  paceUnit: PaceUnit,
): number | null {
  const spk = paceSecPerKm(paceSec, paceUnit);
  if (!spk) return null;
  return spk * distanceKm(type);
}

/** Classify race conditions from temperature (°C) + humidity (%). */
export function classifyConditions(
  tempC: number | null,
  humidity: number,
): Conditions {
  if (tempC == null) return "moderate";
  // Heat index lite: combine temp + humidity
  let score = tempC;
  if (humidity > 70) score += (humidity - 70) * 0.08;
  if (score < 8) return "cool";
  if (score < 16) return "moderate";
  if (score < 23) return "warm";
  return "hot";
}

export interface CarbRecArgs {
  type: RaceType;
  finishSec: number | null;
  weightKg: number | null;
  conditions: Conditions;
  saltiness: Saltiness;
}

export interface CarbRec {
  low: number;
  high: number;
  mid: number;
}

/** Recommended carbohydrate intake range (g/hr). */
export function carbRec({
  type,
  finishSec,
  weightKg,
  conditions,
}: CarbRecArgs): CarbRec {
  if (!finishSec) return { low: 60, high: 75, mid: 68 };
  const h = finishSec / 3600;
  let low: number, high: number;
  if (type === "full") {
    if (h < 2.5) [low, high] = [90, 100];
    else if (h < 3.25) [low, high] = [80, 95];
    else if (h < 4) [low, high] = [70, 85];
    else if (h < 5) [low, high] = [60, 75];
    else [low, high] = [45, 60];
  } else {
    if (h < 1.166) [low, high] = [90, 100];
    else if (h < 1.5) [low, high] = [80, 95];
    else if (h < 1.833) [low, high] = [70, 85];
    else if (h < 2.25) [low, high] = [60, 75];
    else [low, high] = [45, 60];
  }
  // Weight adjustment
  if (weightKg) {
    const adj = ((weightKg - 70) / 10) * 5;
    low += adj;
    high += adj;
  }
  // Conditions adjustment
  if (conditions === "hot") {
    low -= 10;
    high -= 5;
  } else if (conditions === "warm") {
    low -= 5;
    high -= 2;
  } else if (conditions === "cool") {
    high += 5;
  }
  // Bounds
  low = Math.max(30, Math.min(100, Math.round(low / 5) * 5));
  high = Math.max(30, Math.min(100, Math.round(high / 5) * 5));
  if (high < low) high = low;
  const mid = Math.round((low + high) / 2 / 5) * 5;
  return { low, high, mid };
}

/** Recommended sodium intake (mg/hr) by sweat saltiness. */
export function sodiumRec(saltiness: Saltiness): { low: number; high: number } {
  if (saltiness === "verysalty") return { low: 1000, high: 1500 };
  if (saltiness === "salty") return { low: 700, high: 1000 };
  return { low: 400, high: 700 };
}

/** Fluid target (mL/hr) from sweat rate, adjusted by conditions. */
export function fluidPerHour(
  sweatRate: SweatRate,
  conditions: Conditions,
): number {
  const base = sweatRate === "light" ? 450 : sweatRate === "heavy" ? 900 : 650;
  const mult =
    conditions === "hot"
      ? 1.25
      : conditions === "warm"
        ? 1.1
        : conditions === "cool"
          ? 0.9
          : 1.0;
  return Math.round(base * mult);
}

/** Build the full aid-station-based race plan, or null if pace is missing. */
export function buildPlan(
  inputs: BuildPlanInputs,
  aidStations: AidStation[],
): Plan | null {
  const {
    type,
    paceSec,
    paceUnit,
    weightKg,
    tempC,
    humidity,
    sweatRate,
    saltiness,
    carbsPerHr,
  } = inputs;
  const conditions = classifyConditions(tempC, humidity);
  const finish = finishTime(type, paceSec, paceUnit);
  if (!finish) return null;
  const distKm = distanceKm(type);
  const distMi = distanceMi(type);
  const hours = finish / 3600;
  const fluidPh = fluidPerHour(sweatRate, conditions);
  const sod = sodiumRec(saltiness);
  const sodPh = Math.round((sod.low + sod.high) / 2);

  // Filter aid stations for race type
  const stations = aidStations.filter((s) => type === "full" || s.half);

  // Pre-race breakfast: aim ~1.8g carb/kg body, 3hrs out
  const bfCarbs = weightKg ? Math.round((weightKg * 1.8) / 5) * 5 : 120;

  // Salt caps (supplemental sodium for salty / very-salty sweat). Generated
  // first so their sodium can be folded into the overall sodium budget below —
  // otherwise per-station sodium + salt caps would double-count and overshoot.
  const saltCapEvents: PlanEvent[] = [];
  if (saltiness !== "normal") {
    const interval = saltiness === "verysalty" ? 35 * 60 : 50 * 60;
    const capMg = saltiness === "verysalty" ? 400 : 300;
    for (let t = interval; t < finish - 600; t += interval) {
      const km = (t / finish) * distKm;
      saltCapEvents.push({
        mi: km / 1.609344, km, timeSec: t, type: "salt",
        carbs: 0, fluid: 0, sodium: capMg, label: "Salt cap", station: null,
      });
    }
  }
  const saltCapTotal = saltCapEvents.reduce((a, e) => a + e.sodium, 0);

  // Pass 1 — segment timing + carb scheduling. Running carb "debt" is the grams
  // the runner should have taken by now to hold the target rate; fuel is
  // scheduled against it (athlete carries their own gels) rather than only where
  // the course stocks them. The old logic gated gels on `offers.includes("gels")`
  // and used fixed per-action fluid/sodium, so the per-station plan drifted
  // 20-70% from the headline targets. See
  // tests/integration/race-plan-marathon-validation.test.ts.
  const spk = paceSecPerKm(paceSec, paceUnit) ?? 0;
  let lastTime = 0;
  let carbDebt = 0;
  const stops = stations.map((s) => {
    const mi = s.mi;
    const km = mi * 1.609344;
    const timeSec = spk * km;
    const segHr = (timeSec - lastTime) / 3600;
    lastTime = timeSec;
    carbDebt += carbsPerHr * segHr;

    let action: AidAction["action"] = "skip";
    let carbsHere = 0;
    if (mi < 1.5) {
      action = "skip"; // too early to fuel
    } else if (mi >= distMi - 1.5) {
      action = "drink"; // final stretch — fluid only, no more fuel this late
    } else if (carbDebt >= 20) {
      action = "gel"; // ~a gel behind — take a 25g gel to catch back up
      carbsHere = 25;
      carbDebt -= carbsHere;
    } else if (carbDebt >= 12 && (s.offers || []).includes("chews")) {
      action = "chew";
      carbsHere = 16;
      carbDebt -= carbsHere;
    } else {
      action = "drink"; // sports drink — ~14g carbs from an 8oz cup
      carbsHere = 14;
      carbDebt -= carbsHere;
    }
    return { s, mi, km, timeSec, segHr, action, carbsHere };
  });

  // Pass 2 — size fluid + sodium to each stop's share of the per-hour target so
  // the per-station rows sum to the race total. Fluid: drink your hourly rate
  // across each segment. Sodium: the per-hour target minus what salt caps cover,
  // spread across stops by segment length.
  const fuelingStops = stops.filter((p) => p.action !== "skip");
  const activeHr = fuelingStops.reduce((a, p) => a + p.segHr, 0) || 1;
  const stationSodiumBudget = Math.max(0, Math.round(sodPh * hours) - saltCapTotal);

  const planEvents: PlanEvent[] = [];
  const aidActions: AidAction[] = stops.map((p) => {
    let fluidHere = 0;
    let sodiumHere = 0;
    if (p.action !== "skip") {
      fluidHere = Math.round(fluidPh * p.segHr);
      sodiumHere = Math.round(stationSodiumBudget * (p.segHr / activeHr));
      // Gels are scheduled to the runner's carb target, so most fall at
      // stations that don't stock them — the athlete carries their own. Label
      // honestly: "Gel" only where the course actually hands one out.
      const courseStocksGels = (p.s.offers || []).includes("gels");
      const label = p.action === "gel"
        ? (courseStocksGels ? "Gel" : "Your gel")
        : p.action === "chew" ? "Chews" : "Drink mix";
      planEvents.push({
        mi: p.mi,
        km: p.km,
        timeSec: p.timeSec,
        type: p.action === "gel" || p.action === "chew" ? "fuel" : "fluid",
        carbs: p.carbsHere,
        fluid: fluidHere,
        sodium: sodiumHere,
        label,
        station: p.s.num,
      });
    }
    return { ...p.s, timeSec: p.timeSec, action: p.action, carbsHere: p.carbsHere, fluidHere, sodiumHere };
  });

  planEvents.push(...saltCapEvents);
  planEvents.sort((a, b) => a.timeSec - b.timeSec);

  // Headline totals = what the plan actually delivers, so the per-station rows
  // reconcile with the race total instead of drifting from it.
  const carbsTotal = planEvents.reduce((a, e) => a + e.carbs, 0);
  const fluidTotal = planEvents.reduce((a, e) => a + e.fluid, 0);
  const sodTotal = planEvents.reduce((a, e) => a + e.sodium, 0);

  return {
    conditions,
    finish,
    hours,
    distKm,
    distMi,
    fluidPh,
    fluidTotal,
    carbsTotal,
    sodPh,
    sodTotal,
    bfCarbs,
    aidActions,
    planEvents,
    stations,
  };
}

/** Build a course-agnostic, by-the-clock plan: totals plus 30-minute
 * checkpoints. Used by the generic calculator when there's no aid-station map
 * for a race. Returns null when pace or distance is missing. */
export function buildGenericPlan(
  inputs: BuildGenericInputs,
): GenericPlan | null {
  const {
    distKm,
    paceSec,
    paceUnit,
    weightKg,
    tempC,
    humidity,
    sweatRate,
    saltiness,
    carbsPerHr,
  } = inputs;
  const spk = paceSecPerKm(paceSec, paceUnit);
  if (!spk || !distKm || distKm <= 0) return null;

  const conditions = classifyConditions(tempC, humidity);
  const finish = spk * distKm;
  const hours = finish / 3600;
  const fluidPh = fluidPerHour(sweatRate, conditions);
  const sod = sodiumRec(saltiness);
  const sodPh = Math.round((sod.low + sod.high) / 2);
  const carbsTotal = Math.round(carbsPerHr * hours);
  const fluidTotal = Math.round(fluidPh * hours);
  const sodTotal = Math.round(sodPh * hours);
  const bfCarbs = weightKg ? Math.round((weightKg * 1.8) / 5) * 5 : 120;

  const STEP = 30 * 60; // 30-minute checkpoints
  const intervals: GenericInterval[] = [];
  for (let t = 0; t < finish - 60; t += STEP) {
    const endSec = Math.min(t + STEP, finish);
    const segHr = (endSec - t) / 3600;
    intervals.push({
      startSec: t,
      endSec,
      carbs: Math.round(carbsPerHr * segHr),
      fluid: Math.round(fluidPh * segHr),
      sodium: Math.round(sodPh * segHr),
    });
  }

  return {
    conditions,
    finish,
    hours,
    distKm,
    distMi: distKm / 1.609344,
    carbsPerHr,
    fluidPh,
    sodPh,
    carbsTotal,
    fluidTotal,
    sodTotal,
    bfCarbs,
    intervals,
  };
}
