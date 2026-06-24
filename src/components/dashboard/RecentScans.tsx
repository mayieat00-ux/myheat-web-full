import Image from 'next/image';
import Link from 'next/link';

import type { NutriGrade } from '@/shared';

export interface RecentScanItem {
  id: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  grade: NutriGrade;
  score: number;
  scannedAt: string;
}

const GRADE_PALETTE: Record<NutriGrade, { bg: string; text: string; ring: string }> = {
  A: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
  B: { bg: 'bg-lime-50', text: 'text-lime-700', ring: 'ring-lime-200' },
  C: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200' },
  D: { bg: 'bg-orange-50', text: 'text-orange-700', ring: 'ring-orange-200' },
  E: { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200' },
};

export function RecentScans({ items }: { items: RecentScanItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-6 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gray-100">
          <BarcodeIcon />
        </div>
        <p className="mt-3 text-sm font-medium text-gray-900">No scans yet</p>
        <p className="mt-1 text-xs text-gray-500">
          Your scan history will show up here once you scan your first food.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((s) => {
        const palette = GRADE_PALETTE[s.grade];
        return (
          <Link
            key={s.id}
            href={`/scan/result/${s.id}`}
            className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100 transition active:scale-[0.99] active:bg-gray-50"
          >
            {s.imageUrl ? (
              <Image
                src={s.imageUrl}
                alt={s.name}
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-gray-100"
                unoptimized
              />
            ) : (
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gray-100 text-gray-400">
                <FoodIcon />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">{s.name}</p>
              {s.brand && <p className="truncate text-xs text-gray-500">{s.brand}</p>}
              <p className="mt-0.5 text-[11px] text-gray-400">{relativeTime(s.scannedAt)}</p>
            </div>

            <div
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-center ring-1 ${palette.bg} ${palette.text} ${palette.ring}`}
            >
              <div className="text-base font-bold leading-none">{s.grade}</div>
              <div className="mt-0.5 text-[9px] font-medium leading-none opacity-80">{s.score}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = new Date().getTime();
  const diffSec = Math.max(0, Math.floor((now - then) / 1000));
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}

function FoodIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 9h14l-1.5 11h-11L5 9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function BarcodeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-gray-400" aria-hidden="true">
      <path d="M3 5v14M6 5v14M9 5v10M12 5v14M15 5v10M18 5v14M21 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
