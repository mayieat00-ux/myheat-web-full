import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth, signIn } from '@/auth';
import { env } from '@/lib/server/env';

const ERROR_MESSAGES: Record<string, string> = {
  GoogleExchangeFailed:
    "We couldn't finish signing you in. Please try again — if it keeps happening, the server may be unreachable.",
  Configuration:
    'Google sign-in is not configured yet. Add your Google OAuth credentials to continue.',
  OAuthSignin: 'Could not start Google sign-in. Please try again.',
  OAuthCallback: 'Google sign-in was interrupted. Please try again.',
  AccessDenied: 'Access was denied. Please try a different Google account.',
  default: 'Something went wrong during sign-in. Please try again.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? '/scan';
  const isDev = env.NODE_ENV === 'development';
  const googleConfigured = Boolean(env.GOOGLE_CLIENT_ID);

  if (session?.backendJwt) {
    redirect(session.profileComplete ? callbackUrl : '/onboarding');
  }

  const errorMessage = params.error
    ? (ERROR_MESSAGES[params.error] ?? ERROR_MESSAGES.default)
    : null;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12 safe-pt safe-pb">
      {/* Decorative gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-white to-white"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-100 blur-3xl opacity-60"
      />

      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-3xl shadow-lg shadow-brand-600/25">
            🥗
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900">
            Welcome to MayiEat
          </h1>
          <p className="mt-2 text-balance text-gray-600">
            Sign in to scan food and get personalized health advice.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50">
          {errorMessage && (
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              <span aria-hidden>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form
            action={async () => {
              'use server';
              await signIn('google', { redirectTo: callbackUrl });
            }}
          >
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-base font-medium text-gray-800 shadow-sm transition active:scale-[0.99] hover:bg-gray-50"
            >
              <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.3 35 26.8 36 24 36c-5.2 0-9.6-3.3-11.2-7.9l-6.6 5.1C9.6 39.6 16.2 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.6l6.3 5.2C41.4 35.3 44 30 44 24c0-1.3-.1-2.4-.4-3.5z"
                />
              </svg>
              Continue with Google
            </button>
          </form>

          {!googleConfigured && isDev && (
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Google credentials aren&apos;t set yet — add{' '}
              <code className="font-mono">GOOGLE_CLIENT_ID</code> /{' '}
              <code className="font-mono">GOOGLE_CLIENT_SECRET</code> to{' '}
              <code className="font-mono">.env</code>, or use the dev login below.
            </p>
          )}

          {isDev && (
            <>
              <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
                <div className="h-px flex-1 bg-gray-200" />
                <span>dev only</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              <form
                action={async () => {
                  'use server';
                  await signIn('dev-login', { redirectTo: callbackUrl });
                }}
              >
                <button
                  type="submit"
                  className="w-full rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 px-6 py-3 text-base font-medium text-amber-800 transition active:scale-[0.99] hover:bg-amber-100"
                >
                  Continue as Dev User
                </button>
                <p className="mt-1.5 text-center text-xs text-amber-700">
                  Bypasses Google. Disabled in production.
                </p>
              </form>
            </>
          )}
        </div>

        <p className="mx-auto mt-6 max-w-xs text-center text-xs text-gray-400">
          By continuing you agree that MayiEat provides wellness suggestions only — not medical
          advice.
        </p>
        <p className="mt-4 text-center text-xs">
          <Link href="/" className="font-medium text-brand-700 hover:text-brand-800">
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
