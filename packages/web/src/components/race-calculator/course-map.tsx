/* Course map — stylized SVG of the Rocket City Marathon route through
 * Huntsville, plus an elevation profile. Ported from the prototype.
 * Path-based marker positions are measured in the browser (an effect),
 * so the SVG renders static on the server and hydrates with markers. */

import { useEffect, useMemo, useState } from "react";
import {
  AID_STATIONS_FULL,
  AID_STATIONS_HALF,
  ELEVATION_FULL,
  ELEVATION_HALF,
  FULL_COURSE_PATH,
  HALF_COURSE_PATH,
  pointAt,
  TOTAL_ASCENT_FULL,
  TOTAL_ASCENT_HALF,
  type ElevationPoint,
  type PathPoint,
} from "@/lib/race-plan/course";
import type { AidStation, Hydration, PaceUnit, RaceType } from "@/lib/race-plan/types";

interface PositionedStation extends AidStation {
  x: number;
  y: number;
}

interface MileMarker {
  label: string;
  x: number;
  y: number;
}

interface CourseMapProps {
  raceType: RaceType;
  paceUnit: PaceUnit;
  hydration: Hydration;
}

export function CourseMap({ raceType, paceUnit, hydration }: CourseMapProps) {
  const [view, setView] = useState<"aid" | "mile" | "elev">("aid");
  const [hover, setHover] = useState<PositionedStation | null>(null);

  const courseD = raceType === "half" ? HALF_COURSE_PATH : FULL_COURSE_PATH;
  const distMi = raceType === "half" ? 13.1 : 26.2;
  const distKm = raceType === "half" ? 21.1 : 42.2;
  const stations = raceType === "half" ? AID_STATIONS_HALF : AID_STATIONS_FULL;
  const elevProfile = raceType === "half" ? ELEVATION_HALF : ELEVATION_FULL;
  const ascent = raceType === "half" ? TOTAL_ASCENT_HALF : TOTAL_ASCENT_FULL;

  const [aidPositions, setAidPositions] = useState<PositionedStation[]>([]);
  const [mileMarkers, setMileMarkers] = useState<MileMarker[]>([]);
  const [endpoints, setEndpoints] = useState<{ start: PathPoint; finish: PathPoint }>(
    { start: { x: 0, y: 0 }, finish: { x: 0, y: 0 } },
  );

  // Measure path-based positions on the client whenever the course changes.
  useEffect(() => {
    setAidPositions(
      stations.map((s) => {
        const t = Math.min(0.998, s.mi / distMi);
        const pt = pointAt(courseD, t);
        return { ...s, x: pt.x, y: pt.y };
      }),
    );

    const markers: MileMarker[] = [];
    if (paceUnit === "mi") {
      for (let mi = 5; mi < distMi; mi += 5) {
        const pt = pointAt(courseD, mi / distMi);
        markers.push({ label: `${mi} mi`, x: pt.x, y: pt.y });
      }
    } else {
      for (let km = 5; km < distKm; km += 5) {
        const pt = pointAt(courseD, km / distKm);
        markers.push({ label: `${km} km`, x: pt.x, y: pt.y });
      }
    }
    setMileMarkers(markers);

    setEndpoints({ start: pointAt(courseD, 0), finish: pointAt(courseD, 0.999) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raceType, paceUnit]);

  return (
    <div className="map-card">
      <div className="map-head">
        <div>
          <h3>Course · {raceType === "half" ? "Rocket City Half" : "Rocket City Marathon"}</h3>
          <div className="sub">
            Downtown Huntsville → Twickenham →{" "}
            {raceType === "half" ? "back to start" : "Monte Sano foothills → Hays Farm → finish"}
          </div>
        </div>
        <div className="map-toggle" role="tablist">
          <button className={view === "aid" ? "on" : ""} onClick={() => setView("aid")}>
            <i className="fa-solid fa-droplet" style={{ marginRight: 6 }}></i>Aid stations
          </button>
          <button className={view === "mile" ? "on" : ""} onClick={() => setView("mile")}>
            <i className="fa-solid fa-flag-checkered" style={{ marginRight: 6 }}></i>
            {paceUnit === "mi" ? "Mile" : "KM"} markers
          </button>
          <button className={view === "elev" ? "on" : ""} onClick={() => setView("elev")}>
            <i className="fa-solid fa-mountain" style={{ marginRight: 6 }}></i>Elevation
          </button>
        </div>
      </div>

      <div className="map-stage">
        {view !== "elev" ? (
          <>
            <svg className="map-svg" viewBox="0 0 1100 440" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" className="map-grid" />
                </pattern>
              </defs>
              <rect width="1100" height="440" fill="url(#grid)" />

              {/* River — Tennessee River loosely */}
              <path
                className="map-water"
                d="M 0 410 C 200 380, 400 425, 600 410 C 800 395, 950 420, 1100 405 L 1100 440 L 0 440 Z"
              />
              <text x="80" y="430" className="map-label">
                Tennessee River
              </text>

              {/* Parks */}
              <path
                className="map-park"
                d="M 280 140 C 320 130, 380 130, 410 150 C 430 165, 430 195, 410 210 C 380 225, 320 225, 290 215 C 260 200, 250 165, 280 140 Z"
              />
              <text x="310" y="180" className="map-label">
                Big Spring
              </text>
              <path
                className="map-park"
                d="M 870 280 C 905 270, 945 280, 960 300 C 970 320, 960 345, 935 350 C 905 355, 880 340, 870 320 C 865 305, 868 290, 870 280 Z"
              />
              <text x="885" y="320" className="map-label">
                Hampton Cove
              </text>

              {/* Roads */}
              <path className="map-road" d="M 0 200 C 200 195, 400 215, 600 200 C 800 185, 950 210, 1100 195" />
              <path className="map-road" d="M 0 320 C 200 315, 400 325, 600 315 C 800 305, 950 320, 1100 310" />
              <path className="map-road" d="M 300 0 C 305 100, 295 200, 310 300 C 320 380, 305 440, 305 440" />
              <path className="map-road" d="M 720 0 C 725 90, 715 200, 730 300 C 745 380, 740 440, 740 440" />
              <path className="map-road-thin" d="M 0 100 C 200 95, 400 115, 600 100 C 800 85, 950 110, 1100 95" />
              <path className="map-road-thin" d="M 150 0 C 155 100, 145 200, 160 300 C 170 380, 155 440, 155 440" />
              <path className="map-road-thin" d="M 500 0 C 505 100, 495 200, 510 300 C 520 380, 505 440, 505 440" />
              <path className="map-road-thin" d="M 900 0 C 905 100, 895 200, 910 300 C 920 380, 905 440, 905 440" />
              <path className="map-road-thin" d="M 0 60 L 1100 60" />
              <path className="map-road-thin" d="M 0 380 L 1100 380" />

              {/* District labels */}
              <text x="40" y="40" className="map-label">
                Downtown Huntsville
              </text>
              <text x="540" y="40" className="map-label">
                Twickenham
              </text>
              <text x="820" y="40" className="map-label">
                Five Points
              </text>
              <text x="980" y="160" className="map-label">
                Monte Sano
              </text>

              {/* Course glow + main + dash */}
              <path className="map-course-glow" d={courseD} />
              <path className="map-course" d={courseD} />
              <path className="map-course-dash" d={courseD} />

              {/* Mile / KM markers */}
              {view === "mile" &&
                mileMarkers.map((m, i) => (
                  <g key={i}>
                    <circle cx={m.x} cy={m.y} r="6" className="mile-dot" />
                    <circle cx={m.x} cy={m.y} r="4" fill="var(--me-blackberry)" />
                    <text x={m.x} y={m.y - 12} textAnchor="middle" className="mile-marker">
                      {m.label}
                    </text>
                  </g>
                ))}

              {/* Aid station pins */}
              {view === "aid" &&
                aidPositions.map((s) => {
                  const used = hydration !== "own";
                  return (
                    <g
                      key={s.num}
                      className="aid-marker"
                      onMouseEnter={() => setHover(s)}
                      onMouseLeave={() => setHover(null)}
                    >
                      <circle
                        cx={s.x}
                        cy={s.y}
                        r="13"
                        fill={used ? "var(--me-electrolyte)" : "color-mix(in srgb, var(--me-electrolyte) 35%, transparent)"}
                        stroke="var(--me-blackberry)"
                        strokeWidth="1.5"
                      />
                      <text x={s.x} y={s.y + 3} textAnchor="middle" className="pin-num">
                        {s.num}
                      </text>
                    </g>
                  );
                })}

              {/* Start marker */}
              <g className="start-marker" transform={`translate(${endpoints.start.x}, ${endpoints.start.y})`}>
                <rect x="-22" y="-30" width="44" height="22" rx="6" />
                <polygon points="0,-8 -6,-2 6,-2" fill="var(--me-orange)" />
                <text textAnchor="middle" y="-15">
                  START
                </text>
                <circle r="5" fill="var(--me-blackberry)" />
                <circle r="3" fill="var(--me-orange)" />
              </g>

              {/* Finish marker — flag */}
              <g className="finish-marker" transform={`translate(${endpoints.finish.x}, ${endpoints.finish.y})`}>
                <line x1="0" y1="0" x2="0" y2="-26" stroke="var(--me-cream)" strokeWidth="1.5" />
                <rect className="flag" x="0" y="-26" width="22" height="14" />
                <rect className="stripe" x="0" y="-26" width="5.5" height="3.5" />
                <rect className="stripe" x="11" y="-26" width="5.5" height="3.5" />
                <rect className="stripe" x="5.5" y="-22.5" width="5.5" height="3.5" />
                <rect className="stripe" x="16.5" y="-22.5" width="5.5" height="3.5" />
                <rect className="stripe" x="0" y="-19" width="5.5" height="3.5" />
                <rect className="stripe" x="11" y="-19" width="5.5" height="3.5" />
                <text textAnchor="middle" y="14">
                  FINISH
                </text>
                <circle r="5" fill="var(--me-blackberry)" />
                <circle r="3" fill="var(--me-cream)" />
              </g>
            </svg>

            {/* Aid tooltip */}
            {hover && (
              <div
                className="aid-tip"
                style={{
                  left: `${(hover.x / 1100) * 100}%`,
                  top: `${(hover.y / 440) * 100}%`,
                }}
              >
                <div className="h">
                  <span>
                    {hover.num}. {hover.name}
                  </span>
                  <span className="pill">{hover.mi.toFixed(1)} mi</span>
                </div>
                <div className="desc">
                  {(hover.mi * 1.609).toFixed(1)} km · approx. {Math.round(hover.mi * 9)} min in
                </div>
                <div className="offers">
                  {hover.offers.map((o, i) => (
                    <span key={i} className={o === "gels" || o === "chews" ? "your" : ""}>
                      {o}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Overlay: course stats */}
            <div className="map-overlay-stats">
              <div className="map-stat">
                <span className="v">
                  {raceType === "half" ? "13.1" : "26.2"}
                  <span style={{ fontSize: 11, opacity: 0.6, marginLeft: 3 }}>mi</span>
                </span>
                <span className="l">Distance</span>
              </div>
              <div className="map-stat">
                <span className="v">
                  {ascent}
                  <span style={{ fontSize: 11, opacity: 0.6, marginLeft: 3 }}>ft</span>
                </span>
                <span className="l">Total ascent</span>
              </div>
              <div className="map-stat">
                <span className="v">{stations.length}</span>
                <span className="l">Aid stations</span>
              </div>
            </div>

            <div className="map-legend">
              <div className="row">
                <svg width="22" height="6">
                  <line x1="0" y1="3" x2="22" y2="3" stroke="var(--me-orange)" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <span>Course</span>
              </div>
              {view === "aid" && (
                <div className="row">
                  <svg width="14" height="14">
                    <circle cx="7" cy="7" r="6" fill="var(--me-electrolyte)" stroke="var(--me-cream)" strokeWidth="1" />
                  </svg>
                  <span>Aid station</span>
                </div>
              )}
              {view === "mile" && (
                <div className="row">
                  <svg width="14" height="14">
                    <circle cx="7" cy="7" r="4" fill="var(--me-cream)" />
                  </svg>
                  <span>Distance marker</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <ElevationProfile
            profile={elevProfile}
            distMi={distMi}
            paceUnit={paceUnit}
            ascent={ascent}
            stations={stations}
          />
        )}
      </div>
    </div>
  );
}

interface ElevationProfileProps {
  profile: ElevationPoint[];
  distMi: number;
  paceUnit: PaceUnit;
  ascent: number;
  stations: AidStation[];
}

function ElevationProfile({ profile, distMi, paceUnit, ascent, stations }: ElevationProfileProps) {
  const W = 1100,
    H = 440;
  const padL = 60,
    padR = 30,
    padT = 50,
    padB = 60;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const minFt = Math.min(...profile.map((p) => p.ft)) - 5;
  const maxFt = Math.max(...profile.map((p) => p.ft)) + 10;
  const xFor = (mi: number) => padL + (mi / distMi) * innerW;
  const yFor = (ft: number) => padT + innerH - ((ft - minFt) / (maxFt - minFt)) * innerH;

  const linePath = useMemo(
    () =>
      profile
        .map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(p.mi).toFixed(1)} ${yFor(p.ft).toFixed(1)}`)
        .join(" "),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile, distMi],
  );
  const fillPath = `${linePath} L ${xFor(distMi)} ${padT + innerH} L ${padL} ${padT + innerH} Z`;

  const ticks: { mi: number; lbl: string }[] = [];
  if (paceUnit === "mi") {
    for (let mi = 0; mi <= distMi; mi += 5) ticks.push({ mi, lbl: `${mi}mi` });
    ticks.push({ mi: distMi, lbl: `${distMi}` });
  } else {
    const distKm = distMi * 1.609344;
    for (let km = 0; km <= distKm; km += 5) ticks.push({ mi: km / 1.609344, lbl: `${km}km` });
  }
  const seen = new Set<string>();
  const tickFiltered = ticks.filter((t) => {
    const k = t.mi.toFixed(1);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return (
    <svg className="elev-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      {[minFt, Math.round((minFt + maxFt) / 2), maxFt].map((ft, i) => (
        <g key={i} className="elev-tick">
          <line x1={padL} y1={yFor(ft)} x2={W - padR} y2={yFor(ft)} />
          <text x={padL - 8} y={yFor(ft) + 4} textAnchor="end">
            {ft} ft
          </text>
        </g>
      ))}

      <path className="elev-fill" d={fillPath} />
      <path className="elev-line" d={linePath} />

      {stations.map((s) => (
        <g key={s.num}>
          <line
            x1={xFor(s.mi)}
            y1={padT + innerH}
            x2={xFor(s.mi)}
            y2={padT + innerH + 8}
            stroke="var(--me-electrolyte)"
            strokeWidth="2"
          />
          <circle cx={xFor(s.mi)} cy={padT + innerH + 14} r="3" fill="var(--me-electrolyte)" />
        </g>
      ))}

      {tickFiltered.map((t, i) => (
        <g key={i} className="elev-tick">
          <line
            x1={xFor(t.mi)}
            y1={padT + innerH}
            x2={xFor(t.mi)}
            y2={padT + innerH + 4}
            stroke="color-mix(in srgb, var(--me-cream) 25%, transparent)"
          />
          <text x={xFor(t.mi)} y={padT + innerH + 26} textAnchor="middle">
            {t.lbl}
          </text>
        </g>
      ))}

      <text x={padL} y={padT - 20} className="elev-label">
        Course elevation profile · {ascent} ft total ascent
      </text>
    </svg>
  );
}
