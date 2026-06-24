import { NextResponse } from 'next/server';

import { getAuthenticatedUser } from '@/lib/server/session';
import { handleError } from '@/lib/server/error';
import { getScanById } from '@/lib/server/scans';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getAuthenticatedUser(request);
    const { id } = await params;
    const result = await getScanById(user.id, id);
    return NextResponse.json(result);
  } catch (err) {
    return handleError(err);
  }
}
