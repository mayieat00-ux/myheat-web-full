import { Router } from 'express';
import { z } from 'zod';

import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';
import { verifyGoogleIdToken } from '../services/googleAuth.js';
import { getUserWithProfileFlag, upsertUserFromGoogle } from '../services/users.js';
import { signJwt } from '../utils/jwt.js';

export const authRouter = Router();

const googleBodySchema = z.object({
  idToken: z.string().min(10),
});

authRouter.post(
  '/google',
  asyncHandler(async (req, res) => {
    const { idToken } = googleBodySchema.parse(req.body);
    const profile = await verifyGoogleIdToken(idToken);
    const user = await upsertUserFromGoogle(profile);
    const jwt = signJwt({ sub: user.id, email: user.email });

    const enriched = await getUserWithProfileFlag(user.id);
    res.json({ jwt, user: enriched });
  }),
);

authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = (req as AuthedRequest).user.id;
    const me = await getUserWithProfileFlag(userId);
    res.json({ user: me });
  }),
);

/**
 * Dev-only login bypass. Returns a JWT for a fixed test user.
 * Disabled when NODE_ENV !== 'development'.
 * REMOVE before any production deploy.
 */
authRouter.post(
  '/dev-login',
  asyncHandler(async (_req, res) => {
    if (env.NODE_ENV !== 'development') {
      throw new HttpError(404, 'not_found', 'Endpoint disabled');
    }

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
    res.json({ jwt, user: enriched });
  }),
);
