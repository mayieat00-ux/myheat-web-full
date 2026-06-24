import { NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyGoogleIdToken } from '@/lib/server/googleAuth';
import { getUserWithProfileFlag, upsertUserFromGoogle } from '@/lib/server/users';
import { signJwt } from '@/lib/server/jwt';
import { handleError } from '@/lib/server/error';

const googleBodySchema = z.object({
  idToken: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idToken } = googleBodySchema.parse(body);
    const profile = await verifyGoogleIdToken(idToken);
    const user = await upsertUserFromGoogle(profile);
    const jwt = signJwt({ sub: user.id, email: user.email });

    const enriched = await getUserWithProfileFlag(user.id);
    return NextResponse.json({ jwt, user: enriched });
  } catch (err) {
    return handleError(err);
  }
}
