import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { ProfileForm } from '@/components/ProfileForm';
import { ApiError, serverFetch } from '@/lib/api';

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.backendJwt) {
    redirect('/login?callbackUrl=/onboarding');
  }

  // Authoritative check against the backend (not the cached session cookie):
  // if a profile already exists, onboarding is done — go straight to the app.
  // This is what reliably moves the user forward after they hit "Continue".
  let hasProfile = false;
  try {
    await serverFetch('/profile');
    hasProfile = true;
  } catch (err) {
    if (!(err instanceof ApiError && err.status === 404)) throw err;
  }
  if (hasProfile) {
    redirect('/scan');
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 to-white safe-pt">
      <div className="mx-auto max-w-2xl px-5 py-10">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-4 py-1 text-sm font-medium text-brand-700">
            ✨ Welcome to MayiEat
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">Tell us about you</h1>
          <p className="mx-auto mt-2 max-w-md text-balance text-gray-600">
            We use this to personalize your health ratings and diet suggestions. You can change it
            anytime.
          </p>
        </div>

        <ProfileForm submitLabel="Continue →" redirectTo="/scan" />
      </div>
    </main>
  );
}
