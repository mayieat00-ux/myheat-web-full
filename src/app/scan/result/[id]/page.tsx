import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/auth';
import { NutrientBar } from '@/components/NutrientBar';
import { RatingGauge, gradePalette } from '@/components/RatingGauge';
import { ApiError, serverFetch } from '@/lib/api';
import type { NutriGrade, ScanResultPayload } from '@/shared';

const VERDICT_BY_GRADE: Record<NutriGrade, string> = {
  A: 'A really solid choice. Eat freely.',
  B: 'Good for most occasions.',
  C: 'OK in moderation.',
  D: 'Treat it as an occasional indulgence.',
  E: 'Heavy hit. Save for rare treats.',
};

export default async function ScanResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.backendJwt) redirect('/login');

  const { id } = await params;
  let data: ScanResultPayload;
  try {
    data = await serverFetch<ScanResultPayload>(`/scan/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const { food, rating } = data;
  const palette = gradePalette(rating.grade);
  const n = food.nutrients;

  return (
    <div className="min-h-[100svh] bg-gray-50 pb-32">
      {/* ============== HERO ============== */}
      <div className="relative">
        {/* Image */}
        <div className="relative h-72 w-full overflow-hidden sm:h-80">
          {food.imageUrl ? (
            <Image
              src={food.imageUrl}
              alt={food.name}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover"
              priority
              unoptimized
            />
          ) : (
            <div className={`h-full w-full ${palette.bg}`}>
              <div className="grid h-full w-full place-items-center text-gray-300">
                <FoodIcon />
              </div>
            </div>
          )}
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-gray-950/40" />
        </div>

        {/* Top bar */}
        <header className="absolute inset-x-0 top-0 safe-pt safe-px px-4 pt-4">
          <div className="flex items-center justify-between">
            <Link
              href="/scan"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-gray-900 shadow-md backdrop-blur transition active:scale-95"
              aria-label="Back to home"
            >
              <BackIcon />
            </Link>
            <Link
              href="/profile"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-gray-900 shadow-md backdrop-blur transition active:scale-95"
              aria-label="Profile"
            >
              <UserIcon />
            </Link>
          </div>
        </header>

        {/* Title overlay */}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-6 text-white">
          <h1 className="text-2xl font-bold leading-tight drop-shadow-md sm:text-3xl">{food.name}</h1>
          {food.brand && (
            <p className="mt-1 text-sm text-white/90 drop-shadow">{food.brand}</p>
          )}
          {food.barcode && (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-black/30 px-2 py-0.5 font-mono text-[11px] text-white/80 backdrop-blur">
              <span className="opacity-70">UPC</span> {food.barcode}
            </p>
          )}
        </div>
      </div>

      {/* ============== RATING CARD (lifted over hero) ============== */}
      <section className="mx-auto -mt-8 max-w-xl px-4">
        <div className="rounded-3xl bg-white p-5 shadow-xl ring-1 ring-gray-100">
          <div className="flex items-center gap-5">
            <RatingGauge score={rating.score} grade={rating.grade} size={132} stroke={12} />
            <div className="min-w-0 flex-1">
              <div
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider"
                style={{ background: palette.tint, color: palette.text }}
              >
                <SparkleIcon /> Personalized
              </div>
              <p className="mt-2 text-lg font-semibold leading-tight text-gray-900">
                {VERDICT_BY_GRADE[rating.grade]}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Based on your profile · base{' '}
                {food.nutriScoreGrade ? `Nutri-Score ${food.nutriScoreGrade}` : 'estimated'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============== WARNINGS ============== */}
      {rating.warnings.length > 0 && (
        <section className="mx-auto mt-4 max-w-xl px-4">
          <SectionTitle icon="⚠️" title={rating.warnings.length === 1 ? 'Watch out' : 'Watch out for'} />
          <div className="mt-2 space-y-2">
            {rating.warnings.map((w) => (
              <div
                key={w}
                className="flex items-start gap-3 rounded-2xl bg-white p-3 ring-1 ring-red-100 shadow-sm"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600">
                  <WarnIcon />
                </div>
                <p className="flex-1 pt-1 text-sm text-gray-800">{w}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============== POSITIVES ============== */}
      {rating.positives.length > 0 && (
        <section className="mx-auto mt-4 max-w-xl px-4">
          <SectionTitle icon="✨" title="What's good" />
          <div className="mt-2 space-y-2">
            {rating.positives.map((p) => (
              <div
                key={p}
                className="flex items-start gap-3 rounded-2xl bg-white p-3 ring-1 ring-emerald-100 shadow-sm"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckIcon />
                </div>
                <p className="flex-1 pt-1 text-sm text-gray-800">{p}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============== NUTRIENTS — visual bars ============== */}
      <section className="mx-auto mt-4 max-w-xl px-4">
        <SectionTitle icon="📊" title="Per 100 g" />
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <NutrientBar label="Calories" value={n.kcal} unit="kcal" kind="kcal" />
          <NutrientBar label="Sugar" value={n.sugar} unit="g" kind="sugar" />
          <NutrientBar label="Saturated fat" value={n.satFat} unit="g" kind="satFat" />
          <NutrientBar
            label="Sodium"
            value={n.sodium !== null ? n.sodium * 1000 : null}
            unit="mg"
            kind="sodium"
          />
          <NutrientBar label="Protein" value={n.protein} unit="g" kind="protein" />
          <NutrientBar label="Fiber" value={n.fiber} unit="g" kind="fiber" />
        </div>

        {/* Other nutrients in compact row */}
        {(n.carbs !== null || n.fat !== null || n.salt !== null) && (
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            {n.carbs !== null && <CompactCell label="Carbs" value={`${n.carbs.toFixed(1)} g`} />}
            {n.fat !== null && <CompactCell label="Fat" value={`${n.fat.toFixed(1)} g`} />}
            {n.salt !== null && <CompactCell label="Salt" value={`${n.salt.toFixed(2)} g`} />}
          </div>
        )}
      </section>

      {/* ============== INGREDIENTS ============== */}
      {food.ingredients && (
        <section className="mx-auto mt-4 max-w-xl px-4">
          <SectionTitle icon="🥣" title="Ingredients" />
          <div className="mt-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
            <p className="text-sm leading-relaxed text-gray-700">{food.ingredients}</p>
            {food.additives.length > 0 && (
              <>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Additives detected
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {food.additives.map((a) => (
                    <span
                      key={a}
                      className="rounded-md bg-amber-50 px-2 py-0.5 font-mono text-[11px] text-amber-700 ring-1 ring-amber-100"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <p className="mx-auto mt-6 max-w-xl px-6 text-center text-[11px] text-gray-400">
        Wellness suggestions only — not medical advice. Consult a professional for medical
        decisions.
      </p>

      {/* ============== STICKY BOTTOM CTAs ============== */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white/95 px-4 pt-3 pb-4 backdrop-blur safe-pb">
        <div className="mx-auto flex max-w-xl items-center gap-2">
          <Link
            href="/scan"
            className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-gray-100 px-4 text-sm font-semibold text-gray-700 transition active:scale-[0.98]"
          >
            Home
          </Link>
          <Link
            href="/scan/new"
            className="flex h-12 flex-[2] items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 text-base font-semibold text-white shadow-lg shadow-brand-600/30 transition active:scale-[0.98]"
          >
            <ScanIcon />
            Scan another
          </Link>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <h2 className="px-1 text-sm font-semibold text-gray-900">
      <span className="mr-1.5">{icon}</span>
      {title}
    </h2>
  );
}

function CompactCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white px-2 py-2 ring-1 ring-gray-100">
      <div className="text-[10px] font-medium uppercase tracking-wider text-gray-500">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function FoodIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 9h14l-1.5 11h-11L5 9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function WarnIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1l7 13H1L8 1z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8 6v3.5M8 11v.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8.5 6.5 12 13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ScanIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 9v6M10 9v6M13 9v6M16 9v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function SparkleIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <path d="M6 0l1.4 3.6L11 5 7.4 6.4 6 10 4.6 6.4 1 5l3.6-1.4L6 0z" />
    </svg>
  );
}
