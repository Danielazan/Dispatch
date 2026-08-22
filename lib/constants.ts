/* ============ lib/constants v1 ============ */
/**
 * Verbatim frontend mirror of backend `src/config/constants.js`
 * (captured 2026-08-22 via `Get-Content src\config\constants.js` — PART 1 / DOC-DIFF).
 *
 * DOC-DIFF RESOLUTION (Decision 9 / Integration Ref §8.2):
 *  - UI may branch ONLY on the LIVE model:
 *      carrier.status             → draft | submitted | admin_review | approved | rejected | active | suspended
 *      carrier.verificationStatus → pending | verified | not_found | mismatch | inconclusive | manual_pending | admin_confirmed | rejected
 *      carrier.agreementStatus    → pending | sent | signed | declined | voided | expired | failed
 *  - Legacy carrier-status values (verification_*, agreement_*) are mirrored for catalog
 *    fidelity ONLY. They are deprecated remnants — DO NOT branch on them in UI logic.
 *  - LOAD_SOURCE: backend + Prisma win → 'one_twenty_three_loadboard'.
 *    (Integration Ref §8.8 '123loadboard' is STALE — flagged for doc update per S6.)
 */

export const LEAD_STATUS = {
  NEW: 'new',
  LINK_SENT: 'link_sent',
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_SUBMITTED: 'onboarding_submitted',
  CONVERTED: 'converted',
  ABANDONED: 'abandoned',
} as const;

export const ONBOARDING_SESSION_STATUS = {
  ACTIVE: 'active',
  SUBMITTED: 'submitted',
  EXPIRED: 'expired',
  REVOKED: 'revoked',
} as const;

export const CARRIER_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  /* LEGACY (deprecated remnants — mirror-only, never branch): */
  VERIFICATION_PENDING: 'verification_pending',
  VERIFICATION_PASSED: 'verification_passed',
  VERIFICATION_FAILED: 'verification_failed',
  AGREEMENT_PENDING: 'agreement_pending',
  AGREEMENT_SIGNED: 'agreement_signed',
  /* LIVE model: */
  ADMIN_REVIEW: 'admin_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
} as const;

/** LIVE-MODEL subset — the ONLY carrier.status values UI logic may branch on. */
export const CARRIER_STATUS_LIVE = {
  DRAFT: CARRIER_STATUS.DRAFT,
  SUBMITTED: CARRIER_STATUS.SUBMITTED,
  ADMIN_REVIEW: CARRIER_STATUS.ADMIN_REVIEW,
  APPROVED: CARRIER_STATUS.APPROVED,
  REJECTED: CARRIER_STATUS.REJECTED,
  ACTIVE: CARRIER_STATUS.ACTIVE,
  SUSPENDED: CARRIER_STATUS.SUSPENDED,
} as const;

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  NOT_FOUND: 'not_found',
  MISMATCH: 'mismatch',
  INCONCLUSIVE: 'inconclusive',
  MANUAL_PENDING: 'manual_pending',
  ADMIN_CONFIRMED: 'admin_confirmed',
  REJECTED: 'rejected',
} as const;

export const AGREEMENT_STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  SIGNED: 'signed',
  DECLINED: 'declined',
  VOIDED: 'voided',
  EXPIRED: 'expired',
  FAILED: 'failed',
} as const;

export const DOCUMENT_TYPE = {
  MC_AUTHORITY_LETTER: 'mc_authority_letter',
  CERTIFICATE_OF_INSURANCE: 'certificate_of_insurance',
  W9_OR_W8BENE: 'w9_or_w8bene',
  NOA: 'noa',
} as const;

export const DOCUMENT_REVIEW_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
} as const;

export const VERIFICATION_METHOD = {
  FMCSA_API: 'fmcsa_api',
  AGGREGATOR_API: 'aggregator_api',
  FORMAT_CHECK: 'format_check',
  MANUAL_REVIEW: 'manual_review',
} as const;

export const AGREEMENT_METHOD = {
  DOCUSIGN: 'docusign',
  CUSTOM_CAPTURE: 'custom_capture',
} as const;

export const LOAD_SOURCE = {
  INTERNAL: 'internal',
  ONE_TWENTY_THREE_LOADBOARD: 'one_twenty_three_loadboard', // Fixed to match Prisma enum (backend wins)
} as const;

export const LOAD_STATUS = {
  AVAILABLE: 'available',
  NEGOTIATING: 'negotiating',
  BOOKED: 'booked',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

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
} as const;