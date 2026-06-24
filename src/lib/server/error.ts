import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

export function handleError(err: unknown): NextResponse {
  if (err instanceof HttpError) {
    return NextResponse.json(
      { error: err.code, message: err.message, details: err.details },
      { status: err.status },
    );
  }
  if (err instanceof ZodError) {
    return NextResponse.json(
      { error: 'validation_error', details: err.flatten() },
      { status: 400 },
    );
  }
  // eslint-disable-next-line no-console
  console.error('[unhandled error]', err);
  const message = err instanceof Error ? err.message : 'Internal server error';
  return NextResponse.json({ error: 'internal_error', message }, { status: 500 });
}
