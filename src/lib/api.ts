// Frontend API client. Two flavors:
//   - serverFetch: for Server Components / route handlers (reads JWT via auth())
//   - clientFetch: for Client Components (reads JWT from session via useSession)
//
// Throws ApiError on non-2xx responses. Always parses JSON when present.

const isServer = typeof window === 'undefined';
const SERVER_API_URL = `${(process.env.AUTH_URL ?? 'http://localhost:3001').replace(/\/$/, '')}/api/v1`;
const CLIENT_API_URL = '/api/v1';
const PUBLIC_API_URL = isServer ? SERVER_API_URL : CLIENT_API_URL;

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

interface FetchOpts {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  jwt?: string;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

async function rawFetch<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const { method = 'GET', body, jwt, headers = {}, signal } = opts;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const finalHeaders: Record<string, string> = { Accept: 'application/json', ...headers };
  if (body !== undefined && !isFormData) finalHeaders['Content-Type'] = 'application/json';
  if (jwt) finalHeaders.Authorization = `Bearer ${jwt}`;

  const res = await fetch(`${PUBLIC_API_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
    signal,
    cache: 'no-store',
  });

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  let json: unknown;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      // The response wasn't JSON — usually an HTML page (a redirect to /login
      // or a 404 error). Surface something useful instead of a raw "Unexpected
      // token" SyntaxError.
      throw new ApiError(
        res.status,
        'non_json_response',
        res.ok
          ? 'Server returned a non-JSON response. Is the Next.js dev server running on port 3001?'
          : `Request failed with status ${res.status} (non-JSON response).`,
      );
    }
  }

  if (!res.ok) {
    const obj = (json ?? {}) as { error?: string; message?: string; details?: unknown };
    throw new ApiError(
      res.status,
      obj.error ?? 'http_error',
      obj.message ?? `Request failed with status ${res.status}`,
      obj.details,
    );
  }
  return json as T;
}

/**
 * Server-side fetch — pulls the backend JWT from the auth session.
 * Use in Server Components, route handlers, server actions.
 */
export async function serverFetch<T>(
  path: string,
  opts: Omit<FetchOpts, 'jwt'> = {},
): Promise<T> {
  const { auth } = await import('@/auth');
  const session = await auth();
  return rawFetch<T>(path, { ...opts, jwt: session?.backendJwt });
}

/**
 * Client-side fetch — caller passes the JWT (usually from useSession()).
 */
export function clientFetch<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  return rawFetch<T>(path, opts);
}
