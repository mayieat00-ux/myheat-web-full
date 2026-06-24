import { NextResponse } from 'next/server';

import { getAuthenticatedUser } from '@/lib/server/session';
import { getUserWithProfileFlag } from '@/lib/server/users';
import { handleError } from '@/lib/server/error';

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    const me = await getUserWithProfileFlag(user.id);
    return NextResponse.json({ user: me });
  } catch (err) {
    return handleError(err);
  }
}
