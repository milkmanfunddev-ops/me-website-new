/* Course map — a real interactive Leaflet map of the actual Rocket City
 * Marathon route through Huntsville (full + half), on clean Carto tiles, with
 * the real route line, aid stations, mile markers, and start/finish. Leaflet
 * is loaded only on the client (dynamic import in an effect) so SSR stays clean.
 * Elevation tab uses the real sampled-terrain profile. */

import { useEffect, useMemo, useRef, useState } from "react";
import type { CircleMarker, Layer, Map as LeafletMap, Polyline } from "leaflet";
import {
  AID_STATIONS_FULL,
  AID_STATIONS_HALF,
  FULL_BOUNDS,
  FULL_ELEVATION,
  FULL_MILE_MARKERS,
  FULL_ROUTE,
  HALF_BOUNDS,
  HALF_ELEVATION,
  HALF_MILE_MARKERS,
  HALF_ROUTE,
  TOTAL_ASCENT_FULL,
  TOTAL_ASCENT_HALF,
  type AidStationGeo,
  type ElevationPoint,
} from "@/lib/race-plan/course";
import type { Hydration, PaceUnit, RaceType } from "@/lib/race-plan/types";

const ORANGE = "#F78B14";
const ELECTROLYTE = "#1CF9CF";
const BLACKBERRY = "#381633";
const CREAM = "#F8F6EB";

interface CourseMapProps {
  raceType: RaceType;
  paceUnit: PaceUnit;
  hydration: Hydration;
}

export function CourseMap({ raceType, paceUnit, hydration }: CourseMapProps) {
  const [view, setView] = useState<"aid" | "mile" | "elev">("aid");

  const isHalf = raceType === "half";
  const route = isHalf ? HALF_ROUTE : FULL_ROUTE;
  const bounds = isHalf ? HALF_BOUNDS : FULL_BOUNDS;
  const aids = isHalf ? AID_STATIONS_HALF : AID_STATIONS_FULL;
  const mileMarkers = isHalf ? HALF_MILE_MARKERS : FULL_MILE_MARKERS;
  const elevProfile = isHalf ? HALF_ELEVATION : FULL_ELEVATION;
  const ascent = isHalf ? TOTAL_ASCENT_HALF : TOTAL_ASCENT_FULL;
  const distMi = isHalf ? 13.1 : 26.2;

  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const baseLayers = useRef<Layer[]>([]);
  const overlayLayers = useRef<Layer[]>([]);

  // Build / update the Leaflet map whenever the course or marker view changes.
  useEffect(() => {
    // Elevation view: the map div isn't rendered — tear the instance down.
    if (view === "elev") {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        baseLayers.current = [];
        overlayLayers.current = [];
      }
      return;
    }

    let cancelled = false;
    void (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapEl.current) return;

      if (!mapRef.current) {
        mapRef.current = L.map(mapEl.current, {
          zoomControl: true,
          scrollWheelZoom: false,
          attributionControl: true,
        });
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            subdomains: "abcd",
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          },
        ).addTo(mapRef.current);
      }
      const map = mapRef.current;

      // Clear previous route + markers.
      baseLayers.current.forEach((l) => map.removeLayer(l));
      overlayLayers.current.forEach((l) => map.removeLayer(l));
      baseLayers.current = [];
      overlayLayers.current = [];

      // Route line.
      const poly: Polyline = L.polyline(route, {
        color: ORANGE,
        weight: 4,
        opacity: 0.95,
        lineJoin: "round",
        lineCap: "round",
      }).addTo(map);
      baseLayers.current.push(poly);

      // Start + finish.
      const start: CircleMarker = L.circleMarker(route[0], {
        radius: 7,
        color: CREAM,
        weight: 2,
        fillColor: ORANGE,
        fillOpacity: 1,
      })
        .bindTooltip("START", { permanent: true, direction: "left", className: "rcm-ep-lbl" })
        .addTo(map);
      const finish: CircleMarker = L.circleMarker(route[route.length - 1], {
        radius: 7,
        color: CREAM,
        weight: 2,
        fillColor: BLACKBERRY,
        fillOpacity: 1,
      })
        .bindTooltip("FINISH", { permanent: true, direction: "right", className: "rcm-ep-lbl" })
        .addTo(map);
      baseLayers.current.push(start, finish);

      if (view === "aid") {
        const dim = hydration === "own";
        aids.forEach((a) => {
          const m = L.circleMarker([a.lat, a.lng], {
            radius: 8,
            color: BLACKBERRY,
            weight: 2,
            fillColor: ELECTROLYTE,
            fillOpacity: dim ? 0.4 : 1,
          })
            .bindTooltip(
              `<b>#${a.num} ${a.name}</b><br>Mile ${a.mi.toFixed(1)} · ${a.offers.join(" · ")}`,
              { direction: "top", offset: [0, -6] },
            )
            .addTo(map);
          overlayLayers.current.push(m);
        });
      } else {
        mileMarkers.forEach((mk) => {
          const big = mk.mile % 5 === 0;
          const m = L.circleMarker([mk.lat, mk.lng], {
            radius: big ? 5 : 4,
            color: BLACKBERRY,
            weight: 1.5,
            fillColor: CREAM,
            fillOpacity: 1,
          });
          if (big) {
            m.bindTooltip(`Mile ${mk.mile}`, {
              permanent: true,
              direction: "top",
              className: "rcm-mile-lbl",
            });
          } else {
            m.bindTooltip(`Mile ${mk.mile}`, { direction: "top" });
          }
          m.addTo(map);
          overlayLayers.current.push(m);
        });
      }

      map.fitBounds(bounds, { padding: [26, 26] });
      // Tiles can mis-measure before layout settles.
      setTimeout(() => map.invalidateSize(), 0);
    })();

    return () => {
      cancelled = true;
    };
  }, [raceType, view, hydration, route, bounds, aids, mileMarkers]);

  // Destroy the map when the component unmounts.
  useEffect(
    () => () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    },
    [],
  );

  return (
    <div className="map-card">
      <div className="map-head">
        <div>
          <h3>Course · {isHalf ? "Rocket City Half" : "Rocket City Marathon"}</h3>
          <div className="sub">
            {isHalf
              ? "Downtown Huntsville → west to the U.S. Space & Rocket Center → back to the finish"
              : "Downtown Huntsville → Five Points → Space & Rocket Center → Botanical Garden → finish"}
          </div>
        </div>
        <div className="map-toggle" role="tablist">
          <button className={view === "aid" ? "on" : ""} onClick={() => setView("aid")}>
            <i className="fa-solid fa-droplet" style={{ marginRight: 6 }}></i>Aid stations
          </button>
          <button className={view === "mile" ? "on" : ""} onClick={() => setView("mile")}>
            <i className="fa-solid fa-flag-checkered" style={{ marginRight: 6 }}></i>Mile markers
          </button>
          <button className={view === "elev" ? "on" : ""} onClick={() => setView("elev")}>
            <i className="fa-solid fa-mountain" style={{ marginRight: 6 }}></i>Elevation
          </button>
        </div>
      </div>

      <div className="map-stage">
        {view !== "elev" ? (
          <>
            <div ref={mapEl} className="rcm-map" />

            <div className="map-overlay-stats">
              <div className="map-stat">
                <span className="v">
                  {isHalf ? "13.1" : "26.2"}
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
                <span className="v">{aids.length}</span>
                <span className="l">Aid stations</span>
              </div>
            </div>

            <div className="map-legend">
              <div className="row">
                <svg width="22" height="6">
                  <line x1="0" y1="3" x2="22" y2="3" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
                </svg>
                <span>Course</span>
              </div>
              {view === "aid" && (
                <div className="row">
                  <svg width="14" height="14">
                    <circle cx="7" cy="7" r="6" fill={ELECTROLYTE} stroke={CREAM} strokeWidth="1" />
                  </svg>
                  <span>Aid station</span>
                </div>
              )}
              {view === "mile" && (
                <div className="row">
                  <svg width="14" height="14">
                    <circle cx="7" cy="7" r="4" fill={CREAM} stroke={BLACKBERRY} strokeWidth="1" />
                  </svg>
                  <span>Mile marker</span>
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
            stations={aids}
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
  stations: AidStationGeo[];
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
            stroke={ELECTROLYTE}
            strokeWidth="2"
          />
          <circle cx={xFor(s.mi)} cy={padT + innerH + 14} r="3" fill={ELECTROLYTE} />
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
