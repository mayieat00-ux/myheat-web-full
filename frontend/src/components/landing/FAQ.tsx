const faqs = [
  {
    q: 'Is MayiEat medical advice?',
    a: "No. MayiEat provides wellness suggestions to help you make informed food choices. It's not a diagnosis or treatment. Always consult a qualified professional for medical decisions — especially if you have a condition like diabetes, hypertension, or a serious allergy.",
  },
  {
    q: 'How accurate is the food data?',
    a: 'Barcoded products use OpenFoodFacts — a community-maintained database with 3M+ products. Coverage is excellent in Europe and growing in the US and India. For fresh food (photo scan), we use Google Gemini Vision; nutrition is estimated and may be off by ±15%.',
  },
  {
    q: 'What about my privacy?',
    a: 'Your profile (age, weight, conditions) is stored encrypted in our database and is never shared or sold. Scanned images are processed and then deleted within 24 hours unless you save them to your log. You can delete your account at any time.',
  },
  {
    q: 'Why is the AI quota limited on the free tier?',
    a: 'Each AI call (image recognition, diet plan, rating explanation) costs us money. The free tier gets 2 AI requests per week, which covers casual use. Barcode scans and base health ratings are free and unlimited.',
  },
  {
    q: "When will Pro be available to buy?",
    a: "We're building it now. Phase 2 (after the core product is solid) will add Stripe checkout. Until then, you can use the free tier — or email us if you want early Pro access.",
  },
  {
    q: 'Does it work without internet?',
    a: 'Not yet. Scanning requires a live connection to OpenFoodFacts and Gemini. Offline mode for cached foods is on the roadmap.',
  },
];

export function LandingFAQ() {
  return (
    <section id="faq" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Questions
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
            Frequently asked
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map(({ q, a }, idx) => (
            <details
              key={q}
              className="group rounded-xl border border-gray-200 bg-white px-5 py-4 open:shadow-sm"
              {...(idx === 0 ? { open: true } : {})}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="text-base font-semibold text-gray-900">{q}</span>
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gray-100 text-gray-500 transition group-open:rotate-45 group-open:bg-brand-100 group-open:text-brand-700">
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
