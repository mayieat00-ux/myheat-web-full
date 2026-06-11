import Link from 'next/link';

export function ScanCtaCard() {
  return (
    <Link
      href="/scan/new"
      className="group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-emerald-700 p-6 shadow-xl shadow-brand-600/20 transition active:scale-[0.99]"
    >
      {/* decorative blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-emerald-300/20 blur-2xl" />

      <div className="relative flex items-center gap-5">
        {/* animated barcode icon */}
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/20">
          <BarcodeIcon />
          {/* scan line */}
          <div className="pointer-events-none absolute h-16 w-0.5 animate-pulse bg-white/70" />
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium text-white/80">Ready when you are</p>
          <h2 className="mt-0.5 text-2xl font-bold leading-tight text-white">Scan a food</h2>
          <p className="mt-1 text-sm text-white/80">
            Point at a barcode — get a personalized rating in 2 seconds.
          </p>
        </div>

        <ArrowIcon />
      </div>

      <div className="relative mt-5 grid grid-cols-2 gap-2 text-xs text-white/85">
        <div className="rounded-xl bg-white/10 px-3 py-2 backdrop-blur">
          <div className="flex items-center gap-1.5 font-semibold">
            <PulseDot /> Live camera
          </div>
        </div>
        <div className="rounded-xl bg-white/10 px-3 py-2 backdrop-blur">
          <div className="flex items-center gap-1.5 font-semibold">
            <KeypadDot /> Manual entry
          </div>
        </div>
      </div>
    </Link>
  );
}

function BarcodeIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-white">
      <path d="M3 5v14M6 5v14M9 5v10M12 5v14M15 5v10M18 5v14M21 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-white transition group-hover:translate-x-1"
    >
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
      <path d="M9 8l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PulseDot() {
  return <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" aria-hidden="true" />;
}
function KeypadDot() {
  return <span className="h-2 w-2 rounded-full bg-white/70" aria-hidden="true" />;
}
