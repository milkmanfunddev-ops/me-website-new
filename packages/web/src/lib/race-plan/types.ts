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
  hydration: Hydration;
  bottleCount: number;
  bottleVol: string;
  bottleVolUnit: BottleVolUnit;
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

export interface Plan {
  conditions: Conditions;
  finish: number;
  hours: number;
  distKm: number;
  distMi: number;
  fluidPh: number;
  fluidTotal: number;
  carbsTotal: number;
  sodPh: number;
  sodTotal: number;
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
