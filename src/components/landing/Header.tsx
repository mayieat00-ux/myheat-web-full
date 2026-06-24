import Link from 'next/link';

export function LandingHeader({ isAuthed = false }: { isAuthed?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-lg font-semibold tracking-tight">MayiEat</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-gray-600 sm:flex">
          <a href="#features" className="hover:text-gray-900">Features</a>
          <a href="#how-it-works" className="hover:text-gray-900">How it works</a>
          <a href="#pricing" className="hover:text-gray-900">Pricing</a>
          <a href="#faq" className="hover:text-gray-900">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthed ? (
            <Link
              href="/scan"
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
            >
              Open app
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden text-sm text-gray-700 hover:text-gray-900 sm:inline">
                Sign in
              </Link>
              <Link
                href="/login"
                className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="url(#mayieat-logo-grad)" />
      <path
        d="M9 21V11l4 5 3-5v10M19 11v10M19 11l3 6 3-6"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="mayieat-logo-grad" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#22c55e" />
          <stop offset="1" stopColor="#15803d" />
        </linearGradient>
      </defs>
    </svg>
  );
}
