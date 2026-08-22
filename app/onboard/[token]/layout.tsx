import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Carrier Onboarding | AIK Freight Dispatch',
};

export default function OnboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}