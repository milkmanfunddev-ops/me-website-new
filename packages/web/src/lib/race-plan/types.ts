/* Shared types for the Rocket City Marathon race-day calculator. */

export type RaceType = "full" | "half";
export type PaceUnit = "km" | "mi";
export type WeightUnit = "kg" | "lb";
export type TempUnit = "F" | "C";
export type SweatRate = "light" | "average" | "heavy";
export type Saltiness = "normal" | "salty" | "verysalty";
export type Hydration = "aid" | "own" | "hybrid";
export type BottleVolUnit = "oz" | "ml";
export type Conditions = "cool" | "moderate" | "warm" | "hot";
/** How much caffeine the runner wants in the plan. Opt-in, never derived
 * automatically from sweat saltiness. */
export type Caffeine = "none" | "moderate" | "high";

/** The full form/UI state of the calculator. */
export interface CalculatorState {
  type: RaceType;
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
  caffeine: Caffeine;
  hydration: Hydration;
  bottleCount: number;
  bottleVol: string;
  bottleVolUnit: BottleVolUnit;
  /** Aid-station numbers the runner has marked as their own drops (Hybrid). */
  selectedStations: number[];
}

export interface AidStation {
  num: number;
  mi: number;
  name: string;
  offers: string[];
  half: boolean;
}

export type AidActionKind = "skip" | "drink" | "gel" | "chew";

/** An aid station enriched with the per-station action chosen by the engine. */
export interface AidAction extends AidStation {
  timeSec: number;
  action: AidActionKind;
  carbsHere: number;
  fluidHere: number;
  sodiumHere: number;
}

export type PlanEventKind = "fuel" | "fluid" | "salt";

export interface PlanEvent {
  mi: number;
  km: number;
  timeSec: number;
  type: PlanEventKind;
  carbs: number;
  fluid: number;
  sodium: number;
  label: string;
  station: number | null;
}

/** Recommended carbohydrate intake range (g/hr). */
export interface CarbRec {
  low: number;
  high: number;
  mid: number;
}

/** One scheduled gel marker in the coach-style plan (the "5 gels, ~30 min
 * apart" artifact). The last marker is always framed as optional. */
export interface GelMark {
  n: number;
  timeSec: number;
  mi: number;
  optional: boolean;
}

/** A compact aid-station entry for the "hit every table" mile list. */
export interface AidMileEntry {
  num: number;
  mi: number;
  name: string;
  gel: boolean;
}

export interface Plan {
  conditions: Conditions;
  warm: boolean;
  finish: number;
  hours: number;
  distKm: number;
  distMi: number;
  fluidPh: number;
  fluidTotal: number;
  carbsTotal: number;
  sodPh: number;
  sodTotal: number;
  /** Coaching targets = per-hour rate × race hours. These (not the reconciled
   * *Total fields) drive the editable kit's ±10% target bands. */
  carbsTarget: number;
  fluidTarget: number;
  sodTarget: number;
  /** Fluid the runner carries in their own bottles (Own / Hybrid), and the
   * remaining fluid they need to pick up at tables. */
  carriedMl: number;
  tableFluidTarget: number;
  carbRange: CarbRec;
  sodRange: { low: number; high: number };
  gels: GelMark[];
  gelRequired: number;
  gelTotal: number;
  aidMileList: AidMileEntry[];
  bfCarbs: number;
  aidActions: AidAction[];
  planEvents: PlanEvent[];
  stations: AidStation[];
}

export interface BuildPlanInputs {
  type: RaceType;
  paceSec: number | null;
  paceUnit: PaceUnit;
  weightKg: number | null;
  tempC: number | null;
  humidity: number;
  sweatRate: SweatRate;
  saltiness: Saltiness;
  carbsPerHr: number;
  hydration: Hydration;
  bottleCount: number;
  bottleVolMl: number;
  /** Aid-station numbers the runner marked as own drops (Hybrid only). */
  selectedStations?: number[];
}

/* ---- Generic (course-agnostic) plan ---- */

/** One checkpoint of a by-the-clock generic plan (no aid stations). */
export interface GenericInterval {
  startSec: number;
  endSec: number;
  carbs: number;
  fluid: number;
  sodium: number;
}

export interface GenericPlan {
  conditions: Conditions;
  finish: number;
  hours: number;
  distKm: number;
  distMi: number;
  carbsPerHr: number;
  fluidPh: number;
  sodPh: number;
  carbsTotal: number;
  fluidTotal: number;
  sodTotal: number;
  bfCarbs: number;
  intervals: GenericInterval[];
}

export interface BuildGenericInputs {
  distKm: number;
  paceSec: number | null;
  paceUnit: PaceUnit;
  weightKg: number | null;
  tempC: number | null;
  humidity: number;
  sweatRate: SweatRate;
  saltiness: Saltiness;
  carbsPerHr: number;
}
