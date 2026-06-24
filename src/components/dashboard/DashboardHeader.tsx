import Image from 'next/image';
import Link from 'next/link';

export function DashboardHeader({
  name,
  email,
  image,
}: {
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
}) {
  const displayName = (name?.split(' ')[0]) || email?.split('@')[0] || 'there';
  const greeting = getGreeting();

  return (
    <header className="safe-pt safe-px px-4 pt-5 pb-2">
      <div className="flex items-center justify-between">
        <Link href="/profile" className="group flex items-center gap-3 transition active:scale-95">
          {image ? (
            <Image
              src={image}
              alt={displayName}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-brand-100"
              unoptimized
            />
          ) : (
            <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-600 text-base font-bold uppercase text-white ring-2 ring-brand-100">
              {displayName.charAt(0)}
            </div>
          )}
          <div className="text-left">
            <p className="text-xs text-gray-500">{greeting}</p>
            <p className="text-base font-semibold leading-tight text-gray-900">{displayName}</p>
          </div>
        </Link>

        <Link
          href="/profile"
          aria-label="Profile & settings"
          className="grid h-11 w-11 place-items-center rounded-full bg-gray-100 text-gray-700 transition active:scale-95"
        >
          <SettingsIcon />
        </Link>
      </div>
    </header>
  );
}

function getGreeting() {
  // No Date.now — keep server/client output consistent by reading from a UTC hour
  // bucket on render. The greeting is cosmetic; slight TZ drift is fine.
  const h = new Date().getUTCHours();
  if (h < 4 || h >= 17) return 'Good evening';
  if (h < 11) return 'Good morning';
  return 'Good afternoon';
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1A1.7 1.7 0 0 0 10 3.1V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1A1.7 1.7 0 0 0 20.9 10H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
