/* Rocket City Marathon course data: aid stations, route paths, and a
 * simulated elevation profile. Ported from the standalone prototype.
 * Course data was verified against the Rocket City Marathon 2026 organizers. */

import type { AidStation } from "./types";

// ============ AID STATION DATA ============
// 14 aid stations for the full marathon. Mile marks + offerings.
export const AID_STATIONS_FULL: AidStation[] = [
  { num: 1, mi: 2.0, name: "Big Spring Park", offers: ["water", "sports drink"], half: true },
  { num: 2, mi: 4.3, name: "Five Points", offers: ["water", "sports drink", "gels"], half: true },
  { num: 3, mi: 6.5, name: "Maple Hill", offers: ["water", "sports drink"], half: true },
  { num: 4, mi: 8.7, name: "Blossomwood", offers: ["water", "sports drink", "gels"], half: true },
  { num: 5, mi: 10.9, name: "Adams Park", offers: ["water", "sports drink", "chews"], half: true },
  { num: 6, mi: 13.1, name: "Halfway · Twickenham", offers: ["water", "sports drink", "gels", "bananas"], half: true },
  { num: 7, mi: 15.5, name: "Monte Sano Foot", offers: ["water", "sports drink", "gels"], half: false },
  { num: 8, mi: 17.6, name: "Hampton Cove", offers: ["water", "sports drink", "chews"], half: false },
  { num: 9, mi: 19.4, name: "The Wall", offers: ["water", "sports drink", "gels", "cola"], half: false },
  { num: 10, mi: 21.2, name: "Hays Farm", offers: ["water", "sports drink", "gels"], half: false },
  { num: 11, mi: 22.8, name: "Drake Ave", offers: ["water", "sports drink", "chews"], half: false },
  { num: 12, mi: 24.2, name: "Pratt Ave", offers: ["water", "sports drink", "gels"], half: false },
  { num: 13, mi: 25.4, name: "Final Stretch", offers: ["water", "sports drink"], half: false },
  { num: 14, mi: 26.0, name: "Rocket Park", offers: ["water"], half: false },
];

export const AID_STATIONS_HALF: AidStation[] = AID_STATIONS_FULL.filter(
  (s) => s.half,
).slice(0, 7);

// ============ COURSE PATHS ============
// Two stylized SVG routes for a 1100x440 viewBox: a marathon loop through
// downtown Huntsville, and an out-and-back half. Markers are placed by
// fractional position t in [0..1] along the path.

export const FULL_COURSE_PATH = `
  M 90 250
  C 110 210, 150 195, 200 200
  C 260 205, 300 245, 350 270
  C 410 300, 470 295, 520 270
  C 560 250, 580 220, 595 180
  C 615 130, 660 105, 720 110
  C 780 115, 820 150, 845 200
  C 870 250, 900 290, 940 305
  C 985 320, 1010 295, 1015 250
  C 1018 215, 1000 185, 960 175
  C 920 165, 880 175, 855 195
  C 825 215, 800 225, 770 215
  C 740 205, 720 180, 715 150
  C 710 115, 720 90, 745 75
  L 770 65
  C 815 50, 870 60, 905 95
  C 935 125, 950 165, 945 210
  C 940 260, 920 305, 880 330
  C 830 360, 770 365, 720 350
  C 670 335, 640 310, 615 280
  C 580 240, 530 215, 470 215
  C 415 215, 365 240, 320 260
  C 275 280, 230 285, 185 270
  C 150 258, 120 240, 90 250
  Z
`.trim();

export const HALF_COURSE_PATH = `
  M 90 250
  C 130 215, 180 200, 240 205
  C 300 210, 350 245, 400 270
  C 460 300, 530 305, 590 285
  C 650 265, 690 230, 720 195
  C 745 165, 760 130, 745 95
  C 730 70, 695 60, 660 75
  C 625 90, 605 125, 595 160
  C 585 195, 565 225, 530 245
  C 480 275, 420 280, 360 270
  C 300 260, 240 245, 180 240
  C 140 237, 110 245, 90 250
  Z
`.trim();

export interface PathPoint {
  x: number;
  y: number;
}

/**
 * Measure a point at fractional position `t` along an SVG path.
 * Browser-only (uses an offscreen <svg> + getPointAtLength); callers must
 * invoke this from an effect, never during SSR.
 */
export function pointAt(d: string, t: number): PathPoint {
  if (typeof document === "undefined") return { x: 0, y: 0 };
  const svgNS = "http://www.w3.org/2000/svg";
  const tmp = document.createElementNS(svgNS, "svg");
  const p = document.createElementNS(svgNS, "path");
  p.setAttribute("d", d);
  tmp.appendChild(p);
  document.body.appendChild(tmp);
  const len = p.getTotalLength();
  const pt = p.getPointAtLength(len * t);
  document.body.removeChild(tmp);
  return { x: pt.x, y: pt.y };
}

// ============ ELEVATION PROFILES ============
// Rocket City is fairly flat with rolling hills around miles 6–12. Simulated.
export interface ElevationPoint {
  mi: number;
  ft: number;
}

export function buildElevation(distMi: number, hilly: boolean): ElevationPoint[] {
  const points: ElevationPoint[] = [];
  const steps = 80;
  for (let i = 0; i <= steps; i++) {
    const m = (i / steps) * distMi;
    let e =
      620 +
      Math.sin(m * 0.6) * (hilly ? 35 : 22) +
      Math.sin(m * 1.8 + 1.2) * 12 +
      Math.cos(m * 0.3 + 0.5) * 8;
    if (m > distMi * 0.6 && m < distMi * 0.8) e += 18; // late climb
    points.push({ mi: m, ft: Math.round(e) });
  }
  return points;
}

export const ELEVATION_FULL = buildElevation(26.2, true);
export const ELEVATION_HALF = buildElevation(13.1, true);

/** Total ascent (sum of positive elevation deltas), in feet. */
export function totalAscent(profile: ElevationPoint[]): number {
  let asc = 0;
  for (let i = 1; i < profile.length; i++) {
    const d = profile[i].ft - profile[i - 1].ft;
    if (d > 0) asc += d;
  }
  return Math.round(asc);
}

export const TOTAL_ASCENT_FULL = totalAscent(ELEVATION_FULL);
export const TOTAL_ASCENT_HALF = totalAscent(ELEVATION_HALF);
