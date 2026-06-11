import type { NextFunction, Request, Response } from 'express';

import { prisma } from '../config/prisma.js';
import { verifyJwt } from '../utils/jwt.js';
import { HttpError } from './error.js';

export interface AuthedRequest extends Request {
  user: {
    id: string;
    email: string;
    isAdmin: boolean;
  };
}

function extractBearer(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.toLowerCase().startsWith('bearer ')) return null;
  return header.slice(7).trim() || null;
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const token = extractBearer(req);
    if (!token) throw new HttpError(401, 'unauthenticated', 'Missing bearer token');

    let payload;
    try {
      payload = verifyJwt(token);
    } catch {
      throw new HttpError(401, 'unauthenticated', 'Invalid or expired token');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, isAdmin: true },
    });
    if (!user) throw new HttpError(401, 'unauthenticated', 'User no longer exists');

    (req as AuthedRequest).user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export async function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const user = (req as AuthedRequest).user;
  if (!user) {
    next(new HttpError(401, 'unauthenticated', 'Auth required'));
    return;
  }
  if (!user.isAdmin) {
    next(new HttpError(403, 'forbidden', 'Admin privileges required'));
    return;
  }
  next();
}

export async function requireProfile(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const user = (req as AuthedRequest).user;
  if (!user) {
    next(new HttpError(401, 'unauthenticated', 'Auth required'));
    return;
  }
  const profile = await prisma.userProfile.findUnique({ where: { userId: user.id } });
  if (!profile) {
    next(
      new HttpError(409, 'profile_incomplete', 'Complete your profile first', {
        profileIncomplete: true,
      }),
    );
    return;
  }
  next();
}
