/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mayieat/shared'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.openfoodfacts.org' },
      { protocol: 'https', hostname: 'static.openfoodfacts.org' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  // Proxy backend API calls through the Next.js dev server so the browser
  // (including phones on the LAN) only needs to reach port 3001. Without this,
  // a phone hitting http://<PC-IP>:3001 would try to fetch http://localhost:4000
  // from its OWN localhost and fail.
  async rewrites() {
    const backend = process.env.INTERNAL_API_BASE || 'http://localhost:4000';
    return [
      { source: '/api/v1/:path*', destination: `${backend}/api/v1/:path*` },
    ];
  },
};

export default nextConfig;
