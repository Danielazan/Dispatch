/* ============ admin-types v1 ============ */
import type { LucideIcon } from 'lucide-react';

/** Locked 12-key permission catalog (Integration Reference §26.2). */
export type PermKey =
  | 'leads.view' | 'leads.resend' | 'carriers.view' | 'carriers.approve'
  | 'documents.view' | 'documents.review' | 'verification.view' | 'verification.override'
  | 'loads.view' | 'loads.manage' | 'staff.manage' | 'roles.manage' | '*';

export interface AdminRoleSummary { id: string; name: string; isSuperAdmin: boolean; }
/** Mirrors GET /api/admin/auth/me `data.adminUser`. */
export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: AdminRoleSummary;
  permissions: PermKey[];
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  trendPct: number;
  trend: number[];
  comparison: string;
  icon: LucideIcon;
  priority?: 'normal' | 'attention';
}

export interface PipelineStage {
  id: string;
  label: string;
  count: number;
  percentage: number;
  status: 'complete' | 'active' | 'pending' | 'blocked';
  route: string;
}

export interface ActivityEvent {
  id: string;
  type: string;
  title: string;
  entity: string;
  timestamp: string;
  status: 'success' | 'pending' | 'danger' | 'neutral';
}

export interface VerificationRow {
  id: string;
  mcNumber: string;
  carrierName: string;
  stage: 'Insurance' | 'Authority' | 'Safety';
  submittedAt: string;
  priority: 'high' | 'medium' | 'low';
}

export interface CarrierRegion {
  id: string;
  x: number; // percentage coords — resilient to image scaling
  y: number;
  intensity: 'high' | 'medium' | 'low';
  count: number;
  label: string;
}

/** Backend paginated list envelope (Integration Reference §2.2). */
export interface Paged<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface DashboardSnapshot {
  metrics: DashboardMetric[];
  pipeline: PipelineStage[];
  pipelineTotal: number;
  activities: ActivityEvent[];
  verifications: Paged<VerificationRow>;
  carrierRegions: CarrierRegion[];
  systemStatus: { label: string; ok: boolean };
}