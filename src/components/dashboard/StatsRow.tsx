import { FREE_TIER_WEEKLY_AI_QUOTA, type NutriGrade } from '@/shared';

interface StatsRowProps {
  totalScans: number;
  weeklyScans: number;
  avgGrade: NutriGrade | null;
  aiUsedThisWeek?: number;
  plan: 'FREE' | 'PRO';
}

const GRADE_COLOR: Record<NutriGrade, string> = {
  A: 'text-emerald-600 bg-emerald-50',
  B: 'text-lime-600 bg-lime-50',
  C: 'text-amber-600 bg-amber-50',
  D: 'text-orange-600 bg-orange-50',
  E: 'text-red-600 bg-red-50',
};

export function StatsRow({ totalScans, weeklyScans, avgGrade, aiUsedThisWeek = 0, plan }: StatsRowProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <StatCard
        label="Total"
        value={totalScans.toString()}
        sub={totalScans === 1 ? 'scan' : 'scans'}
      />
      <StatCard
        label="This week"
        value={weeklyScans.toString()}
        sub={weeklyScans === 1 ? 'scan' : 'scans'}
      />
      {avgGrade ? (
        <StatCard
          label="Avg grade"
          value={avgGrade}
          valueClass={GRADE_COLOR[avgGrade]}
          sub="overall"
        />
      ) : (
        <StatCard
          label="AI quota"
          value={plan === 'PRO' ? '∞' : `${aiUsedThisWeek}/${FREE_TIER_WEEKLY_AI_QUOTA}`}
          sub={plan === 'PRO' ? 'Pro' : 'this week'}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  valueClass = 'text-gray-900 bg-gray-50',
}: {
  label: string;
  value: string;
  sub: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">{label}</p>
      <div className={`mt-1 inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-lg font-bold ${valueClass}`}>
        {value}
      </div>
      <p className="mt-1 text-[11px] text-gray-500">{sub}</p>
    </div>
  );
}
