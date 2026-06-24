const steps = [
  {
    n: '01',
    title: 'Sign in & tell us about you',
    body:
      'Sign in with Google. Share your age, weight, activity level, goals, allergies, and any medical conditions. Takes 60 seconds.',
  },
  {
    n: '02',
    title: 'Scan a food',
    body:
      'Point your camera at a barcode, or snap a photo of any meal. We figure out what it is and pull the full nutrition profile.',
  },
  {
    n: '03',
    title: 'Get your personalized verdict',
    body:
      'A 0–100 health score, ingredient warnings tuned to your profile, and an AI explanation in plain English — in under 3 seconds.',
  },
  {
    n: '04',
    title: 'Stay on track every day',
    body:
      'Log what you eat with one tap. Get a daily meal plan that adapts to your real intake. See trends over time.',
  },
];

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            How it works
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
            Four steps. Two seconds each.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            No spreadsheets. No 30-minute onboarding. Just open the app and start scanning.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, idx) => (
            <div key={s.n} className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="absolute -top-3 left-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                {s.n}
              </div>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.body}</p>
              {idx < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-gradient-to-r from-brand-300 to-transparent lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
