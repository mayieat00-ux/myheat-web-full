import Link from 'next/link';

export function LandingHero({ ctaHref, ctaLabel }: { ctaHref: string; ctaLabel: string }) {
  return (
    <section className="relative overflow-hidden">
      {/* soft gradient backdrop */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-white to-white" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 sm:py-24 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-700 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            AI-powered nutrition, personalized to you
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Scan any food.
            <br />
            <span className="bg-gradient-to-r from-brand-600 to-emerald-500 bg-clip-text text-transparent">
              Know what you&apos;re really eating.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600 lg:mx-0">
            MayiEat reads the label — and your goals — to give you a personalized health
            rating, ingredient warnings, and a diet plan that fits <em>your</em> body, in seconds.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              {ctaLabel}
              <ArrowIcon />
            </Link>
            <a
              href="#how-it-works"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition hover:bg-gray-50"
            >
              See how it works
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500 lg:justify-start">
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon /> Free to start
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon /> No credit card
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon /> 3M+ products supported
            </span>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 6.5 4.5 9l5.5-6" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Hand-drawn phone mockup showing a scan result for "Nutella" — illustrates
 * the product without needing real screenshots yet.
 */
function PhoneMockup() {
  return (
    <div className="relative">
      {/* floating badges */}
      <div className="absolute -left-6 top-12 z-10 rotate-[-6deg] rounded-xl bg-white px-3 py-2 text-xs font-semibold text-red-600 shadow-lg ring-1 ring-gray-100">
        ⚠ High sugar
      </div>
      <div className="absolute -right-4 top-40 z-10 rotate-[6deg] rounded-xl bg-white px-3 py-2 text-xs font-semibold text-amber-600 shadow-lg ring-1 ring-gray-100">
        Watch sodium
      </div>
      <div className="absolute -left-2 bottom-16 z-10 rotate-[-3deg] rounded-xl bg-white px-3 py-2 text-xs font-semibold text-brand-700 shadow-lg ring-1 ring-gray-100">
        ✓ Diabetes-aware
      </div>

      <div className="relative h-[560px] w-[280px] rounded-[2.5rem] border-[10px] border-gray-900 bg-gray-900 shadow-2xl">
        {/* notch */}
        <div className="absolute left-1/2 top-0 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-gray-900" />

        {/* screen */}
        <div className="h-full w-full overflow-hidden rounded-[2rem] bg-white">
          {/* status bar */}
          <div className="flex items-center justify-between px-5 pt-3 text-[10px] text-gray-500">
            <span>9:41</span>
            <span>●●●</span>
          </div>

          {/* app header */}
          <div className="px-5 pt-3 pb-2">
            <p className="text-xs text-gray-400">Scanned just now</p>
            <h3 className="text-lg font-bold leading-tight">Nutella Hazelnut Spread</h3>
            <p className="text-xs text-gray-500">Ferrero · 400 g jar</p>
          </div>

          {/* rating gauge */}
          <div className="mx-5 mt-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <svg viewBox="0 0 80 80" className="absolute inset-0">
                  <circle cx="40" cy="40" r="34" stroke="#fee2e2" strokeWidth="8" fill="none" />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="#ef4444"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(28 / 100) * 213.6} 213.6`}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                  />
                </svg>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600">28</div>
                  <div className="-mt-1 text-[9px] text-gray-500">/ 100</div>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-1 rounded-md bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                  Grade E
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  Very high sugar &amp; saturated fat. Limit for your goals.
                </p>
              </div>
            </div>
          </div>

          {/* nutrients */}
          <div className="mx-5 mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-gray-50 px-3 py-2">
              <div className="text-gray-500">Sugar</div>
              <div className="font-semibold text-red-600">56.3 g</div>
            </div>
            <div className="rounded-lg bg-gray-50 px-3 py-2">
              <div className="text-gray-500">Sat fat</div>
              <div className="font-semibold text-amber-600">10.6 g</div>
            </div>
            <div className="rounded-lg bg-gray-50 px-3 py-2">
              <div className="text-gray-500">Protein</div>
              <div className="font-semibold">6.3 g</div>
            </div>
            <div className="rounded-lg bg-gray-50 px-3 py-2">
              <div className="text-gray-500">Calories</div>
              <div className="font-semibold">539 kcal</div>
            </div>
          </div>

          {/* AI explanation */}
          <div className="mx-5 mt-3 rounded-xl bg-brand-50 px-3 py-3 text-[11px] leading-snug text-brand-900">
            <div className="mb-1 flex items-center gap-1 font-semibold text-brand-700">
              <SparkleIcon /> AI insight
            </div>
            <p>
              Sweet treat, but 56 g of sugar per 100 g is well above what fits your
              maintenance goal. Pair with protein and limit to a teaspoon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <path d="M6 0l1.4 3.6L11 5 7.4 6.4 6 10 4.6 6.4 1 5l3.6-1.4L6 0z" />
    </svg>
  );
}
