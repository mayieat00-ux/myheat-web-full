import { OAuth2Client, type TokenPayload } from 'google-auth-library';

import { env } from './env';
import { HttpError } from './error';

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID || undefined);

export interface GoogleProfile {
  googleId: string;
  email: string;
  name: string | null;
  picture: string | null;
  emailVerified: boolean;
}

/**
 * Verify a Google ID token and return the user's basic profile.
 * Throws HttpError(401) on failure.
 */
export async function verifyGoogleIdToken(idToken: string): Promise<GoogleProfile> {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new HttpError(500, 'google_oauth_unconfigured', 'GOOGLE_CLIENT_ID is not set');
  }

  let payload: TokenPayload | undefined;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
    throw new HttpError(
      401,
      'invalid_google_token',
      err instanceof Error ? err.message : 'Failed to verify Google token',
    );
  }

  if (!payload?.sub || !payload.email) {
    throw new HttpError(401, 'invalid_google_token', 'Google token missing required claims');
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name ?? null,
    picture: payload.picture ?? null,
    emailVerified: payload.email_verified === true,
  };
}
