import { NextResponse } from 'next/server';

import { getAuthenticatedUser } from '@/lib/server/session';
import { handleError } from '@/lib/server/error';
import { listRecentScans } from '@/lib/server/scans';

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    const { searchParams } = new URL(request.url);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 25)));
    const items = await listRecentScans(user.id, limit);
    return NextResponse.json({ items });
  } catch (err) {
    return handleError(err);
  }
}
