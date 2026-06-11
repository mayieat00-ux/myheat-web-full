import Image from 'next/image';
import { redirect } from 'next/navigation';

import { auth, signOut } from '@/auth';
import { ProfileForm } from '@/components/ProfileForm';
import { ApiError, serverFetch } from '@/lib/api';
import type { UserProfile } from '@mayieat/shared';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.backendJwt) {
    redirect('/login?callbackUrl=/profile');
  }

  let profile: UserProfile | undefined;
  try {
    const data = await serverFetch<{ profile: UserProfile }>('/profile');
    profile = data.profile;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      redirect('/onboarding');
    }
    throw err;
  }

  const user = session.user;
  const initial = (user?.name ?? user?.email ?? '?').charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 to-white safe-pt">
      <div className="mx-auto max-w-2xl px-5 py-8">
        {/* Profile header card */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name ?? 'You'}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full ring-2 ring-brand-100"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-xl font-semibold text-white ring-2 ring-brand-100">
                {initial}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-bold tracking-tight text-gray-900">
                {user?.name ?? 'Your profile'}
              </h1>
              <p className="truncate text-sm text-gray-500">{user?.email}</p>
            </div>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
              }}
            >
              <button
                type="submit"
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Sign out
              </button>
            </form>
          </div>

          {profile?.dailyCalorieTarget && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-3">
              <span className="text-lg">🔥</span>
              <p className="text-sm text-gray-700">
                Daily calorie target:{' '}
                <span className="font-semibold text-brand-700">
                  {profile.dailyCalorieTarget} kcal
                </span>
              </p>
            </div>
          )}
        </div>

        <ProfileForm initial={profile} submitLabel="Save changes" redirectTo="/profile" />
      </div>
    </main>
  );
}
