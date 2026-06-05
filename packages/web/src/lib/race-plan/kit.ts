/* Race-day kit seeding — the pure logic behind the "Build your race-day kit"
 * editor. Kept framework-free so it can be unit-tested and so the React layer
 * (plan-output.tsx) only owns rendering + interaction.
 *
 * Division of labour:
 *   engine.ts → the TARGETS (carbs/fluid/sodium per hour × race hours) and the
 *               coach's gel SCHEDULE (how many gels, ~30 min apart).
 *   kit.ts    → how to FILL those targets with concrete items: gels (count
 *               LOCKED to the schedule), aid-station cups, salt caps, and the
 *               carb-electrolyte mix in any bottles the runner carries.
 *
 * Why the count is locked: the old seeder treated gels as an open-ended carb
 * bucket — after sports drink hit its fluid cap, every remaining gram of carbs
 * was topped up with gels, with no ceiling. A low-carb gel (e.g. 21 g) or
 * carried bottles (which cut the grabbable table fluid) pushed the count to
 * absurd values — 11 gels for a 3:43 marathon, contradicting the plan's own
 * 6-gel schedule. Gels are now fixed to `plan.gelTotal`; the variable buckets
 * are the cups, the salt caps, and the carried mix. */

import type { Plan } from "./types";

export const ML_PER_OZ = 29.5735;

/** Minimal gel shape the seeder needs: per-unit carbs + sodium. The richer
 * `GelProduct` used by the UI is structurally compatible. */
export interface KitGel {
  carbs: number;
  na: number;
}

export type KitItemKey = "gel" | "sports" | "water" | "salt";
export type KitQty = Record<KitItemKey, number>;

/* Carried bottles ride as a carb-electrolyte mix. These are the *strongest*
 * mix we'll assume when crediting a bottle — a real but concentrated race mix
 * (~60 g carb + ~600 mg sodium per 500 mL), matching the start-bottle advisory.
 * Actual credit is capped by how much carb/sodium the plan still needs, so a
 * high-carb gel never lets the bottle push totals over target. */
const CARRIED_CARB_PER_ML = 60 / 500; // 0.12 g/mL
const CARRIED_SOD_PER_ML = 600 / 500; // 1.2 mg/mL

export interface KitSeed {
  qty: KitQty;
  /** Carbs the carried bottles supply (own/hybrid only; 0 otherwise). */
  carriedCarbs: number;
  /** Sodium the carried bottles supply (own/hybrid only; 0 otherwise). */
  carriedSod: number;
}

/** Suggested starting kit that lands each total near its target.
 *
 * Order of fill — gels first (fixed by the schedule), then the runner's own
 * carried mix, then aid-station cups, then salt caps as the sodium buffer:
 *   1. Gels  → `plan.gelTotal` (≥2), never carb-derived.
 *   2. Bottles (own/hybrid) → fill the post-gel carb gap first, capped at a
 *      strong-but-real 60 g / 500 mL, so carrying your own fluid contributes
 *      carbs + sodium instead of being dead weight that forces extra gels.
 *   3. Sports drink → covers the carb gap that's left, capped by the table
 *      fluid you can realistically grab.
 *   4. Salt caps → buffer the sodium gels + drink + bottles don't cover. */
export function seedKit(plan: Plan, gel: KitGel): KitSeed {
  const carbsT = plan.carbsTarget;
  const sodT = plan.sodTarget;
  const tableFluidOz = Math.round(plan.tableFluidTarget / ML_PER_OZ);
  const carriedMl = Math.max(0, plan.carriedMl || 0);
  const gc = gel.carbs || 25;
  const gna = gel.na || 0;

  // 1) Gels — the coach's schedule count, never an overflow bucket.
  const gelN = Math.max(2, plan.gelTotal);

  // 2) Carried bottles fuel first, capped by the carb still needed after gels.
  const carbGapAfterGels = Math.max(0, carbsT - gelN * gc);
  const carriedCarbs = Math.min(carriedMl * CARRIED_CARB_PER_ML, carbGapAfterGels);

  // 3) Aid-station sports drink covers what's left, capped by grabbable fluid.
  const carbGap = Math.max(0, carbGapAfterGels - carriedCarbs);
  let sports = Math.min(carbGap / 15, tableFluidOz / 8);
  sports = Math.max(0, Math.round(sports * 2) / 2); // 0.5-cup step

  // 4) Leftover table fluid → plain water.
  const water = Math.max(0, Math.round(((tableFluidOz - sports * 8) / 8) * 2) / 2);

  // 5) Sodium: bottles fill the post-gels+drink gap (capped), salt caps buffer.
  const sodGap = Math.max(0, sodT - gelN * gna - sports * 110);
  const carriedSod = Math.min(carriedMl * CARRIED_SOD_PER_ML, sodGap);
  const salt = Math.max(0, Math.round((sodGap - carriedSod) / 300));

  return {
    qty: { gel: gelN, sports, water, salt },
    carriedCarbs: Math.round(carriedCarbs),
    carriedSod: Math.round(carriedSod),
  };
}

/** The carbs + sodium the runner's carried bottles contribute. Fixed to the
 * plan + gel (not live edits), so the summary stats can add it the same way
 * fluid already counts carried volume. */
export function carriedKitNutrition(
  plan: Plan,
  gel: KitGel,
): { carbs: number; sodium: number } {
  const s = seedKit(plan, gel);
  return { carbs: s.carriedCarbs, sodium: s.carriedSod };
}
