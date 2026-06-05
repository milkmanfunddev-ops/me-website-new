/* Generated plan output — the coach-style "Build your race-day kit" editor,
 * an opt-in "Map to the course" timeline, breakfast + share cards.
 * Ported from the design prototype; converted to TypeScript with ES imports,
 * caffeine made an explicit opt-in (never derived from sweat saltiness), and
 * Own-bottle volume folded into the table-fluid the kit suggests. */

import { useEffect, useRef, useState } from "react";
import { fmtClock } from "@/lib/race-plan/engine";
import { carriedKitNutrition, seedKit } from "@/lib/race-plan/kit";
import type { Caffeine, CalculatorState, Plan, Saltiness } from "@/lib/race-plan/types";

/* ---- Gel products ------------------------------------------------------
   The athlete picks ONE gel for the plan; its profile drives the carb +
   sodium (+ caffeine) math directly. */
interface GelProduct {
  key: string;
  name: string;
  carbs: number;
  na: number;
  caf: number;
}
const GEL_PRODUCTS: GelProduct[] = [
  { key: "maurten", name: "Maurten Gel 100", carbs: 25, na: 85, caf: 0 },
  { key: "maurtencaf", name: "Maurten Gel 100 Caf", carbs: 25, na: 85, caf: 100 },
  { key: "sisgo", name: "SiS GO Isotonic", carbs: 22, na: 10, caf: 0 },
  { key: "guroctane", name: "GU Roctane", carbs: 21, na: 125, caf: 35 },
  { key: "sisbeta", name: "SiS Beta Fuel", carbs: 40, na: 10, caf: 0 },
  { key: "precision", name: "Precision Fuel PF 30", carbs: 30, na: 30, caf: 0 },
  { key: "nduranz", name: "Nduranz Gel 45", carbs: 45, na: 200, caf: 0 },
  { key: "spring", name: "Spring Energy Awesome Sauce", carbs: 45, na: 80, caf: 0 },
];

/** Pick a sensible starting gel. Caffeine is opt-in: a caffeinated gel is
 * NEVER chosen unless the runner asked for caffeine. Sodium-rich gels are
 * favored for saltier sweat within the no-caffeine tier. */
function defaultGelKey(caffeine: Caffeine, saltiness: Saltiness): string {
  if (caffeine === "high") return "maurtencaf"; // 100 mg caf
  if (caffeine === "moderate") return "guroctane"; // 35 mg caf + 125 mg Na
  if (saltiness === "verysalty") return "nduranz"; // 200 mg Na, no caf
  if (saltiness === "salty") return "maurten"; // 85 mg Na, no caf
  return "sisgo"; // no caf
}
function productByKey(key: string): GelProduct {
  return GEL_PRODUCTS.find((p) => p.key === key) || GEL_PRODUCTS[0];
}
function gelLabel(p: GelProduct): string {
  return `${p.carbs}g${p.caf ? ` + ${p.caf}mg caf` : ""}`;
}

/* ---- Editable item list ------------------------------------------------
   Each item carries a fixed per-unit nutrition profile. The summary markers
   are the SUM of these items; the band is the ±10% target. Cups are an 8 oz
   aid-station cup. */
const ML_PER_OZ = 29.5735;
type ItemKey = "gel" | "sports" | "water" | "salt";
interface ItemDef {
  key: ItemKey;
  label: string;
  cups: boolean;
  icon: string;
  step: number;
  accent: string;
  per: { carbs: number; fluidOz: number; sodium: number };
}
const ITEM_DEFS: ItemDef[] = [
  { key: "gel", label: "Energy Gels", cups: false, icon: "fa-bolt", step: 1, accent: "var(--me-orange)", per: { carbs: 25, fluidOz: 0, sodium: 100 } },
  { key: "sports", label: "Sports Drink", cups: true, icon: "fa-bottle-water", step: 0.5, accent: "var(--me-electrolyte)", per: { carbs: 15, fluidOz: 8, sodium: 110 } },
  { key: "water", label: "Water", cups: true, icon: "fa-glass-water", step: 0.5, accent: "var(--me-electrolyte)", per: { carbs: 0, fluidOz: 8, sodium: 0 } },
  { key: "salt", label: "Salt Caps", cups: false, icon: "fa-tablets", step: 1, accent: "var(--me-dragonfruit)", per: { carbs: 0, fluidOz: 0, sodium: 300 } },
];

type Qty = Record<ItemKey, number>;

function itemPer(d: ItemDef, gel: GelProduct) {
  if (d.key === "gel") return { carbs: gel.carbs, fluidOz: 0, sodium: gel.na, caf: gel.caf || 0 };
  return { ...d.per, caf: 0 };
}

function sumItemNutrition(qty: Qty, gel: GelProduct) {
  let carbs = 0;
  let fluidOz = 0;
  let sodium = 0;
  let caf = 0;
  for (const d of ITEM_DEFS) {
    const n = qty[d.key] || 0;
    const per = itemPer(d, gel);
    carbs += n * per.carbs;
    fluidOz += n * per.fluidOz;
    sodium += n * per.sodium;
    caf += n * per.caf;
  }
  return { carbs: Math.round(carbs), fluidOz: Math.round(fluidOz), sodium: Math.round(sodium), caf: Math.round(caf) };
}

function fmtQty(n: number): string {
  return n % 1 === 0 ? String(n) : n.toFixed(1);
}

type CustomGel = { carbs: number | string; na: number | string; caf: number | string };

/* Custom dropdown for choosing the plan's gel product (works on dark card). */
function GelPicker({
  gelKey,
  custom,
  onSelect,
  onCustom,
}: {
  gelKey: string;
  custom: CustomGel;
  onSelect: (k: string) => void;
  onCustom: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  const isCustom = gelKey === "custom";
  const current = isCustom
    ? { name: "Custom gel", carbs: Number(custom.carbs) || 0, caf: Number(custom.caf) || 0, na: Number(custom.na) || 0 }
    : productByKey(gelKey);
  return (
    <div className="gelpick" ref={ref}>
      <button type="button" className="gelpick-trigger" onClick={() => setOpen((o) => !o)}>
        <span className="gelpick-cur">
          <span className="gelpick-name">{current.name}</span>
          <span className="gelpick-meta">
            {current.carbs}g{current.caf ? ` · ${current.caf}mg caf` : ""} · {current.na}mg Na each
          </span>
        </span>
        <i className={`fa-solid fa-chevron-down gelpick-chev${open ? " open" : ""}`}></i>
      </button>
      {open && (
        <div className="gelpick-menu" role="listbox">
          {GEL_PRODUCTS.map((p) => {
            const on = !isCustom && gelKey === p.key;
            return (
              <button
                key={p.key}
                type="button"
                role="option"
                aria-selected={on}
                className={`gelpick-opt${on ? " on" : ""}`}
                onClick={() => {
                  onSelect(p.key);
                  setOpen(false);
                }}
              >
                <span className="go-name">{p.name}</span>
                <span className="go-meta">{gelLabel(p)}</span>
                {on && <i className="fa-solid fa-check go-chk"></i>}
              </button>
            );
          })}
          <button
            type="button"
            className={`gelpick-opt is-custom${isCustom ? " on" : ""}`}
            onClick={() => {
              onCustom();
              setOpen(false);
            }}
          >
            <span className="go-name">Custom gel…</span>
            {isCustom && <i className="fa-solid fa-check go-chk"></i>}
          </button>
        </div>
      )}
    </div>
  );
}

interface PlanOutputProps {
  plan: Plan;
  state: CalculatorState;
}

export function PlanOutput({ plan, state }: PlanOutputProps) {
  const [copied, setCopied] = useState(false);
  const [gelKey, setGelKey] = useState<string>(() => defaultGelKey(state.caffeine, state.saltiness));
  const [customGel, setCustomGel] = useState<CustomGel>({ carbs: 30, na: 100, caf: 0 });
  const gelProduct: GelProduct =
    gelKey === "custom"
      ? { key: "custom", name: "Custom gel", carbs: Number(customGel.carbs) || 0, na: Number(customGel.na) || 0, caf: Number(customGel.caf) || 0 }
      : productByKey(gelKey);
  const [qty, setQty] = useState<Qty>(() => seedKit(plan, gelProduct).qty);
  const [mapped, setMapped] = useState(false);

  // Re-suggest the default gel when the runner's caffeine preference changes.
  const caffSig = `${state.caffeine}|${state.saltiness}`;
  const caffRef = useRef(caffSig);
  useEffect(() => {
    if (caffRef.current !== caffSig) {
      caffRef.current = caffSig;
      setGelKey(defaultGelKey(state.caffeine, state.saltiness));
    }
  }, [caffSig, state.caffeine, state.saltiness]);

  // Re-suggest item quantities when the underlying targets or gel change.
  const targetSig = `${plan.carbsTarget}|${plan.fluidTarget}|${plan.sodTarget}|${plan.tableFluidTarget}|${plan.gelTotal}|${gelProduct.carbs}|${gelProduct.na}`;
  const sigRef = useRef(targetSig);
  useEffect(() => {
    if (sigRef.current !== targetSig) {
      sigRef.current = targetSig;
      setQty(seedKit(plan, gelProduct).qty);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetSig]);

  function copyPlan() {
    const lines: string[] = [];
    const dist = state.type === "half" ? "HALF" : "MARATHON";
    lines.push(`ROCKET CITY ${dist} 2026 — RACE PLAN`);
    lines.push(`${state.pace} ${state.paceUnit === "mi" ? "/mi" : "/km"} · finish ~${fmtClock(plan.finish)} · ${plan.conditions} conditions`);
    lines.push("");
    lines.push(`THE PLAN: ${fmtQty(qty.gel || 0)} gels, ~30 min apart. Throwaway bottle for the first 3–4 mi, then`);
    lines.push(`hit every aid table for whatever cup you can grab.`);
    lines.push("");
    lines.push("YOUR GELS");
    lines.push(`  Carrying: ${gelProduct.name} · ${gelProduct.carbs} g carbs · ${gelProduct.na} mg Na${gelProduct.caf ? ` · ${gelProduct.caf} mg caf` : ""} each`);
    plan.gels.forEach((g) => {
      lines.push(`  ${g.optional ? "Optional gel" : "Gel " + g.n} · ~${fmtClock(g.timeSec)} (mile ${g.mi.toFixed(0)})${g.optional ? " — if you’re feeling it" : ""}`);
    });
    lines.push("");
    if (plan.carriedMl > 0) {
      const carried = carriedKitNutrition(plan, gelProduct);
      lines.push("YOUR BOTTLES");
      lines.push(`  Carry ~${Math.round(plan.carriedMl / ML_PER_OZ)} oz of carb mix — about ${carried.carbs} g carbs · ${carried.sodium} mg sodium total; top up fluid at the tables.`);
      lines.push("");
    }
    lines.push("AID STATIONS — hit the table");
    lines.push(`  Grab whatever cup you can — sports drink or water. ${plan.warm ? "Warm out: go for two cups when you can." : "Two cups if you can."}`);
    lines.push(`  Mile markers: ${plan.aidMileList.map((s) => s.mi.toFixed(1)).join(", ")}`);
    lines.push("");
    lines.push("PRE-RACE BREAKFAST (3 hr out)");
    lines.push(`  ~${plan.bfCarbs} g carbs · low fiber, low fat`);
    navigator.clipboard?.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <div className="plan-wrap" id="plan-output">
      <div className="plan-head">
        <div>
          <h2>Your race plan</h2>
          <p className="plan-thesis">
            <strong>
              {fmtQty(qty.gel || 0)} {(qty.gel || 0) === 1 ? "gel" : "gels"}, paced ~30 min apart.
            </strong>{" "}
            A throwaway bottle off the line, then hit every aid table for whatever cup you can grab. Your gels and salt
            caps carry your carbs and sodium; the aid stations carry your fluid.
          </p>
        </div>
      </div>

      <RacePlan
        plan={plan}
        qty={qty}
        setQty={setQty}
        gelProduct={gelProduct}
        gelKey={gelKey}
        setGelKey={setGelKey}
        customGel={customGel}
        setCustomGel={setCustomGel}
        mapped={mapped}
        onMap={() => setMapped(true)}
      />

      {mapped && (
        <>
          <Timeline plan={plan} state={state} qty={qty} gelProduct={gelProduct} />
          <MapAdvisories plan={plan} state={state} />
        </>
      )}

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
            A coach's one-pager: your gel timing plus the plain-language plan. Copy it, print it, or open it in the
            Mealvana app for reminders.
          </div>
          <button className="b1" onClick={copyPlan}>
            <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`}></i>
            {copied ? "Copied to clipboard" : "Copy race plan"}
          </button>
          <button className="b2">
            <i className="fa-solid fa-mobile-screen"></i>
            Open in Mealvana app
          </button>
          {copied && (
            <div className="copied">
              <i className="fa-solid fa-check"></i> Gel timing + plan copied — paste it anywhere.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============ RACE PLAN (default) ============ */
type StatStatus = "in" | "low" | "high";
const STATUS_LABEL: Record<StatStatus, string> = { in: "In range", low: "Below range", high: "Above range" };

function RacePlan({
  plan,
  qty,
  setQty,
  gelProduct,
  gelKey,
  setGelKey,
  customGel,
  setCustomGel,
  mapped,
  onMap,
}: {
  plan: Plan;
  qty: Qty;
  setQty: React.Dispatch<React.SetStateAction<Qty>>;
  gelProduct: GelProduct;
  gelKey: string;
  setGelKey: (k: string) => void;
  customGel: CustomGel;
  setCustomGel: React.Dispatch<React.SetStateAction<CustomGel>>;
  mapped: boolean;
  onMap: () => void;
}) {
  const sums = sumItemNutrition(qty, gelProduct);
  const carriedOz = Math.round(plan.carriedMl / ML_PER_OZ);
  const fluidOzTarget = Math.round(plan.fluidTarget / ML_PER_OZ);
  // Carried bottles are a carb-electrolyte mix, so they contribute carbs +
  // sodium (not just fluid) — same as a sports-drink cup, just pre-poured.
  const carried = carriedKitNutrition(plan, gelProduct);

  const summary = (
    [
      { key: "carbs", label: "Carbs", unit: "g", accent: "var(--me-orange)", value: sums.carbs + carried.carbs, target: plan.carbsTarget, note: carried.carbs > 0 ? `${carried.carbs} g from bottles` : "" },
      // Carried bottle fluid counts toward the runner's total fluid.
      { key: "fluids", label: "Fluids", unit: "oz", accent: "var(--me-electrolyte)", value: sums.fluidOz + carriedOz, target: fluidOzTarget, note: carriedOz > 0 ? `${carriedOz} oz carried` : "" },
      { key: "sodium", label: "Sodium", unit: "mg", accent: "var(--me-dragonfruit)", value: sums.sodium + carried.sodium, target: plan.sodTarget, note: carried.sodium > 0 ? `${carried.sodium} mg from bottles` : "" },
    ] as const
  ).map((s) => {
    const low = Math.round(s.target * 0.9);
    const high = Math.round(s.target * 1.1);
    const status: StatStatus = s.value < low ? "low" : s.value > high ? "high" : "in";
    const span = Math.max(1, high - low);
    const pct = Math.max(0, Math.min(1, (s.value - low) / span)) * 100;
    return { ...s, low, high, status, pct };
  });

  function bump(key: ItemKey, step: number, dir: number) {
    setQty((q) => {
      const next = Math.max(0, Math.round(((q[key] || 0) + dir * step) * 2) / 2);
      return { ...q, [key]: next };
    });
  }

  return (
    <div className="raceplan">
      <section className="rp-summary">
        <div className="rps-head">
          <div>
            <div className="rps-title">Build your race-day kit</div>
            <div className="rps-sub">
              Dial each item up or down — your totals update live and show whether they land inside the ±10% target
              range.
            </div>
          </div>
          <div className="rps-finish">
            <span className="rps-finish-val">{fmtClock(plan.finish)}</span>
            <span className="rps-finish-lbl">est. finish</span>
          </div>
        </div>

        <div className="rps-stats">
          {summary.map((s) => (
            <div key={s.key} className={`rps-stat is-${s.status}`} style={{ "--rps-accent": s.accent } as React.CSSProperties}>
              <div className="rps-stat-top">
                <div className="rps-num">
                  <span className="v">{s.value.toLocaleString()}</span>
                  <span className="u">{s.unit}</span>
                </div>
                <span className={`rps-flag is-${s.status}`}>
                  <i className={`fa-solid ${s.status === "in" ? "fa-check" : s.status === "low" ? "fa-arrow-down" : "fa-arrow-up"}`}></i>
                  {STATUS_LABEL[s.status]}
                </span>
              </div>
              <div className="rps-lbl">
                {s.label} · target {s.target.toLocaleString()}
                {s.unit}
                {s.note ? ` · ${s.note}` : ""}
              </div>
              <div className="rps-range">
                <div className="rps-track">
                  <span className="rps-dot" style={{ left: `${s.pct}%` }}></span>
                </div>
                <div className="rps-ends">
                  <span>{s.low.toLocaleString()}</span>
                  <span>{s.high.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rps-items">
          {ITEM_DEFS.map((d) => {
            const n = qty[d.key] || 0;
            const step = (
              <div className="rps-step">
                <button type="button" aria-label={`Fewer ${d.label}`} onClick={() => bump(d.key, d.step, -1)} disabled={n <= 0}>
                  <i className="fa-solid fa-minus"></i>
                </button>
                <span className="rps-step-n">{fmtQty(n)}</span>
                <button type="button" aria-label={`More ${d.label}`} onClick={() => bump(d.key, d.step, 1)}>
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            );

            if (d.key === "gel") {
              return (
                <div key={d.key} className="rps-item is-gel" style={{ "--rps-accent": d.accent } as React.CSSProperties}>
                  <div className="rps-item-row">
                    <div className="rps-item-ico">
                      <i className={`fa-solid ${d.icon}`}></i>
                    </div>
                    <div className="rps-item-name">
                      <span className="rps-item-qty">{fmtQty(n)}</span> Energy Gels
                    </div>
                    {step}
                  </div>
                  <GelPicker gelKey={gelKey} custom={customGel} onSelect={setGelKey} onCustom={() => setGelKey("custom")} />
                  {gelKey === "custom" && (
                    <div className="rps-custom">
                      {(
                        [
                          { k: "carbs", label: "Carbs", unit: "g" },
                          { k: "na", label: "Sodium", unit: "mg" },
                          { k: "caf", label: "Caffeine", unit: "mg" },
                        ] as const
                      ).map((f) => (
                        <label key={f.k} className="rps-custom-field">
                          <span>
                            {f.label} ({f.unit})
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={customGel[f.k]}
                            onChange={(e) => setCustomGel((c) => ({ ...c, [f.k]: e.target.value }))}
                          />
                        </label>
                      ))}
                    </div>
                  )}
                  {sums.caf > 0 && (
                    <div className="rps-gel-caf">
                      <i className="fa-solid fa-mug-hot"></i> ≈ {sums.caf.toLocaleString()} mg caffeine across {fmtQty(n)} gels
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={d.key} className="rps-item" style={{ "--rps-accent": d.accent } as React.CSSProperties}>
                <div className="rps-item-row">
                  <div className="rps-item-ico">
                    <i className={`fa-solid ${d.icon}`}></i>
                  </div>
                  <div className="rps-item-name">
                    <span className="rps-item-qty">{fmtQty(n)}</span>
                    {d.cups ? ` ${n === 1 ? "cup" : "cups"} ` : " "}
                    {d.label}
                  </div>
                  {step}
                </div>
              </div>
            );
          })}
        </div>

        <div className="rps-map-cta">
          {!mapped ? (
            <button type="button" className="map-btn" onClick={onMap}>
              <i className="fa-solid fa-map-location-dot"></i>
              Map to the course
            </button>
          ) : (
            <div className="rps-mapped-note">
              <i className="fa-solid fa-circle-check"></i>
              Mapped below — your kit, spread across the course.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ====== MAP ADVISORIES — start-bottle + aid-station notes ====== */
function MapAdvisories({ plan, state }: { plan: Plan; state: CalculatorState }) {
  const ownFill = state.hydration === "own" || state.hydration === "hybrid";
  return (
    <div className="map-foots">
      <div className="map-foots-label">
        <i className="fa-solid fa-circle-info"></i>
        Read the map with these two in mind
      </div>
      <div className="map-foot">
        <div className="mf-ico">
          <i className="fa-solid fa-bottle-water"></i>
        </div>
        <div className="mf-body">
          <div className="mf-title">Before the first station · your start bottle</div>
          <p>
            Carry a throwaway handheld for the first 3–4 miles so you can skip the congested early aid stations — then
            start hitting every table.
            {ownFill
              ? ` Fill it with ~60 g carb mix in 500 ml; add ½–1 scoop Element if you sweat salty.`
              : ` Ditch it by mile 4 — after that you’re on the course, no need to carry.`}
          </p>
        </div>
      </div>
      <div className="map-foot">
        <div className="mf-ico">
          <i className="fa-solid fa-hand-holding-droplet"></i>
        </div>
        <div className="mf-body">
          <div className="mf-title">At every aid station · hit the table</div>
          <p>
            Grab whatever cup you can — sports drink or water, doesn’t matter. Your gels already cover carbs and sodium,
            so the only job here is fluid.
            {plan.warm ? " It’s warm — go for two cups whenever you can." : " If you can grab two cups, even better."}{" "}
            Stations flagged <strong>emergency gel</strong> are course backup only — never count on them for fuel.
          </p>
        </div>
      </div>
      <div className="rp-disclaimer">
        <i className="fa-solid fa-glass-water"></i>
        <span>
          <strong>Don't chase a number.</strong> Take fluid at every table; if you can grab two cups, even better.
          Finishing up to ~2% lighter is normal — thirst is a better guide than any target.
        </span>
      </div>
    </div>
  );
}

/* ============ COURSE TIMELINE ====== */
const TL_ITEMS: Record<ItemKey, { icon: string; color: string; label: string }> = {
  gel: { icon: "fa-bolt", color: "var(--me-orange)", label: "Gel" },
  sports: { icon: "fa-bottle-water", color: "var(--me-electrolyte-dark)", label: "Sports drink" },
  water: { icon: "fa-droplet", color: "var(--me-electrolyte)", label: "Water" },
  salt: { icon: "fa-tablets", color: "var(--me-dragonfruit)", label: "Salt cap" },
};

// Spread n items across `span` slots, evenly.
function spreadIdx(n: number, span: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const pos = n <= 1 ? Math.round((span - 1) / 2) : Math.round((i * (span - 1)) / (n - 1));
    out.push(Math.max(0, Math.min(span - 1, pos)));
  }
  return out;
}

interface Bucket {
  s: Plan["aidActions"][number];
  gel: number;
  salt: number;
  sports: number;
  water: number;
}

// Map the kit quantities onto the course aid stations the runner will use.
function buildCourseStations(plan: Plan, qty: Qty, state: CalculatorState): Bucket[] {
  let stations = (plan.aidActions || []).filter((s) => s.timeSec > 0).slice().sort((a, b) => a.timeSec - b.timeSec);
  // Hybrid with marked drops: only map fluid onto the stations the runner chose.
  if (state.hydration === "hybrid" && state.selectedStations.length) {
    const picked = stations.filter((s) => state.selectedStations.includes(s.num));
    if (picked.length) stations = picked;
  }
  const K = stations.length;
  if (!K) return [];
  const c = {
    gel: Math.round(qty.gel || 0),
    salt: Math.round(qty.salt || 0),
    sports: Math.round(qty.sports || 0),
    water: Math.round(qty.water || 0),
  };
  const buckets: Bucket[] = stations.map((s) => ({ s, gel: 0, salt: 0, sports: 0, water: 0 }));

  const totalDrinks = c.sports + c.water;
  if (totalDrinks > 0) {
    const waterSlots = new Set(spreadIdx(c.water, totalDrinks));
    spreadIdx(totalDrinks, K).forEach((stIdx, slot) => {
      if (waterSlots.has(slot)) buckets[stIdx].water++;
      else buckets[stIdx].sports++;
    });
  }
  spreadIdx(c.gel, K).forEach((i) => {
    buckets[i].gel++;
  });
  spreadIdx(c.salt, K).forEach((i) => {
    buckets[i].salt++;
  });

  return buckets.filter((b) => b.gel || b.salt || b.sports || b.water);
}

function Timeline({ plan, state, qty, gelProduct }: { plan: Plan; state: CalculatorState; qty: Qty; gelProduct: GelProduct }) {
  const totalSec = plan.finish;
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(900);

  useEffect(() => {
    function measure() {
      if (ref.current) setWidth(Math.max(400, ref.current.offsetWidth - 56));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const buckets = buildCourseStations(plan, qty, state);
  const events = buckets.map((b) => ({
    timeSec: b.s.timeSec,
    mi: b.s.mi,
    name: b.s.name,
    items: (["gel", "sports", "water", "salt"] as ItemKey[]).filter((k) => b[k] > 0).map((k) => ({ k, n: b[k] })),
    hasGel: b.gel > 0,
  }));

  const tickInterval = totalSec < 2.5 * 3600 ? 15 * 60 : 30 * 60;
  const ticks: { t: number; pct: number }[] = [];
  for (let t = 0; t <= totalSec; t += tickInterval) {
    ticks.push({ t, pct: t / totalSec });
  }

  const LANES_PER_SIDE = 2;
  const LABEL_WIDTH = 96;
  const LABEL_GAP = 8;
  const lanes: Record<string, { lo: number; hi: number }[]> = {};
  function place(x: number, side: string, lane: number) {
    const k = `${side}_${lane}`;
    const arr = lanes[k] || (lanes[k] = []);
    const lo = x - LABEL_WIDTH / 2;
    const hi = x + LABEL_WIDTH / 2 + LABEL_GAP;
    for (const r of arr) if (lo < r.hi && hi > r.lo) return false;
    arr.push({ lo, hi });
    return true;
  }
  const placed = events.map((e, idx) => {
    const pct = e.timeSec / totalSec;
    const x = pct * width;
    let chosen: { side: string; lane: number } | null = null;
    const order: { side: string; lane: number }[] = [];
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

  const LANE_H = 64;
  const STEM_BASE = 18;
  function yFor(side: string, lane: number) {
    const sign = side === "down" ? 1 : -1;
    return sign * (STEM_BASE + lane * LANE_H);
  }

  const totals = sumItemNutrition(qty, gelProduct);

  return (
    <div className="timeline-card" ref={ref}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--me-orange)" }}>
            Show me the timeline
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, lineHeight: 1.1, marginTop: 4 }}>
            Your kit, mapped to the course
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--me-blackberry-muted)", marginTop: 6, maxWidth: 560 }}>
            Every item from your race-day kit, spread across the {buckets.length} aid stations you'll use — what to grab,
            and when.
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "baseline", flexWrap: "wrap" }}>
          <div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>0:00</span>{" "}
            <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--me-blackberry-muted)", textTransform: "uppercase", letterSpacing: 1 }}>gun</span>
          </div>
          <div style={{ width: 1, height: 18, background: "color-mix(in srgb, var(--me-blackberry) 18%, transparent)" }}></div>
          <div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>{fmtClock(plan.finish)}</span>{" "}
            <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--me-blackberry-muted)", textTransform: "uppercase", letterSpacing: 1 }}>finish</span>
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
          const y = yFor(e.side, e.lane);
          const stemHeight = Math.abs(y) - 14;
          return (
            <div key={`e${i}`} className={`tl-event station${e.hasGel ? " has-gel" : ""}`} style={{ left: `${Math.min(99, Math.max(1, e.pct * 100))}%` }}>
              <div
                className="stem"
                style={{
                  top: e.side === "down" ? "14px" : "auto",
                  bottom: e.side === "up" ? "14px" : "auto",
                  height: `${stemHeight}px`,
                }}
              ></div>
              <div className="dot">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div
                className="lbl"
                style={{
                  top: e.side === "down" ? `${Math.abs(y) + 6}px` : "auto",
                  bottom: e.side === "up" ? `${Math.abs(y) + 6}px` : "auto",
                }}
              >
                <span className="b">
                  Mi {e.mi.toFixed(1)} · {fmtClock(e.timeSec)}
                </span>
                <div className="tl-chips">
                  {e.items.map((it) => (
                    <span key={it.k} className="tl-chip" style={{ "--c": TL_ITEMS[it.k].color } as React.CSSProperties}>
                      <i className={`fa-solid ${TL_ITEMS[it.k].icon}`}></i>
                      {it.n > 1 ? `×${it.n}` : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="tl-legend">
        {(["gel", "sports", "water", "salt"] as ItemKey[]).map((k) => (
          <div key={k} className="item">
            <span className="tl-chip" style={{ "--c": TL_ITEMS[k].color } as React.CSSProperties}>
              <i className={`fa-solid ${TL_ITEMS[k].icon}`}></i>
            </span>
            {TL_ITEMS[k].label}
          </div>
        ))}
        <div className="item" style={{ marginLeft: "auto", color: "var(--me-blackberry-muted)" }}>
          {totals.carbs} g · {totals.fluidOz} oz · {totals.sodium} mg{totals.caf ? ` · ${totals.caf} mg caf` : ""} total
        </div>
      </div>
    </div>
  );
}
