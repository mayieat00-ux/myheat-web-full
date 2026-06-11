import Link from 'next/link';

export function LandingCTA({ ctaHref, ctaLabel }: { ctaHref: string; ctaLabel: string }) {
  return (
    <section className="px-6 py-20">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-emerald-700 p-12 text-center shadow-xl">
        {/* decorative blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl"
        />

        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Ready to know what you eat?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-brand-50/90">
          Free forever. No card. Two scans away from healthier choices.
        </p>
        <Link
          href={ctaHref}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 text-base font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50"
        >
          {ctaLabel}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
