import { redirect } from 'next/navigation';

export const metadata = { robots: { index: false, follow: false } };

// Backend emails link to /onboarding/{token}; canonical wizard route is /onboard/{token}.
export default async function OnboardingAlias({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  redirect(`/onboard/${token}`);
}