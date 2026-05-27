import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { APP_NAME, APP_URL } from "@mealvana/shared";
import { FULL_ELEVATION } from "@/lib/race-plan/course";
import {
  FEATURED_RACE,
  formatRaceDateLong,
  formatRaceDateShort,
  raceMonth,
  RACES,
  REGION_FLAG,
  REGION_ORDER,
  type RaceRegion,
  type RaceSummary,
} from "@/lib/race-plan/races";
import raceCalcCss from "@/styles/race-calculator.css?url";

const PAGE_TITLE = `Marathon Race Day Calculator | ${APP_NAME}`;
const PAGE_DESCRIPTION =
  "Free, course-aware fueling, hydration, and sodium plans for the marathons you're actually running — verified with race organizers and snapped to every aid station. Or build a generic plan for any race.";
const PAGE_URL = `${APP_URL}/race-day-calculator`;

const availableRaces = RACES.filter((r) => r.status === "available");

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Marathon Race Day Calculator",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  url: PAGE_URL,
  description: PAGE_DESCRIPTION,
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@type": "Organization", name: APP_NAME, url: APP_URL },
};

const itemListLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Marathon race day calculators",
  itemListElement: availableRaces.map((r, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: `${r.name} ${r.year} Race Day Calculator`,
    url: `${APP_URL}/race-day-calculator/${r.slug}`,
  })),
};

export const Route = createFileRoute("/race-day-calculator/")({
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
      { type: "application/ld+json", children: JSON.stringify(webAppLd) },
      { type: "application/ld+json", children: JSON.stringify(itemListLd) },
    ],
  }),
  component: RaceLibrary,
});

/* Sampled elevation sparkline for the featured course, drawn from the real
 * terrain data already used by the calculator. */
function CourseSparkline() {
  const W = 1000;
  const H = 150;
  const PAD = 14;
  const pts = FULL_ELEVATION;
  const maxMi = pts[pts.length - 1].mi || 26.2;
  const fts = pts.map((p) => p.ft);
  const minFt = Math.min(...fts);
  const maxFt = Math.max(...fts);
  const span = maxFt - minFt || 1;

  const x = (mi: number) => (mi / maxMi) * W;
  const y = (ft: number) => PAD + (1 - (ft - minFt) / span) * (H - PAD * 2);

  const line = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.mi).toFixed(1)},${y(p.ft).toFixed(1)}`)
    .join(" ");
  const fill = `${line} L${W},${H} L0,${H} Z`;
  const markers = [5, 13.1, 20];

  return (
    <svg className="fp-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <line className="fp-base" x1="0" y1={H - 1} x2={W} y2={H - 1} />
      {markers.map((mi) => (
        <line key={mi} className="fp-mark" x1={x(mi)} y1="0" x2={x(mi)} y2={H} />
      ))}
      <path className="fp-fill" d={fill} />
      <path className="fp-line" d={line} />
    </svg>
  );
}

function FeaturedRace({ race }: { race: RaceSummary }) {
  return (
    <section className="feat">
      <div className="feat-main">
        <div className="feat-badge">
          <span className="dot"></span> Featured · Available now
        </div>
        <h2 className="feat-title">
          {race.name} <span className="yr">{race.year}</span>
        </h2>
        <div className="feat-city">{race.city}</div>
        <p className="feat-quote">“{race.blurb}”</p>
        <div className="feat-date">
          <i className="fa-regular fa-calendar"></i>
          {formatRaceDateLong(race.date)}
        </div>
      </div>

      <div className="feat-side">
        <div className="feat-stats">
          <div className="fs">
            <span className="l">Elev gain</span>
            <span className="v">
              {race.elevGainFt}
              <span className="u">ft</span>
            </span>
          </div>
          <div className="fs">
            <span className="l">Aid stations</span>
            <span className="v">{race.aidStations}</span>
          </div>
          <div className="fs">
            <span className="l">Forecast</span>
            <span className="v">{race.forecast}</span>
          </div>
        </div>
        <a className="feat-cta" href={`/race-day-calculator/${race.slug}`}>
          Build my plan <i className="fa-solid fa-arrow-right"></i>
        </a>
        {race.verified && (
          <div className="feat-verified">
            <i className="fa-solid fa-circle-check"></i> Course verified with race organizers
          </div>
        )}
      </div>

      <div className="feat-profile">
        <div className="fp-head">
          <h4>Course profile</h4>
          <span className="fp-gain">{race.elevGainFt} ft total gain</span>
          <span className="fp-dist">{race.distanceMi} mi</span>
        </div>
        <div className="fp-stage">
          <CourseSparkline />
          <div className="fp-ticks">
            <span style={{ left: `${(5 / race.distanceMi) * 100}%` }}>Mi 5</span>
            <span style={{ left: `${(13.1 / race.distanceMi) * 100}%` }}>Mi 13.1</span>
            <span style={{ left: `${(20 / race.distanceMi) * 100}%` }}>Mi 20</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function RaceRow({ race }: { race: RaceSummary }) {
  const available = race.status === "available";
  const inner = (
    <>
      <div className="rl-loc">
        <div className="rl-city">
          {available && <span className="rl-live"></span>}
          {race.city}
          {race.major && <span className="rl-chip major">Major</span>}
          {!available && <span className="rl-chip soon">Coming soon</span>}
        </div>
        <h3 className="rl-name">{race.name}</h3>
      </div>
      <div className="rl-date">
        <i className="fa-regular fa-calendar"></i>
        {formatRaceDateShort(race.date)}
      </div>
      <div className="rl-aid">
        <i className="fa-solid fa-droplet"></i>
        {race.aidStations} aid
      </div>
      <div className="rl-elev">{race.elevGainFt} ft</div>
      <div className="rl-dist">
        {race.distanceMi} mi · {race.distanceType}
        {available && <i className="fa-solid fa-arrow-right"></i>}
      </div>
    </>
  );

  if (available) {
    return (
      <a className="rl-row" href={`/race-day-calculator/${race.slug}`}>
        {inner}
      </a>
    );
  }
  return <div className="rl-row disabled">{inner}</div>;
}

type SortKey = "upcoming" | "available" | "az" | "aid";

function RaceLibrary() {
  const [search, setSearch] = useState("");
  const [distance, setDistance] = useState("all");
  const [region, setRegion] = useState("all");
  const [month, setMonth] = useState("all");
  const [sort, setSort] = useState<SortKey>("upcoming");

  const distanceOptions = useMemo(
    () => Array.from(new Set(RACES.map((r) => r.distanceType))),
    [],
  );
  const monthOptions = useMemo(
    () => Array.from(new Set(RACES.map((r) => raceMonth(r.date)))),
    [],
  );
  const regionOptions = useMemo(
    () => REGION_ORDER.filter((rg) => RACES.some((r) => r.region === rg)),
    [],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = RACES.filter((r) => {
      if (q && !`${r.name} ${r.city}`.toLowerCase().includes(q)) return false;
      if (distance !== "all" && r.distanceType !== distance) return false;
      if (region !== "all" && r.region !== region) return false;
      if (month !== "all" && raceMonth(r.date) !== month) return false;
      return true;
    });
    list.sort((a, b) => {
      if (sort === "az") return a.name.localeCompare(b.name);
      if (sort === "aid") return b.aidStations - a.aidStations;
      if (sort === "available") {
        const av = (r: RaceSummary) => (r.status === "available" ? 0 : 1);
        if (av(a) !== av(b)) return av(a) - av(b);
      }
      return a.date.localeCompare(b.date);
    });
    return list;
  }, [search, distance, region, month, sort]);

  const filtersActive =
    search !== "" || distance !== "all" || region !== "all" || month !== "all" || sort !== "upcoming";

  function clearFilters() {
    setSearch("");
    setDistance("all");
    setRegion("all");
    setMonth("all");
    setSort("upcoming");
  }

  const groups = regionOptions
    .map((rg) => ({ region: rg, races: filtered.filter((r) => r.region === rg) }))
    .filter((g) => g.races.length > 0);

  const availableCount = availableRaces.length;

  return (
    <div className="rcm">
      <div className="page">
        {/* HERO */}
        <section className="hero">
          <div>
            <div className="eyebrow">
              <span className="dot"></span> Race day plan calculator
            </div>
            <h1 className="hero-title">
              Pick your start line. <br />
              <span className="accent">We'll build the plan.</span>
            </h1>
            <p className="hero-sub">
              Course-aware fueling, hydration, and sodium plans for the marathons you're actually running — verified
              with race organizers, snapped to the aid stations.
            </p>
            <div className="hero-pills">
              <span className="hp">
                <span className="dot ok"></span>
                {availableCount} race{availableCount === 1 ? "" : "s"} available
              </span>
              <span className="sep">·</span>
              <span className="hp">
                <span className="dot soon"></span>
                More coming soon
              </span>
              <span className="sep">·</span>
              <span className="hp">Always free to plan</span>
            </div>
          </div>
          <div className="hero-ctas">
            <a className="hero-cta" href="#races">
              Browse races <i className="fa-solid fa-arrow-down"></i>
            </a>
            <Link to="/race-day-calculator/custom" className="btn-outline">
              Build a generic plan <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </section>

        {/* FEATURED RACE */}
        <FeaturedRace race={FEATURED_RACE} />

        {/* ALL RACES */}
        <section id="races" className="rl-wrap">
          <h2 className="rl-h2">All races</h2>
          <p className="rl-sub">
            Filter by distance, region, or month. Tap any available race to open its calculator.
          </p>

          <div className="rl-filters">
            <div className="rl-search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by race name or city"
              />
            </div>
            <select className="rl-sel" value={distance} onChange={(e) => setDistance(e.target.value)}>
              <option value="all">All distances</option>
              {distanceOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select className="rl-sel" value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="all">All regions</option>
              {regionOptions.map((rg) => (
                <option key={rg} value={rg}>
                  {rg}
                </option>
              ))}
            </select>
            <select className="rl-sel" value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="all">Any month</option>
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select className="rl-sel" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              <option value="upcoming">Sort · upcoming</option>
              <option value="available">Sort · available first</option>
              <option value="az">Sort · A → Z</option>
              <option value="aid">Sort · most aid</option>
            </select>
            <span className="rl-count">
              {filtered.length} of {RACES.length} race{RACES.length === 1 ? "" : "s"}
            </span>
            <button className="rl-clear" onClick={clearFilters} disabled={!filtersActive}>
              <i className="fa-solid fa-xmark"></i> Clear filters
            </button>
          </div>

          {groups.length === 0 ? (
            <div className="rl-empty">No races match those filters yet — try clearing them.</div>
          ) : (
            groups.map((g) => {
              const aidSum = g.races.reduce((n, r) => n + r.aidStations, 0);
              return (
                <div key={g.region} className="rl-group">
                  <div className="rl-region">
                    <div className="rl-region-name">
                      <span className="flag">{REGION_FLAG[g.region as RaceRegion]}</span>
                      {g.region}
                      <span className="rl-chip count">
                        {g.races.length} race{g.races.length === 1 ? "" : "s"}
                      </span>
                    </div>
                    <div className="rl-region-aid">{aidSum} aid stations mapped</div>
                  </div>
                  <div className="rl-rows">
                    {g.races.map((r) => (
                      <RaceRow key={r.slug} race={r} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* GENERIC CTA */}
        <Link to="/race-day-calculator/custom" className="rl-cta">
          <div className="rl-cta-ico">
            <i className="fa-solid fa-route"></i>
          </div>
          <div className="rl-cta-body">
            <h3>Don't see your race?</h3>
            <p>Build a generic course-aware plan with your own pace, distance, and forecast — no aid-station data required.</p>
          </div>
          <span className="rl-cta-btn">
            Build a generic plan <i className="fa-solid fa-arrow-right"></i>
          </span>
        </Link>

        {/* Trust line */}
        <div className="rl-trust">
          <i className="fa-solid fa-circle-check"></i>
          Course data verified with race organizers
        </div>
      </div>
    </div>
  );
}
