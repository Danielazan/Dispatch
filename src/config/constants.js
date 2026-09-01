export const LEAD_STATUS = {
  NEW: 'new',
  LINK_SENT: 'link_sent',
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_SUBMITTED: 'onboarding_submitted',
  CONVERTED: 'converted',
  ABANDONED: 'abandoned',
};

export const ONBOARDING_SESSION_STATUS = {
  ACTIVE: 'active',
  SUBMITTED: 'submitted',
  EXPIRED: 'expired',
  REVOKED: 'revoked',
};

export const CARRIER_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  VERIFICATION_PENDING: 'verification_pending',
  VERIFICATION_PASSED: 'verification_passed',
  VERIFICATION_FAILED: 'verification_failed',
  AGREEMENT_PENDING: 'agreement_pending',
  AGREEMENT_SIGNED: 'agreement_signed',
  ADMIN_REVIEW: 'admin_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
};

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  NOT_FOUND: 'not_found',
  MISMATCH: 'mismatch',
  INCONCLUSIVE: 'inconclusive',
  MANUAL_PENDING: 'manual_pending',
  ADMIN_CONFIRMED: 'admin_confirmed',
  REJECTED: 'rejected',
};

export const AGREEMENT_STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  SIGNED: 'signed',
  DECLINED: 'declined',
  VOIDED: 'voided',
  EXPIRED: 'expired',
  FAILED: 'failed',
};

export const DOCUMENT_TYPE = {
  MC_AUTHORITY_LETTER: 'mc_authority_letter',
  CERTIFICATE_OF_INSURANCE: 'certificate_of_insurance',
  W9_OR_W8BENE: 'w9_or_w8bene',
  NOA: 'noa',
};

export const DOCUMENT_REVIEW_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

export const VERIFICATION_METHOD = {
  FMCSA_API: 'fmcsa_api',
  AGGREGATOR_API: 'aggregator_api',
  FORMAT_CHECK: 'format_check',
  MANUAL_REVIEW: 'manual_review',
};

export const AGREEMENT_METHOD = {
  DOCUSIGN: 'docusign',
  CUSTOM_CAPTURE: 'custom_capture',
};

export const LOAD_SOURCE = {
  INTERNAL: 'internal',
  ONE_TWENTY_THREE_LOADBOARD: 'one_twenty_three_loadboard', // Fixed to match Prisma enum
};

export const LOAD_STATUS = {
  AVAILABLE: 'available',
  NEGOTIATING: 'negotiating',
  BOOKED: 'booked',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const PERMISSIONS = {
  LEADS_VIEW: 'leads.view',
  LEADS_RESEND: 'leads.resend',
  CARRIERS_VIEW: 'carriers.view',
  CARRIERS_APPROVE: 'carriers.approve',
  DOCUMENTS_VIEW: 'documents.view',
  DOCUMENTS_REVIEW: 'documents.review',
  VERIFICATION_VIEW: 'verification.view',
  VERIFICATION_OVERRIDE: 'verification.override',
  LOADS_VIEW: 'loads.view',
  LOADS_MANAGE: 'loads.manage',
  STAFF_MANAGE: 'staff.manage',
  ROLES_MANAGE: 'roles.manage',
};