// Visual nutrient bar — value-relative-to-reference, color-coded by severity.
// Thresholds align with the rating service: anything past `high` is shown red,
// past `moderate` is amber, below moderate is green.

type Severity = 'good' | 'ok' | 'warn' | 'bad';

interface Thresholds {
  /** Above this value → amber (watch). */
  moderate: number;
  /** Above this value → red (high). */
  high: number;
  /** Bar fills proportionally to this reference (typically 1.5× high). */
  reference?: number;
  /** If true, high values are GOOD (e.g. fiber, protein). Default false. */
  higherIsBetter?: boolean;
}

const NUTRIENT_THRESHOLDS: Record<string, Thresholds> = {
  sugar: { moderate: 5, high: 15 },
  satFat: { moderate: 2, high: 5 },
  sodium: { moderate: 200, high: 400, reference: 600 }, // mg
  fiber: { moderate: 3, high: 6, higherIsBetter: true },
  protein: { moderate: 6, high: 12, higherIsBetter: true },
  kcal: { moderate: 200, high: 400, reference: 600 },
};

const SEVERITY_STYLES: Record<Severity, { bar: string; tint: string; text: string; pill: string }> = {
  good: { bar: 'bg-emerald-500', tint: 'bg-emerald-100', text: 'text-emerald-700', pill: 'bg-emerald-50' },
  ok: { bar: 'bg-lime-500', tint: 'bg-lime-100', text: 'text-lime-700', pill: 'bg-lime-50' },
  warn: { bar: 'bg-amber-500', tint: 'bg-amber-100', text: 'text-amber-700', pill: 'bg-amber-50' },
  bad: { bar: 'bg-red-500', tint: 'bg-red-100', text: 'text-red-700', pill: 'bg-red-50' },
};

function classify(value: number, t: Thresholds): Severity {
  if (t.higherIsBetter) {
    if (value >= t.high) return 'good';
    if (value >= t.moderate) return 'ok';
    return 'warn'; // low fiber/protein isn't terrible, just neutral-bad
  }
  if (value >= t.high) return 'bad';
  if (value >= t.moderate) return 'warn';
  return 'good';
}

export function NutrientBar({
  label,
  value,
  unit,
  kind,
}: {
  label: string;
  value: number | null;
  unit: string;
  kind: keyof typeof NUTRIENT_THRESHOLDS;
}) {
  if (value === null || value === undefined) {
    return (
      <div className="rounded-2xl bg-gray-50 px-4 py-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</span>
          <span className="text-sm font-semibold text-gray-400">No data</span>
        </div>
      </div>
    );
  }

  const t = NUTRIENT_THRESHOLDS[kind];
  const ref = t.reference ?? t.high * 1.5;
  const pct = Math.max(2, Math.min(100, (value / ref) * 100));
  const sev = classify(value, t);
  const styles = SEVERITY_STYLES[sev];

  return (
    <div className={`rounded-2xl px-4 py-3 ${styles.pill}`}>
      <div className="flex items-baseline justify-between gap-2">
        <span className={`text-xs font-medium uppercase tracking-wider ${styles.text}`}>{label}</span>
        <span className={`text-base font-bold tabular-nums ${styles.text}`}>
          {value.toFixed(value > 100 ? 0 : 1)}
          <span className="ml-0.5 text-xs font-medium opacity-70">{unit}</span>
        </span>
      </div>
      <div className={`mt-2 h-2 overflow-hidden rounded-full ${styles.tint}`}>
        <div
          className={`h-full rounded-full ${styles.bar} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
