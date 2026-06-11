import type { NutriGrade } from '@mayieat/shared';

const GRADE_PALETTE: Record<NutriGrade, { ring: string; tint: string; text: string; bg: string }> = {
  A: { ring: '#16a34a', tint: '#dcfce7', text: '#166534', bg: 'bg-emerald-50' },
  B: { ring: '#65a30d', tint: '#ecfccb', text: '#3f6212', bg: 'bg-lime-50' },
  C: { ring: '#eab308', tint: '#fef3c7', text: '#854d0e', bg: 'bg-amber-50' },
  D: { ring: '#f97316', tint: '#ffedd5', text: '#9a3412', bg: 'bg-orange-50' },
  E: { ring: '#ef4444', tint: '#fee2e2', text: '#991b1b', bg: 'bg-red-50' },
};

export function RatingGauge({
  score,
  grade,
  size = 180,
  stroke = 14,
}: {
  score: number;
  grade: NutriGrade;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const palette = GRADE_PALETTE[grade];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={palette.tint}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={palette.ring}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${pct * circumference} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-bold tabular-nums" style={{ color: palette.text }}>
          {Math.round(score)}
        </div>
        <div className="-mt-1 text-xs uppercase tracking-wider text-gray-500">/ 100</div>
        <div
          className="mt-1 rounded-md px-2 py-0.5 text-xs font-bold"
          style={{ background: palette.tint, color: palette.text }}
        >
          Grade {grade}
        </div>
      </div>
    </div>
  );
}

export function gradePalette(grade: NutriGrade) {
  return GRADE_PALETTE[grade];
}
