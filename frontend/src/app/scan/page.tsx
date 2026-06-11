import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { BottomNav } from '@/components/dashboard/BottomNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { RecentScans, type RecentScanItem } from '@/components/dashboard/RecentScans';
import { ScanCtaCard } from '@/components/dashboard/ScanCtaCard';
import { StatsRow } from '@/components/dashboard/StatsRow';
import { TipsCard } from '@/components/dashboard/TipsCard';
import { ApiError, serverFetch } from '@/lib/api';
import type { NutriGrade } from '@mayieat/shared';

// Shape of a single row returned by GET /scan/history?limit=… (joined with food).
interface RawHistoryItem {
  id: string;
  createdAt: string;
  food: {
    name: string;
    brand: string | null;
    imageUrl: string | null;
  };
  personalizedRating: {
    score: number;
    grade: NutriGrade;
  };
}

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const GRADE_VALUES: Record<NutriGrade, number> = { A: 5, B: 4, C: 3, D: 2, E: 1 };
const VALUE_TO_GRADE: Record<number, NutriGrade> = { 5: 'A', 4: 'B', 3: 'C', 2: 'D', 1: 'E' };

export default async function ScanDashboardPage() {
  const session = await auth();
  if (!session?.backendJwt) redirect('/login?callbackUrl=/scan');

  // Authoritative profile gate: ask the backend directly rather than trusting
  // the session cookie's profileComplete flag (which lags right after save and
  // caused the post-onboarding redirect loop). 404 → no profile yet.
  let needsOnboarding = false;
  try {
    await serverFetch('/profile');
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) needsOnboarding = true;
    else throw err;
  }
  if (needsOnboarding) redirect('/onboarding');

  let history: RawHistoryItem[] = [];
  try {
    const data = await serverFetch<{ items: RawHistoryItem[] }>('/scan/history?limit=20');
    history = data.items;
  } catch {
    // Non-fatal: show empty state.
  }

  const recent: RecentScanItem[] = history.slice(0, 5).map((s) => ({
    id: s.id,
    name: s.food.name,
    brand: s.food.brand,
    imageUrl: s.food.imageUrl,
    grade: s.personalizedRating.grade,
    score: s.personalizedRating.score,
    scannedAt: s.createdAt,
  }));

  const now = new Date().getTime();
  const weeklyScans = history.filter((s) => now - new Date(s.createdAt).getTime() < ONE_WEEK_MS).length;

  const avgGrade = computeAvgGrade(history);

  return (
    <div className="min-h-[100svh] bg-gray-50 pb-28 sm:pb-12">
      <DashboardHeader name={session.user?.name} email={session.user?.email} image={session.user?.image} />

      <main className="mx-auto max-w-xl space-y-4 px-4 pb-4">
        <ScanCtaCard />

        <StatsRow
          totalScans={history.length}
          weeklyScans={weeklyScans}
          avgGrade={avgGrade}
          aiUsedThisWeek={0}
          plan={session.plan ?? 'FREE'}
        />

        <section>
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold text-gray-900">Recent scans</h2>
            {recent.length > 0 && (
              <span className="text-xs text-gray-500">Tap to view</span>
            )}
          </div>
          <RecentScans items={recent} />
        </section>

        <TipsCard />
      </main>

      <BottomNav />
    </div>
  );
}

function computeAvgGrade(history: RawHistoryItem[]): NutriGrade | null {
  if (history.length === 0) return null;
  const sum = history.reduce((acc, s) => acc + GRADE_VALUES[s.personalizedRating.grade], 0);
  const avg = Math.round(sum / history.length);
  return VALUE_TO_GRADE[avg] ?? null;
}
