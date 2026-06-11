import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
              <span className="text-lg font-semibold tracking-tight">MayiEat</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-gray-600">
              Personalized nutrition for everyone. Scan, understand, eat better — without giving
              up the foods you love.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><a href="#features" className="hover:text-gray-900">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-gray-900">How it works</a></li>
              <li><a href="#pricing" className="hover:text-gray-900">Pricing</a></li>
              <li><a href="#faq" className="hover:text-gray-900">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><Link href="/privacy" className="hover:text-gray-900">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-gray-900">Terms</Link></li>
              <li><a href="mailto:hello@mayieat.app" className="hover:text-gray-900">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-500">
            <strong className="text-gray-700">Disclaimer:</strong> MayiEat provides wellness
            suggestions only. It is <em>not</em> medical advice, diagnosis, or treatment.
            Consult a qualified healthcare professional for medical questions, especially before
            making changes to your diet related to a medical condition.
          </p>
          <p className="mt-3 text-xs text-gray-400">
            © {new Date().getFullYear()} MayiEat. Built with care · Nutrition data by
            OpenFoodFacts · AI by Google Gemini.
          </p>
        </div>
      </div>
    </footer>
  );
}

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="url(#mayieat-footer-grad)" />
      <path
        d="M9 21V11l4 5 3-5v10M19 11v10M19 11l3 6 3-6"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="mayieat-footer-grad" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#22c55e" />
          <stop offset="1" stopColor="#15803d" />
        </linearGradient>
      </defs>
    </svg>
  );
}
