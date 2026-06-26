import { NextResponse, type NextRequest } from 'next/server';

import { handlers } from '@/auth';

function wrap(method: 'GET' | 'POST') {
  const handler = handlers[method];
  return async (req: NextRequest) => {
    try {
      return (await handler(req)) as Response;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`[auth] ${method} /api/auth/[...nextauth] failed:`, err);
      return NextResponse.json(
        {
          error: 'auth_handler_error',
          message: err instanceof Error ? err.message : 'Unknown auth handler error',
        },
        { status: 500 },
      );
    }
  };
}

export const GET = wrap('GET');
export const POST = wrap('POST');
