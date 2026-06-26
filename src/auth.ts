import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

import { env, PUBLIC_API_URL } from '@/lib/server/env';

// Augment NextAuth types so `session.backendJwt` is strongly typed everywhere.
// The JWT is issued by the embedded Next.js API routes, not a separate backend.

declare module 'next-auth' {
  interface Session {
    backendJwt?: string;
    profileComplete?: boolean;
    plan?: 'FREE' | 'PRO';
    user: DefaultSession['user'];
  }
}

// Internal token shape carried through Auth.js JWT callback.
interface TokenExtras {
  backendJwt?: string;
  profileComplete?: boolean;
  plan?: 'FREE' | 'PRO';
}

interface BackendAuthResponse {
  jwt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    profileComplete: boolean;
    subscription: { plan: 'FREE' | 'PRO'; status: string };
  };
}

async function exchangeGoogleTokenForBackendJwt(idToken: string): Promise<BackendAuthResponse> {
  const res = await fetch(`${PUBLIC_API_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Backend auth exchange failed (${res.status}): ${body}`);
  }
  return res.json() as Promise<BackendAuthResponse>;
}

/** Dev-only: hit the backend's /auth/dev-login bypass. */
async function fetchDevLoginJwt(): Promise<BackendAuthResponse> {
  const res = await fetch(`${PUBLIC_API_URL}/auth/dev-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Dev login failed (${res.status}): ${body}`);
  }
  return res.json() as Promise<BackendAuthResponse>;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Auth.js v5 needs an explicit secret.
  secret: env.AUTH_SECRET,
  // Trust the Host header only in development (e.g. phone on LAN). In
  // production we rely on the canonical AUTH_URL so the Google redirect URI
  // is always exactly the one registered in Google Cloud Console.
  trustHost: env.NODE_ENV === 'development',
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // Dev/test bypass. authorize() returns a placeholder user; the actual
    // backend JWT exchange happens in the jwt callback below.
    Credentials({
      id: 'dev-login',
      name: 'Dev Login',
      credentials: {},
      async authorize() {
        return { id: 'pending', email: 'devuser@mayieat.local' };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  // Route auth errors back to our own login page (instead of the default
  // /api/auth/error screen) so we can show a friendly message.
  pages: { signIn: '/login', error: '/login' },
  callbacks: {
    async jwt({ token, account, trigger }) {
      const t = token as typeof token & TokenExtras;

      // ---- Initial sign-in via Google ----
      if (account?.provider === 'google' && account.id_token) {
        try {
          const data = await exchangeGoogleTokenForBackendJwt(account.id_token);
          t.backendJwt = data.jwt;
          t.profileComplete = data.user.profileComplete;
          t.plan = data.user.subscription.plan;
          t.sub = data.user.id;
          t.email = data.user.email;
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('[auth] google exchange failed', err);
          // Re-throw so Auth.js aborts the sign-in and redirects to the error
          // page (/login?error=...) instead of silently creating a half-baked
          // session that bounces the user straight back to /login.
          throw new Error('GoogleExchangeFailed');
        }
      }

      // ---- Initial sign-in via dev bypass ----
      if (account?.provider === 'dev-login') {
        try {
          const data = await fetchDevLoginJwt();
          t.backendJwt = data.jwt;
          t.profileComplete = data.user.profileComplete;
          t.plan = data.user.subscription.plan;
          t.sub = data.user.id;
          t.email = data.user.email;
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('[auth] dev login exchange failed', err);
        }
      }

      // ---- Session refresh (after profile save, etc.) ----
      // ProfileForm calls update() — that re-runs this callback with
      // trigger='update'. Pull the fresh profileComplete from /auth/me.
      if (trigger === 'update' && t.backendJwt) {
        try {
          const res = await fetch(`${PUBLIC_API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${t.backendJwt}` },
          });
          if (res.ok) {
            const body = (await res.json()) as {
              user: BackendAuthResponse['user'];
            };
            t.profileComplete = body.user.profileComplete;
            t.plan = body.user.subscription.plan;
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('[auth] session refresh failed', err);
        }
      }

      return t;
    },
    async session({ session, token }) {
      const t = token as typeof token & TokenExtras;
      session.backendJwt = t.backendJwt;
      session.profileComplete = t.profileComplete;
      session.plan = t.plan;
      return session;
    },
  },
});
