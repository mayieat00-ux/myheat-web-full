// Next.js middleware — runs at the edge before every matching request.
// We use the Auth.js auth() helper to read the session JWT and redirect
// unauthenticated users → /login. Public routes pass through. The
// profile-completion gate lives in the pages (they check the backend directly),
// NOT here — see the note below the auth check.

import { NextResponse } from 'next/server';

import { auth } from '@/auth';

const PUBLIC_PATHS = ['/', '/login'];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Static assets, Next internals, and ALL API routes are excluded via the
  // matcher below, but be safe. API calls (Auth.js at /api/auth and the backend
  // proxy at /api/v1) must never be redirected to an HTML page — otherwise the
  // caller tries to JSON.parse a login/onboarding document and blows up with
  // "unexpected token". The backend enforces its own auth via the Bearer token.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.includes(pathname);
  const isAuthed = Boolean(session?.backendJwt);

  if (!isAuthed) {
    if (isPublic) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // NOTE: we intentionally do NOT gate on `profileComplete` here. The session
  // cookie's profileComplete flag lags the real backend state right after the
  // user saves their profile (the cookie refresh races with navigation), which
  // used to bounce the user back to /onboarding forever. The profile gate now
  // lives in the pages themselves (onboarding + scan), which check the backend
  // directly — the authoritative source of truth.
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
