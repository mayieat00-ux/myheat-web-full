import Link from 'next/link';

import { FREE_TIER_WEEKLY_AI_QUOTA } from '@/shared';

const freeFeatures = [
  'Unlimited barcode scans',
  'Base health rating for every food',
  'Manual food logging & daily totals',
  `${FREE_TIER_WEEKLY_AI_QUOTA} AI requests per week (image scan, AI explanation, diet plan)`,
  '30-day scan history',
];

const proFeatures = [
  'Everything in Free',
  'Unlimited AI image scans',
  'Unlimited AI health explanations',
  'Unlimited personalized diet plans',
  'Weekly meal planner',
  'Unlimited scan history',
  'CSV export (coming soon)',
];

export function LandingPricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          Pricing
        </span>
        <h2 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
          Start free. Upgrade when you&apos;re ready.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Real Gemini AI calls cost money. The free tier handles the basics; Pro unlocks
          unlimited AI for power users.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
        {/* Free */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Free</h3>
          <p className="mt-1 text-sm text-gray-500">Perfect for trying it out</p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-5xl font-bold text-gray-900">$0</span>
            <span className="text-sm text-gray-500">/forever</span>
          </div>
          <Link
            href="/login"
            className="mt-6 block rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Get started free
          </Link>
          <ul className="mt-6 space-y-3 text-sm">
            {freeFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <CheckIcon className="mt-0.5 text-brand-600" /> <span className="text-gray-700">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro */}
        <div className="relative rounded-2xl border-2 border-brand-500 bg-gradient-to-br from-brand-50 via-white to-white p-8 shadow-lg">
          <div className="absolute -top-3 right-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
            Coming soon
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
          <p className="mt-1 text-sm text-gray-500">Unlimited AI for daily users</p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-5xl font-bold text-gray-900">$5</span>
            <span className="text-sm text-gray-500">/month*</span>
          </div>
          <p className="mt-1 text-xs text-gray-400">*pricing tentative</p>
          <button
            type="button"
            disabled
            className="mt-6 block w-full cursor-not-allowed rounded-lg bg-brand-600/80 px-4 py-2.5 text-center text-sm font-semibold text-white opacity-90"
          >
            Notify me when ready
          </button>
          <ul className="mt-6 space-y-3 text-sm">
            {proFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <CheckIcon className="mt-0.5 text-brand-600" /> <span className="text-gray-700">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-xl text-center text-xs text-gray-500">
        No payment integration yet — the Pro upgrade flow is being built. Free users get full
        access to everything except the AI quota cap.
      </p>
    </section>
  );
}

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M3 8.5 6.5 12 13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
