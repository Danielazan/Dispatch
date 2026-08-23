/* ============ admin-types v2 ============ */
/** Locked 12-key permission catalog (Integration Reference §26.2). */
export type PermKey =
  | 'leads.view' | 'leads.resend' | 'carriers.view' | 'carriers.approve'
  | 'documents.view' | 'documents.review' | 'verification.view' | 'verification.override'
  | 'loads.view' | 'loads.manage' | 'staff.manage' | 'roles.manage' | '*';

export interface AdminRoleSummary { id: string; name: string; isSuperAdmin: boolean; }

/**
 * v2 (DOC-DIFF-3): `role` nullable + permissions widened to string[] until a raw
 * GET /api/admin/auth/me sample confirms the exact wire shape. The auth provider
 * normalizes every observed shape into this contract.
 */
export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: AdminRoleSummary | null;
  permissions: string[];
}