// Phase-2 smoke test:
//   1. Create a test user directly via Prisma (skipping Google).
//   2. Sign a backend JWT.
//   3. Print the JWT so we can curl protected routes.
//
// Run: npm -w @mayieat/backend exec -- tsx scripts/smoke-auth.ts

import { prisma } from '../src/config/prisma.js';
import { signJwt } from '../src/utils/jwt.js';

async function main() {
  const email = 'smoketest@mayieat.local';
  const googleId = 'smoke-fake-google-id';

  const user = await prisma.user.upsert({
    where: { googleId },
    create: {
      googleId,
      email,
      name: 'Smoke Test User',
      subscription: { create: { plan: 'FREE', status: 'ACTIVE', source: 'DEFAULT' } },
    },
    update: {},
  });

  // Ensure subscription exists (in case the upsert path didn't create it).
  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: { userId: user.id, plan: 'FREE', status: 'ACTIVE', source: 'DEFAULT' },
    update: {},
  });

  const jwt = signJwt({ sub: user.id, email: user.email });

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ userId: user.id, email: user.email, jwt }));
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
