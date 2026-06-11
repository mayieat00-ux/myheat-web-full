'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/scan', label: 'Home', icon: HomeIcon, match: (p: string) => p === '/scan' },
  {
    href: '/scan/new',
    label: 'Scan',
    icon: ScanIcon,
    match: (p: string) => p === '/scan/new',
    primary: true,
  },
  { href: '/profile', label: 'Profile', icon: UserIcon, match: (p: string) => p === '/profile' },
];

export function BottomNav() {
  const pathname = usePathname() ?? '';

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white safe-pb sm:hidden">
      <ul className="mx-auto flex max-w-xl items-stretch justify-around px-2 pt-1.5">
        {tabs.map(({ href, label, icon: Icon, match, primary }) => {
          const active = match(pathname);
          if (primary) {
            return (
              <li key={href} className="-mt-6 flex items-end">
                <Link
                  href={href}
                  className="grid h-14 w-14 place-items-center rounded-full bg-brand-600 text-white shadow-xl shadow-brand-600/40 ring-4 ring-white transition active:scale-95"
                  aria-label={label}
                >
                  <Icon active />
                </Link>
              </li>
            );
          }
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center gap-0.5 px-2 pt-2 pb-1 text-[11px] font-medium ${
                  active ? 'text-brand-700' : 'text-gray-500'
                }`}
              >
                <Icon active={active} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function HomeIcon({ active = false }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} aria-hidden="true">
      <path
        d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fillOpacity={active ? 0.15 : 0}
      />
    </svg>
  );
}

function ScanIcon({ active = false }: { active?: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} aria-hidden="true">
      <path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 9v6M10 9v6M13 9v6M16 9v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon({ active = false }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fillOpacity={active ? 0.15 : 0} />
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fillOpacity={active ? 0.15 : 0} />
    </svg>
  );
}
