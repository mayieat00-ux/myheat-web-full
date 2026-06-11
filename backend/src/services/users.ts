import type { User } from '@prisma/client';

import { prisma } from '../config/prisma.js';
import type { GoogleProfile } from './googleAuth.js';

/**
 * Upsert a user from a verified Google profile.
 * On first creation, also creates the default FREE Subscription row.
 */
export async function upsertUserFromGoogle(profile: GoogleProfile): Promise<User> {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.user.findUnique({ where: { googleId: profile.googleId } });
    if (existing) {
      return tx.user.update({
        where: { id: existing.id },
        data: {
          email: profile.email,
          name: profile.name,
          image: profile.picture,
        },
      });
    }

    const user = await tx.user.create({
      data: {
        googleId: profile.googleId,
        email: profile.email,
        name: profile.name,
        image: profile.picture,
      },
    });

    await tx.subscription.create({
      data: {
        userId: user.id,
        plan: 'FREE',
        status: 'ACTIVE',
        source: 'DEFAULT',
      },
    });

    return user;
  });
}

export async function getUserWithProfileFlag(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: { select: { userId: true } },
      subscription: { select: { plan: true, status: true } },
    },
  });
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    isAdmin: user.isAdmin,
    profileComplete: user.profile !== null,
    subscription: user.subscription
      ? { plan: user.subscription.plan, status: user.subscription.status }
      : { plan: 'FREE' as const, status: 'ACTIVE' as const },
  };
}
