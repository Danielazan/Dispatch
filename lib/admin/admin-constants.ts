/* ============ admin-constants v1 ============ */

/** Flip to false when wiring the real backend (PART 8 integration pass). */
export const ADMIN_DEMO_MODE = true;

export const DEMO_SNAPSHOT_DATE = 'May 20, 2025';
export const DEMO_COMPARE_LABEL = 'vs Apr 20, 2025';

export const ADMIN_ROUTES = {
  login: '/admin/login',
  dashboard: '/admin/dashboard',
  leads: '/admin/leads',
  carriers: '/admin/carriers',
  carrierNew: '/admin/carriers/new',
  onboarding: '/admin/onboarding',
  compliance: '/admin/compliance',
  verifications: '/admin/verifications',
  agreements: '/admin/agreements',
  approvals: '/admin/approvals',
  activations: '/admin/activations',
  loads: '/admin/loads',
  loadsNew: '/admin/loads/new',
  staff: '/admin/staff',
  staffNew: '/admin/staff/new',
  roles: '/admin/roles',
  settings: '/admin/settings',
  audit: '/admin/audit-logs',
  documents: '/admin/documents',
  reports: '/admin/reports',
} as const;

export const motion = {
  fast: 0.18, control: 0.32, medium: 0.48, weighted: 0.68, cinematic: 1.15,
  easeFast: 'power2.out', easeControl: 'power3.out', easeWeighted: 'power3.inOut',
} as const;

export const stagger = { micro: 0.035, compact: 0.065, standard: 0.11, cinematic: 0.16 } as const;