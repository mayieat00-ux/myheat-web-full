const TIPS = [
  {
    icon: '✨',
    title: 'Tip · Scan before you buy',
    body: 'Quick scans at the store help you skip foods that don’t fit your goals — before they end up in your cart.',
  },
  {
    icon: '🛡️',
    title: 'Allergies fully set up?',
    body: 'Add every allergy in your profile. We hard-flag matching ingredients and bump the score to zero — no surprises.',
  },
  {
    icon: '🌿',
    title: 'Heads up · AI is on the way',
    body: 'Photo scan (for fresh food) and AI diet plans land in the next phases. Your free tier already includes 2 AI requests/week.',
  },
];

export function TipsCard() {
  // Pick a stable tip based on the UTC day so it varies across days but not within a single render.
  const dayIndex = Math.floor(new Date().getTime() / 86_400_000) % TIPS.length;
  const tip = TIPS[dayIndex] ?? TIPS[0]!;

  return (
    <article className="rounded-2xl bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-4 ring-1 ring-amber-100">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-xl shadow-sm ring-1 ring-amber-100">
          {tip.icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{tip.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-700">{tip.body}</p>
        </div>
      </div>
    </article>
  );
}
