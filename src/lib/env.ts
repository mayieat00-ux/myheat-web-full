// Centralized env access. The API now lives inside the Next.js app, so the
// client uses a relative URL and the server uses an absolute URL pointing at
// the same app (required for fetch() during the Auth.js JWT callback).

const isServer = typeof window === 'undefined';

const SERVER_API_URL = process.env.INTERNAL_API_URL ?? 'http://localhost:3001/api/v1';
const CLIENT_API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';

export const PUBLIC_API_URL = isServer ? SERVER_API_URL : CLIENT_API_URL;
