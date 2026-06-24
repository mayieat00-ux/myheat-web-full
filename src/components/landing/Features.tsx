const features = [
  {
    icon: BarcodeIcon,
    title: 'Instant barcode scan',
    body:
      'Point at any packaged food. We pull live nutrition, ingredient, and additive data from the OpenFoodFacts database — 3 million+ products and growing.',
    accent: 'from-emerald-50 to-emerald-100 text-emerald-700',
  },
  {
    icon: CameraIcon,
    title: 'Visual AI for fresh food',
    body:
      'No barcode? Snap a photo of an apple, a plate of pasta, anything. Gemini Vision identifies it and estimates portion and nutrition for you.',
    accent: 'from-sky-50 to-sky-100 text-sky-700',
  },
  {
    icon: GaugeIcon,
    title: 'Health rating that knows you',
    body:
      'Open Nutri-Score as the base, then adjusted for your age, weight, goals, allergies, and medical flags. The same food can score very differently for two people.',
    accent: 'from-brand-50 to-brand-100 text-brand-700',
  },
  {
    icon: ShieldIcon,
    title: 'Allergy & condition awareness',
    body:
      'Tell us about diabetes, hypertension, celiac, peanuts, dairy — anything. We flag risky ingredients before you eat them, every single time.',
    accent: 'from-rose-50 to-rose-100 text-rose-700',
  },
  {
    icon: BrainIcon,
    title: 'AI diet coach',
    body:
      'A personalized daily and weekly meal plan that respects your goals, prefs, and what you actually scanned recently. Regenerate on demand.',
    accent: 'from-violet-50 to-violet-100 text-violet-700',
  },
  {
    icon: ChartIcon,
    title: 'Track your intake',
    body:
      'Add scanned foods to your daily log with one tap. Watch calories, macros, sodium, and sugar against your target — see patterns over time.',
    accent: 'from-amber-50 to-amber-100 text-amber-700',
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          Everything you need
        </span>
        <h2 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
          Smarter food choices, on autopilot
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          From the moment you scan to the moment you sit down to eat. Built for real people with
          real goals — and real allergies.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, body, accent }) => (
          <article
            key={title}
            className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${accent}`}
            >
              <Icon />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

// === Icons (24x24, currentColor) ===
function BarcodeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 5v14M6 5v14M9 5v10M12 5v14M15 5v10M18 5v14M21 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function CameraIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 8h3l2-2h6l2 2h3v11H4V8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function GaugeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 18a8 8 0 1 1 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="m12 18 4-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BrainIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5 3 3 0 0 0 2 5v1a3 3 0 0 0 6 0V4M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 2 5 3 3 0 0 1-2 5v1a3 3 0 0 1-6 0" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 19V5M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 15v-4M12 15V8M16 15v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
