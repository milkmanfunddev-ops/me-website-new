/* Generated plan output — timeline + aid table + breakfast + share.
 * Ported from the prototype. */

import { useEffect, useRef, useState } from "react";
import { fmtClock } from "@/lib/race-plan/engine";
import type { CalculatorState, Plan, PlanEvent } from "@/lib/race-plan/types";

interface PlanOutputProps {
  plan: Plan;
  state: CalculatorState;
}

export function PlanOutput({ plan, state }: PlanOutputProps) {
  const [view, setView] = useState<"timeline" | "table">("timeline");
  const [copied, setCopied] = useState(false);

  function copyPlan() {
    const lines: string[] = [];
    lines.push(`ROCKET CITY ${state.type === "half" ? "HALF" : "MARATHON"} 2026 — RACE PLAN`);
    lines.push(`Pace: ${state.pace} ${state.paceUnit === "mi" ? "/mi" : "/km"} · Finish: ${fmtClock(plan.finish)}`);
    lines.push(`Conditions: ${plan.conditions} · Carbs: ${state.carbsPerHr} g/h · Fluid: ${plan.fluidPh} ml/h`);
    lines.push("");
    lines.push("PRE-RACE (3 hr out)");
    lines.push(`  ~${plan.bfCarbs}g carbs · low fiber breakfast`);
    lines.push("");
    lines.push("IN-RACE");
    plan.aidActions.forEach((a) => {
      if (a.action !== "skip") {
        lines.push(
          `  Mi ${a.mi.toFixed(1)} · ${a.name} · ${a.action}` +
            (a.carbsHere ? ` · ${a.carbsHere}g carbs` : "") +
            (a.fluidHere ? ` · ${a.fluidHere}ml fluid` : "") +
            (a.sodiumHere ? ` · ${a.sodiumHere}mg sodium` : ""),
        );
      }
    });
    lines.push("");
    lines.push(`TOTAL: ${plan.carbsTotal}g carbs · ${plan.fluidTotal}ml fluid · ${plan.sodTotal}mg sodium`);
    navigator.clipboard?.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <div className="plan-wrap" id="plan-output">
      <div className="plan-head">
        <div>
          <h2>Your race plan</h2>
          <p className="sub">
            Built for {plan.conditions} conditions at {state.pace} {state.paceUnit === "mi" ? "/mi" : "/km"} pace. Every
            action below is slotted to a real Rocket City aid station so you don't fumble during the race.
          </p>
        </div>
        <div className="view-toggle">
          <button className={view === "timeline" ? "on" : ""} onClick={() => setView("timeline")}>
            <i className="fa-solid fa-timeline" style={{ marginRight: 6 }}></i>Timeline
          </button>
          <button className={view === "table" ? "on" : ""} onClick={() => setView("table")}>
            <i className="fa-solid fa-table-list" style={{ marginRight: 6 }}></i>Aid table
          </button>
        </div>
      </div>

      {view === "timeline" ? <Timeline plan={plan} state={state} /> : <AidTable plan={plan} />}

      <div className="plan-sub-grid">
        <div className="breakfast">
          <div>
            <h3>Pre-race breakfast</h3>
            <div className="when">3 hr before gun · low fiber · low fat · sip water</div>
            <div className="items">
              <div className="it">
                <span>Bagel + honey + jam</span>
                <span className="g">75 g</span>
              </div>
              <div className="it">
                <span>Banana, ripe</span>
                <span className="g">25 g</span>
              </div>
              <div className="it">
                <span>Sports drink, 16 oz</span>
                <span className="g">20 g</span>
              </div>
              <div className="it">
                <span>Coffee, black</span>
                <span className="g">0 g</span>
              </div>
            </div>
            <a href="#mkt" className="link">
              <i className="fa-solid fa-arrow-right"></i> See full breakfast options in the app
            </a>
          </div>
          <div className="total">
            <div className="v">{plan.bfCarbs}</div>
            <div className="l">g carbs · target</div>
          </div>
        </div>

        <div className="share-card">
          <h3>Take it with you</h3>
          <div className="desc">
            Copy a printable summary, or open this plan in the Mealvana app to get reminders and in-race adjustments.
          </div>
          <button className="b1" onClick={copyPlan}>
            <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`}></i>
            {copied ? "Copied to clipboard" : "Copy plan as text"}
          </button>
          <button className="b2">
            <i className="fa-solid fa-mobile-screen"></i>
            Open in Mealvana app
          </button>
          {copied && (
            <div className="copied">
              <i className="fa-solid fa-check"></i> Plain-text summary copied — paste it anywhere.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface PlacedEvent extends PlanEvent {
  pct: number;
  x: number;
  side: "up" | "down";
  lane: number;
}

function Timeline({ plan, state }: { plan: Plan; state: CalculatorState }) {
  const events = plan.planEvents;
  const totalSec = plan.finish;
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(900);

  useEffect(() => {
    function measure() {
      if (ref.current) {
        // inner width = card width - 2 * padding (28px each)
        setWidth(Math.max(400, ref.current.offsetWidth - 56));
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Tick positions every 30 min (or 15 min for shorter races)
  const tickInterval = totalSec < 2.5 * 3600 ? 15 * 60 : 30 * 60;
  const ticks: { t: number; pct: number }[] = [];
  for (let t = 0; t <= totalSec; t += tickInterval) {
    ticks.push({ t, pct: t / totalSec });
  }

  // Assign lanes — 2 above, 2 below. Greedy alternating placement.
  const LANES_PER_SIDE = 2;
  const LABEL_WIDTH = 78;
  const LABEL_GAP = 6;
  const lanes: Record<string, { lo: number; hi: number }[]> = {};
  function place(x: number, side: string, lane: number) {
    const k = `${side}_${lane}`;
    const arr = lanes[k] || (lanes[k] = []);
    const lo = x - LABEL_WIDTH / 2,
      hi = x + LABEL_WIDTH / 2 + LABEL_GAP;
    for (const r of arr) if (lo < r.hi && hi > r.lo) return false;
    arr.push({ lo, hi });
    return true;
  }
  const placed: PlacedEvent[] = events.map((e, idx) => {
    const pct = e.timeSec / totalSec;
    const x = pct * width;
    let chosen: { side: "up" | "down"; lane: number } | null = null;
    const order: { side: "up" | "down"; lane: number }[] = [];
    for (let l = 0; l < LANES_PER_SIDE; l++) {
      order.push({ side: "down", lane: l });
      order.push({ side: "up", lane: l });
    }
    for (const o of order) {
      if (place(x, o.side, o.lane)) {
        chosen = o;
        break;
      }
    }
    if (!chosen) chosen = { side: idx % 2 ? "up" : "down", lane: LANES_PER_SIDE };
    return { ...e, pct, x, side: chosen.side, lane: chosen.lane };
  });

  const LANE_H = 56;
  const STEM_BASE = 18;
  function yFor(side: string, lane: number) {
    const sign = side === "down" ? 1 : -1;
    return sign * (STEM_BASE + lane * LANE_H);
  }

  return (
    <div className="timeline-card" ref={ref}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--me-orange)" }}>
            Gun to tape
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, lineHeight: 1.1, marginTop: 4 }}>
            {plan.planEvents.length} fueling actions · {state.carbsPerHr}g carbs/hr
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "baseline", flexWrap: "wrap" }}>
          <div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>0:00</span>{" "}
            <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--me-blackberry-muted)", textTransform: "uppercase", letterSpacing: 1 }}>
              gun
            </span>
          </div>
          <div style={{ width: 1, height: 18, background: "color-mix(in srgb, var(--me-blackberry) 18%, transparent)" }}></div>
          <div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>{fmtClock(plan.finish)}</span>{" "}
            <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--me-blackberry-muted)", textTransform: "uppercase", letterSpacing: 1 }}>
              finish
            </span>
          </div>
        </div>
      </div>

      <div className="tl-axis">
        <div className="tl-track"></div>
        <div className="tl-fill" style={{ width: "100%" }}></div>
        {ticks.map((t, i) => (
          <div key={`t${i}`}>
            <div className="tl-tick" style={{ left: `${t.pct * 100}%` }}></div>
            <div className="tl-tick-lbl" style={{ left: `${t.pct * 100}%` }}>
              {fmtClock(t.t)}
            </div>
          </div>
        ))}
        {placed.map((e, i) => {
          const icon = e.type === "salt" ? "fa-shaker" : e.type === "fuel" ? "fa-bolt" : "fa-droplet";
          const y = yFor(e.side, e.lane);
          const stemHeight = Math.abs(y) - 14;
          return (
            <div key={`e${i}`} className={`tl-event ${e.type}`} style={{ left: `${Math.min(99, Math.max(1, e.pct * 100))}%` }}>
              <div
                className="stem"
                style={{
                  top: e.side === "down" ? "14px" : "auto",
                  bottom: e.side === "up" ? "14px" : "auto",
                  height: `${stemHeight}px`,
                }}
              ></div>
              <div className="dot">
                <i className={`fa-solid ${icon}`}></i>
              </div>
              <div
                className="lbl"
                style={{
                  top: e.side === "down" ? `${Math.abs(y) + 6}px` : "auto",
                  bottom: e.side === "up" ? `${Math.abs(y) + 6}px` : "auto",
                }}
              >
                <span className="b">Mi {e.mi.toFixed(1)}</span>
                <span className="m">{e.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="tl-legend">
        <div className="item">
          <span className="sw" style={{ background: "var(--me-orange)" }}></span> Fuel (gel · chew)
        </div>
        <div className="item">
          <span className="sw" style={{ background: "var(--me-electrolyte)" }}></span> Fluid (drink mix · water)
        </div>
        {state.saltiness !== "normal" && (
          <div className="item">
            <span className="sw" style={{ background: "var(--me-dragonfruit)" }}></span> Sodium (salt cap)
          </div>
        )}
        <div className="item" style={{ marginLeft: "auto" }}>
          <i className="fa-solid fa-circle-info" style={{ color: "var(--me-blackberry-muted)" }}></i>
          <span style={{ color: "var(--me-blackberry-muted)" }}>
            Switch to <strong>Aid table</strong> for the full per-station breakdown.
          </span>
        </div>
      </div>
    </div>
  );
}

function AidTable({ plan }: { plan: Plan }) {
  return (
    <div className="aid-table">
      <table>
        <thead>
          <tr>
            <th style={{ width: 48 }}>#</th>
            <th>Aid station</th>
            <th>Mile</th>
            <th>Approx. time</th>
            <th>Fluid</th>
            <th>Sodium</th>
            <th>Carb action</th>
          </tr>
        </thead>
        <tbody>
          {plan.aidActions.map((a) => (
            <tr key={a.num}>
              <td>
                <span className="ix">{a.num}</span>
              </td>
              <td>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14 }}>{a.name}</div>
                <div style={{ fontFamily: "var(--font-activity)", fontSize: 11, letterSpacing: 0.4, color: "var(--me-blackberry-muted)", marginTop: 2 }}>
                  {(a.offers || []).join(" · ")}
                </div>
              </td>
              <td>
                <span className="num">{a.mi.toFixed(1)}</span>
                <span className="un">mi</span>
              </td>
              <td>
                <span className="num">{fmtClock(a.timeSec)}</span>
              </td>
              <td>
                {a.fluidHere ? (
                  <>
                    <span className="num">{a.fluidHere}</span>
                    <span className="un">ml</span>
                  </>
                ) : (
                  <span style={{ color: "var(--me-blackberry-muted)" }}>—</span>
                )}
              </td>
              <td>
                {a.sodiumHere ? (
                  <>
                    <span className="num">{a.sodiumHere}</span>
                    <span className="un">mg</span>
                  </>
                ) : (
                  <span style={{ color: "var(--me-blackberry-muted)" }}>—</span>
                )}
              </td>
              <td>
                {a.action === "gel" && (
                  <span className="pill gel">
                    <i className="fa-solid fa-bolt"></i>Gel · 25g
                  </span>
                )}
                {a.action === "chew" && (
                  <span className="pill chew">
                    <i className="fa-solid fa-cookie-bite"></i>Chews · 16g
                  </span>
                )}
                {a.action === "drink" && (
                  <span className="pill drink">
                    <i className="fa-solid fa-droplet"></i>Drink mix · 14g
                  </span>
                )}
                {a.action === "skip" && <span className="pill skip">Skip · top off</span>}
              </td>
            </tr>
          ))}
          <tr style={{ background: "var(--me-blackberry)", color: "var(--me-cream)" }}>
            <td colSpan={2} style={{ color: "var(--me-cream)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: 1.2 }}>
              <i className="fa-solid fa-flag-checkered" style={{ color: "var(--me-orange)", marginRight: 8 }}></i>
              Race total
            </td>
            <td style={{ color: "var(--me-cream)" }}>
              <span className="num" style={{ color: "var(--me-cream)" }}>
                {plan.distMi.toFixed(1)}
              </span>
              <span className="un" style={{ color: "color-mix(in srgb, var(--me-cream) 55%, transparent)" }}>
                mi
              </span>
            </td>
            <td style={{ color: "var(--me-cream)" }}>
              <span className="num" style={{ color: "var(--me-orange)" }}>
                {fmtClock(plan.finish)}
              </span>
            </td>
            <td style={{ color: "var(--me-cream)" }}>
              <span className="num" style={{ color: "var(--me-cream)" }}>
                {plan.fluidTotal}
              </span>
              <span className="un" style={{ color: "color-mix(in srgb, var(--me-cream) 55%, transparent)" }}>
                ml
              </span>
            </td>
            <td style={{ color: "var(--me-cream)" }}>
              <span className="num" style={{ color: "var(--me-cream)" }}>
                {plan.sodTotal}
              </span>
              <span className="un" style={{ color: "color-mix(in srgb, var(--me-cream) 55%, transparent)" }}>
                mg
              </span>
            </td>
            <td style={{ color: "var(--me-cream)" }}>
              <span className="num" style={{ color: "var(--me-electrolyte)" }}>
                {plan.carbsTotal}
              </span>
              <span className="un" style={{ color: "color-mix(in srgb, var(--me-cream) 55%, transparent)" }}>
                g carbs
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
