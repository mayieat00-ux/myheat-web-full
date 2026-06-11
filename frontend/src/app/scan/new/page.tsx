import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { ScanPageClient } from '@/components/ScanPageClient';

export default async function ScanCameraPage() {
  const session = await auth();
  if (!session?.backendJwt) {
    redirect('/login?callbackUrl=/scan/new');
  }
  if (!session.profileComplete) {
    redirect('/onboarding');
  }
  return <ScanPageClient />;
}
