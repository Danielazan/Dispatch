/* ============ steps v4 - labels matching design images ============ */
export type OnboardingStepId =
  | 'company'
  | 'equipment'
  | 'preferences'
  | 'billing'
  | 'directory'
  | 'documents'
  | 'submit';

export interface OnboardingStep {
  id: OnboardingStepId;
  index: number;
  label: string;
  section: number;
  description: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'company', index: 1, label: 'Company Profile & Authorities', section: 1,
    description: 'Provide your legal business information and operating authority numbers as they appear on official documents.'
  },
  {
    id: 'equipment', index: 2, label: 'Technical Equipment', section: 2,
    description: 'Tell us about your active trucks, trailer configurations, and equipment certifications.'
  },
  {
    id: 'preferences', index: 3, label: 'Freight Preferences', section: 3,
    description: 'Share your preferred origin and destination regions, target rates, and layover preferences.'
  },
  {
    id: 'billing', index: 4, label: 'Billing & Payment', section: 4,
    description: 'Select your payment method and provide factoring company details if applicable.'
  },
  {
    id: 'directory', index: 5, label: 'Directory & Contacts', section: 5,
    description: 'Provide dispatch and accounting contact information for our carrier directory.'
  },
  {
    id: 'documents', index: 6, label: 'Document Uploads', section: 6,
    description: 'Upload required compliance documents. One active file per type; re-uploading replaces the previous file.'
  },
  {
    id: 'submit', index: 7, label: 'Legal Authorization', section: 7,
    description: 'Review the authorization agreement, provide consent, and sign to submit your application.'
  },
];