/* Shared, presentation-only form controls for the race calculators.
 * Extracted from race-form.tsx so the course-specific (Rocket City) form and
 * the generic course-agnostic form can share the same styled inputs. */

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: string;
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  full,
}: {
  value: T;
  onChange: (v: T) => void;
  options: SegmentedOption<T>[];
  full?: boolean;
}) {
  return (
    <div className={`seg-ctl${full ? " full" : ""}`}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={value === o.value ? "on" : ""}
          onClick={() => onChange(o.value)}
        >
          {o.icon && <i className={`fa-solid ${o.icon} ico`}></i>}
          {o.label}
        </button>
      ))}
    </div>
  );
}

type UnitOption<U extends string> = U | { label: string; value: U };

export function UnitToggle<U extends string>({
  value,
  onChange,
  units,
}: {
  value: U;
  onChange: (v: U) => void;
  units: UnitOption<U>[];
}) {
  const norm = units.map((u) =>
    typeof u === "string" ? { label: u, value: u } : u,
  );
  return (
    <div className="unit-toggle">
      {norm.map((u) => (
        <button
          key={u.value}
          type="button"
          className={value === u.value ? "on" : ""}
          onClick={() => onChange(u.value)}
        >
          {u.label}
        </button>
      ))}
    </div>
  );
}

export function NumberInput<U extends string>({
  value,
  onChange,
  placeholder,
  unit,
  units,
  onUnitChange,
  suffix,
  inputMode,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  unit?: U;
  units?: UnitOption<U>[];
  onUnitChange?: (u: U) => void;
  suffix?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div className="fld-input">
      <input
        type="text"
        inputMode={inputMode || "decimal"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {units && unit !== undefined && onUnitChange ? (
        <UnitToggle value={unit} onChange={onUnitChange} units={units} />
      ) : null}
      {suffix && !units ? <div className="fld-suffix">{suffix}</div> : null}
    </div>
  );
}
