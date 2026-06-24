import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAuthenticatedUser } from '@/lib/server/session';
import { handleError } from '@/lib/server/error';
import { scanByBarcode } from '@/lib/server/scans';

const barcodeBodySchema = z.object({
  barcode: z.string().min(6).max(14),
});

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    const body = await request.json();
    const { barcode } = barcodeBodySchema.parse(body);
    const result = await scanByBarcode(user.id, barcode);
    return NextResponse.json(result);
  } catch (err) {
    return handleError(err);
  }
}
