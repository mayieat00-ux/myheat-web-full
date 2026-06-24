import { auth } from '@/auth';
import { LandingCTA } from '@/components/landing/CTA';
import { LandingFAQ } from '@/components/landing/FAQ';
import { LandingFeatures } from '@/components/landing/Features';
import { LandingFooter } from '@/components/landing/Footer';
import { LandingHeader } from '@/components/landing/Header';
import { LandingHero } from '@/components/landing/Hero';
import { LandingHowItWorks } from '@/components/landing/HowItWorks';
// import { LandingPricing } from '@/components/landing/Pricing';

export default async function HomePage() {
  const session = await auth();
  const isAuthed = Boolean(session?.backendJwt);

  const ctaHref = isAuthed ? (session?.profileComplete ? '/scan' : '/onboarding') : '/login';
  const ctaLabel = isAuthed
    ? session?.profileComplete
      ? 'Open scanner'
      : 'Finish setup'
    : 'Get started free';

  return (
    <div className="bg-white">
      <LandingHeader isAuthed={isAuthed} />
      <main>
        <LandingHero ctaHref={ctaHref} ctaLabel={ctaLabel} />
        <LandingFeatures />
        <LandingHowItWorks />
        {/* <LandingPricing /> */}
        <LandingFAQ />
        <LandingCTA ctaHref={ctaHref} ctaLabel={ctaLabel} />
      </main>
      <LandingFooter />
    </div>
  );
}
