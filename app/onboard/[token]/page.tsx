import { ApplicationShell } from '@/components/onboarding/ApplicationShell';
import { OnboardingProvider } from '@/lib/onboarding/context';

// Next.js 16: `params` is a Promise and MUST be awaited (sync dynamic APIs removed)
export default async function OnboardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <OnboardingProvider token={token}>
      <ApplicationShell />
    </OnboardingProvider>
  );
}