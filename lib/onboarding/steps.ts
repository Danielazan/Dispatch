export type OnboardingStepId = 'company' | 'authority' | 'insurance' | 'fleet' | 'documents' | 'review' | 'submit';

export interface OnboardingStep {
  id: OnboardingStepId;
  index: number;
  label: string;
  section: number;
  description: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: 'company', index: 1, label: 'Business Information', section: 1,
    description: 'Tell us about your business. This information helps us set up your carrier profile and ensures we can operate together safely and in compliance.' },
  { id: 'authority', index: 2, label: 'Authority & Compliance', section: 1,
    description: 'Your operating authority as it appears on FMCSA documentation. These numbers are used for verification.' },
  { id: 'insurance', index: 3, label: 'Insurance Information', section: 3,
    description: 'Coverage details for your operation. Your Certificate of Insurance is uploaded in Documents Upload.' },
  { id: 'fleet', index: 4, label: 'Driver & Fleet Details', section: 4,
    description: 'How you operate and how you get paid. Payment preference determines whether a Notice of Assignment is required.' },
  { id: 'documents', index: 5, label: 'Documents Upload', section: 5,
    description: 'Mandatory compliance documents. One active file per type — re-uploading replaces the previous file.' },
  { id: 'review', index: 6, label: 'Review & Agreement', section: 5,
    description: 'Confirm everything is accurate before authorization. After submission your application is locked for review.' },
  { id: 'submit', index: 7, label: 'Submit Application', section: 7,
    description: 'Read the authorization, consent, and sign. This is the point of no return for this application.' },
];