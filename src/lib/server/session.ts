import { prisma } from './prisma';
import { verifyJwt } from './jwt';
import { HttpError } from './error';

export interface AuthUser {
  id: string;
  email: string;
  isAdmin: boolean;
}

function extractBearer(header: string | null): string | null {
  if (!header || !header.toLowerCase().startsWith('bearer ')) return null;
  return header.slice(7).trim() || null;
}

export async function getAuthenticatedUser(request: Request): Promise<AuthUser> {
  const token = extractBearer(request.headers.get('authorization'));
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

  return user;
}
