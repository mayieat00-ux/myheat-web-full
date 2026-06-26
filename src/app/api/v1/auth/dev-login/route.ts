import { NextResponse } from 'next/server';

import { prisma } from '@/lib/server/prisma';
import { signJwt } from '@/lib/server/jwt';
import { getUserWithProfileFlag } from '@/lib/server/users';
import { handleError } from '@/lib/server/error';

/**
 * Dev/test login bypass. Returns a JWT for a fixed test user.
 * WARNING: this is a convenience bypass. Do not expose it in a real production app.
 */
export async function POST() {
  try {
    const googleId = 'dev-bypass-user';
    const email = 'devuser@mayieat.local';

    const user = await prisma.user.upsert({
      where: { googleId },
      create: {
        googleId,
        email,
        name: 'Dev User',
        subscription: { create: { plan: 'FREE', status: 'ACTIVE', source: 'DEFAULT' } },
      },
      update: {},
    });

    // Safety: ensure subscription exists even if user existed without one.
    await prisma.subscription.upsert({
      where: { userId: user.id },
      create: { userId: user.id, plan: 'FREE', status: 'ACTIVE', source: 'DEFAULT' },
      update: {},
    });

    const jwt = signJwt({ sub: user.id, email: user.email });
    const enriched = await getUserWithProfileFlag(user.id);
    return NextResponse.json({ jwt, user: enriched });
  } catch (err) {
    return handleError(err);
  }
}
