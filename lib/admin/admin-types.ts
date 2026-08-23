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
/* ============ admin-types v3 append (production build fix) ============ */
import type { LucideIcon } from 'lucide-react';
import type { Paged, VerificationRow } from './pipeline-types';

export interface DashboardMetric { id: string; label: string; value: number; trendPct: number; trend: number[]; comparison: string; icon: LucideIcon; priority?: 'attention'; }
export interface PipelineStage { id: string; label: string; count: number; percentage: number; status: 'complete' | 'active' | 'pending'; route: string; }
export interface ActivityEvent { id: string; type: string; title: string; entity: string; timestamp: string; status: 'pending' | 'success' | 'danger' | 'neutral'; }
export interface CarrierRegion { id: string; x: number; y: number; intensity: 'high' | 'medium' | 'low'; count: number; label: string; }
export interface DashboardSnapshot {
  metrics: DashboardMetric[];
  pipeline: PipelineStage[];
  pipelineTotal: number;
  activities: ActivityEvent[];
  verifications: Paged<VerificationRow>;
  carrierRegions: CarrierRegion[];
  systemStatus: { label: string; ok: boolean };
}