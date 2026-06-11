// Centralized env access. The frontend has two contexts:
//
//   - On the SERVER (RSC, route handlers, jwt callback) → talk to the backend
//     directly via its absolute URL. Default: http://localhost:4000/api/v1.
//   - On the CLIENT (browser, including phones on the LAN) → use a relative
//     URL. The Next.js rewrite in next.config.mjs proxies /api/v1/* to the
//     backend, so the phone only needs to reach port 3001.
//
// This split is what makes the dev server work when accessed from a phone on
// the same WiFi.

const isServer = typeof window === 'undefined';

const SERVER_API_URL =
  process.env.INTERNAL_API_URL ?? 'http://localhost:4000/api/v1';
const CLIENT_API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';

export const PUBLIC_API_URL = isServer ? SERVER_API_URL : CLIENT_API_URL;
