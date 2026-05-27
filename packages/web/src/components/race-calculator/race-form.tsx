/* Race setup form card. Ported from the prototype. Mirrors the original
 * field layout, live finish/recommendation helpers, and copy. */

import {
  carbRec,
  classifyConditions,
  finishTime,
  fmtClock,
  fmtMmss,
  parsePace,
  sodiumRec,
  toC,
  toKg,
} from "@/lib/race-plan/engine";
import type { CalculatorState } from "@/lib/race-plan/types";
import { NumberInput, Segmented } from "./form-controls";

interface RaceFormProps {
  state: CalculatorState;
  set: (patch: Partial<CalculatorState>) => void;
}

export function RaceForm({ state, set }: RaceFormProps) {
  const paceSec = parsePace(state.pace);
  const weightKg = toKg(state.weight, state.weightUnit);
  const tempC = toC(state.temp, state.tempUnit);
  const humidity = parseFloat(state.humidity);
  const conditions = classifyConditions(tempC, humidity);

  const finishSec = finishTime(state.type, paceSec, state.paceUnit);
  const rec = carbRec({
    type: state.type,
    finishSec,
    weightKg,
    conditions,
    saltiness: state.saltiness,
  });

  return (
    <div className="form-card">
      <div className="form-head">
        <div>
          <h2>Race setup</h2>
          <p className="lede">
            Your plan is built from your pace, body, sweat profile, and Huntsville's
            historical December conditions — then snapped to Rocket City's aid stations.
          </p>
        </div>
        <div className="num">04</div>
      </div>

      {/* SECTION 1 — Race */}
      <div className="form-section">
        <div className="label">
          <div className="step-num">01 · Race</div>
          <h4>Distance</h4>
          <div className="hint">Switching reloads the matching course and aid-station set on the map above.</div>
        </div>
        <div className="form-row">
          <Segmented
            value={state.type}
            onChange={(v) => set({ type: v })}
            full
            options={[
              { value: "full", label: "Full marathon", icon: "fa-medal" },
              { value: "half", label: "Half marathon", icon: "fa-flag-checkered" },
            ]}
          />
        </div>
      </div>

      {/* SECTION 2 — Pace & body */}
      <div className="form-section">
        <div className="label">
          <div className="step-num">02 · You</div>
          <h4>Pace &amp; body</h4>
          <div className="hint">Pace and weight feed the carb recommendation below. Your data isn't stored.</div>
        </div>
        <div className="form-row">
          <div className="form-grid-2">
            <div className="fld">
              <label className="fld-lbl">Target pace</label>
              <NumberInput
                value={state.pace}
                onChange={(v) => set({ pace: v })}
                placeholder="8:30"
                unit={state.paceUnit}
                units={[
                  { label: "/km", value: "km" },
                  { label: "/mi", value: "mi" },
                ]}
                onUnitChange={(u) => set({ paceUnit: u })}
                inputMode="text"
              />
            </div>
            <div className="fld">
              <label className="fld-lbl">
                Weight{" "}
                <span style={{ textTransform: "none", fontWeight: 400, opacity: 0.7 }}>(optional)</span>
              </label>
              <NumberInput
                value={state.weight}
                onChange={(v) => set({ weight: v })}
                placeholder="155"
                unit={state.weightUnit}
                units={["kg", "lb"]}
                onUnitChange={(u) => set({ weightUnit: u })}
              />
            </div>
          </div>
          {paceSec && (
            <div className="helper">
              <i className="fa-solid fa-stopwatch" style={{ marginRight: 6, color: "var(--me-blackberry)" }}></i>
              At{" "}
              <strong>
                {fmtMmss(paceSec)} {state.paceUnit === "mi" ? "/mi" : "/km"}
              </strong>
              , projected finish is <strong>{fmtClock(finishSec)}</strong>.
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3 — Conditions */}
      <div className="form-section">
        <div className="label">
          <div className="step-num">03 · Weather</div>
          <h4>Race-day conditions</h4>
          <div className="hint">
            Pre-filled from 10-year Huntsville averages for race weekend. Adjust closer to race day for the forecast.
          </div>
        </div>
        <div className="form-row">
          <div className="cond-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                marginBottom: 14,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                }}
              >
                <i className="fa-solid fa-cloud" style={{ color: "var(--me-orange)", marginRight: 8 }}></i>
                Historical · Dec 13 race morning
              </div>
              <span className={`cond-chip ${conditions}`}>
                <i
                  className={`fa-solid ${
                    conditions === "cool"
                      ? "fa-snowflake"
                      : conditions === "moderate"
                        ? "fa-cloud-sun"
                        : conditions === "warm"
                          ? "fa-sun"
                          : "fa-temperature-high"
                  }`}
                ></i>
                {conditions}
              </span>
            </div>
            <div className="cond-row">
              <div className="cond-stat">
                <div className="l">Avg start temp</div>
                <div className="v">{state.tempUnit === "F" ? "40°" : "4°"}</div>
                <div className="alt">{state.tempUnit === "F" ? "4 °C" : "40 °F"} · 75–85% humidity</div>
              </div>
              <div className="cond-stat">
                <div className="l">Avg finish temp</div>
                <div className="v">{state.tempUnit === "F" ? "52°" : "11°"}</div>
                <div className="alt">~4 hr after start</div>
              </div>
              <div className="cond-stat">
                <div className="l">Wind · sky</div>
                <div className="v">5–10 mph</div>
                <div className="alt">Partly cloudy</div>
              </div>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="fld">
              <label className="fld-lbl">Override temperature</label>
              <NumberInput
                value={state.temp}
                onChange={(v) => set({ temp: v })}
                placeholder="40"
                unit={state.tempUnit}
                units={[
                  { label: "°F", value: "F" },
                  { label: "°C", value: "C" },
                ]}
                onUnitChange={(u) => set({ tempUnit: u })}
              />
            </div>
            <div className="fld">
              <label className="fld-lbl">Override humidity</label>
              <NumberInput value={state.humidity} onChange={(v) => set({ humidity: v })} placeholder="80" suffix="%" />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4 — Sweat profile */}
      <div className="form-section">
        <div className="label">
          <div className="step-num">04 · Body</div>
          <h4>Sweat profile</h4>
          <div className="hint">If you cramp, see white streaks on clothing, or eyes sting — pick a saltier setting.</div>
        </div>
        <div className="form-row">
          <div className="fld">
            <label className="fld-lbl">Sweat rate</label>
            <Segmented
              full
              value={state.sweatRate}
              onChange={(v) => set({ sweatRate: v })}
              options={[
                { value: "light", label: "Light · ~450 ml/hr" },
                { value: "average", label: "Average · ~650 ml/hr" },
                { value: "heavy", label: "Heavy · ~900 ml/hr" },
              ]}
            />
          </div>
          <div className="fld">
            <label className="fld-lbl">Sweat saltiness</label>
            <Segmented
              full
              value={state.saltiness}
              onChange={(v) => set({ saltiness: v })}
              options={[
                { value: "normal", label: "Normal" },
                { value: "salty", label: "Salty" },
                { value: "verysalty", label: "Very salty" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* SECTION 5 — Fueling */}
      <div className="form-section">
        <div className="label">
          <div className="step-num">05 · Fuel</div>
          <h4>Carbs per hour</h4>
          <div className="hint">
            Faster finishers and heavier runners tolerate more; cool conditions allow the high end of your range.
          </div>
        </div>
        <div className="form-row">
          <div className="fld">
            <label className="fld-lbl">Target carbs / hr</label>
            <NumberInput value={state.carbsPerHr} onChange={(v) => set({ carbsPerHr: v })} placeholder="80" suffix="g/h" />
          </div>
          <div className="rec-card">
            <div className="ico">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <div className="body">
              <div className="pri">
                Recommended {rec.low}–{rec.high} g/h · midpoint {rec.mid} g/h
              </div>
              <div className="why">
                Based on {finishSec ? fmtClock(finishSec) : "—"} finish,{" "}
                {weightKg ? `${Math.round(weightKg)} kg runner` : "unspecified weight"}, {conditions} conditions
                {state.saltiness !== "normal" && `, ${state.saltiness === "verysalty" ? "very salty" : "salty"} sweat`}.
                {state.saltiness !== "normal" && (
                  <>
                    {" "}
                    Aim for{" "}
                    <strong style={{ color: "var(--me-electrolyte)" }}>
                      {sodiumRec(state.saltiness).low}–{sodiumRec(state.saltiness).high} mg sodium/hr
                    </strong>
                    .
                  </>
                )}
              </div>
            </div>
            <button
              className={`use ${String(state.carbsPerHr) === String(rec.mid) ? "applied" : ""}`}
              onClick={() => set({ carbsPerHr: String(rec.mid) })}
            >
              {String(state.carbsPerHr) === String(rec.mid) ? (
                <>
                  <i className="fa-solid fa-check" style={{ marginRight: 6 }}></i>Applied
                </>
              ) : (
                "Use this"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 6 — Hydration */}
      <div className="form-section">
        <div className="label">
          <div className="step-num">06 · Hydrate</div>
          <h4>Hydration strategy</h4>
          <div className="hint">
            Choosing aid stations locks fluid drops to the on-course list. Own bottles lets you carry custom volume.
          </div>
        </div>
        <div className="form-row">
          <Segmented
            full
            value={state.hydration}
            onChange={(v) => set({ hydration: v })}
            options={[
              { value: "aid", label: "Aid stations", icon: "fa-droplet" },
              { value: "own", label: "Own bottles", icon: "fa-bottle-water" },
              { value: "hybrid", label: "Hybrid", icon: "fa-layer-group" },
            ]}
          />

          {state.hydration === "own" && (
            <div className="form-grid-2">
              <div className="fld">
                <label className="fld-lbl">Bottles carried</label>
                <div className="bottles">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={state.bottleCount === n ? "on" : ""}
                      onClick={() => set({ bottleCount: n })}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="fld">
                <label className="fld-lbl">Volume per bottle</label>
                <NumberInput
                  value={state.bottleVol}
                  onChange={(v) => set({ bottleVol: v })}
                  placeholder="20"
                  unit={state.bottleVolUnit}
                  units={["oz", "ml"]}
                  onUnitChange={(u) => set({ bottleVolUnit: u })}
                />
              </div>
            </div>
          )}

          {state.hydration === "hybrid" && (
            <div className="helper">
              <i className="fa-solid fa-circle-info" style={{ marginRight: 6, color: "var(--me-orange)" }}></i>
              Tap aid station pins on the map above to mark which ones you'll use. Carry ~12 oz of your own between
              marked drops.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
