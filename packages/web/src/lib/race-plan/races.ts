/* Race library data.
 *
 * Currently a single race — the Rocket City Marathon 2026 — but modeled as an
 * array so the landing-page list, region grouping, and filter bar all scale the
 * moment a second race is added. Races with status "available" link to a
 * working, course-specific calculator at /race-day-calculator/<slug>; future
 * "coming-soon" races would get their own detail page at the same path. */

import { AID_STATIONS_FULL } from "./course";

export type RaceStatus = "available" | "coming-soon";
export type RaceRegion = "United States" | "Europe" | "Asia · Pacific";

export interface RaceSummary {
  /** URL segment under /race-day-calculator/. */
  slug: string;
  name: string;
  year: number;
  /** "Huntsville, AL" */
  city: string;
  region: RaceRegion;
  /** ISO race-day date, e.g. "2026-12-13". */
  date: string;
  distanceMi: number;
  /** "Marathon" / "Half marathon" — currently all full marathons. */
  distanceType: string;
  aidStations: number;
  /** Published net elevation gain, in feet. */
  elevGainFt: number;
  /** Historical race-morning range, e.g. "40–48°F". */
  forecast: string;
  status: RaceStatus;
  featured?: boolean;
  /** A World Marathon Major. */
  major?: boolean;
  blurb: string;
  /** Course data has been verified with the race organizers. */
  verified: boolean;
}

export const RACES: RaceSummary[] = [
  {
    slug: "rocket-city-marathon-2026",
    name: "Rocket City Marathon",
    year: 2026,
    city: "Huntsville, AL",
    region: "United States",
    date: "2026-12-13",
    distanceMi: 26.2,
    distanceType: "Marathon",
    aidStations: AID_STATIONS_FULL.length,
    elevGainFt: 180,
    forecast: "40–48°F",
    status: "available",
    featured: true,
    blurb:
      "A flat, fast, Boston-qualifying tour of Huntsville — celebrating 50 years in 2026.",
    verified: true,
  },
];

export const FEATURED_RACE: RaceSummary =
  RACES.find((r) => r.featured) ?? RACES[0];

/** Region display order for the grouped race list. */
export const REGION_ORDER: RaceRegion[] = [
  "United States",
  "Europe",
  "Asia · Pacific",
];

export const REGION_FLAG: Record<RaceRegion, string> = {
  "United States": "🇺🇸",
  Europe: "🇪🇺",
  "Asia · Pacific": "🌏",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const DOW = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];
const DOW_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Parse an ISO `YYYY-MM-DD` as a UTC date (TZ-stable for SSR ↔ client). */
function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** "Sunday, December 13, 2026" */
export function formatRaceDateLong(iso: string): string {
  const dt = parseISODate(iso);
  return `${DOW[dt.getUTCDay()]}, ${MONTHS[dt.getUTCMonth()]} ${dt.getUTCDate()}, ${dt.getUTCFullYear()}`;
}

/** "SUN · DEC 13, 2026" */
export function formatRaceDateShort(iso: string): string {
  const dt = parseISODate(iso);
  return `${DOW_SHORT[dt.getUTCDay()]} · ${MONTHS_SHORT[dt.getUTCMonth()]} ${dt.getUTCDate()}, ${dt.getUTCFullYear()}`;
}

/** Full month name for the given race, for the month filter. */
export function raceMonth(iso: string): string {
  return MONTHS[parseISODate(iso).getUTCMonth()];
}
