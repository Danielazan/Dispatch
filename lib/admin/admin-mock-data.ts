/* ============ admin-mock-data v1 ============ */
import {
  Truck, ClipboardList, ShieldCheck, ClipboardCheck, BadgeCheck, Package,
  FileText, CheckCircle2, AlertTriangle, Shield,
} from 'lucide-react';
import { ADMIN_ROUTES, DEMO_COMPARE_LABEL } from './admin-constants';
import type { AdminUser, DashboardSnapshot } from './admin-types';

/** Mirrors GET /api/admin/auth/me for the seeded Super Admin (dev credential set). */
export const MOCK_ADMIN_USER: AdminUser = {
  id: 'adm-001',
  fullName: 'Marcus Johnson',
  email: 'admin@aikfreight.com',
  role: { id: 'role-sa', name: 'Super Admin', isSuperAdmin: true },
  permissions: ['*'],
};

/** Demo session metadata — fictional, per design reference. Never real PII. */
export const MOCK_SESSION = { ip: '102.47.11.23', device: 'Windows • Chrome', lastLogin: 'Today, 8:42 AM' };

const SNAPSHOT: DashboardSnapshot = {
  metrics: [
    { id: 'total-carriers', label: 'Total Carriers', value: 2451, trendPct: 12.5, trend: [42, 45, 44, 49, 52, 55, 61], comparison: DEMO_COMPARE_LABEL, icon: Truck },
    { id: 'onboarding-pipeline', label: 'Onboarding Pipeline', value: 312, trendPct: 8.3, trend: [30, 32, 31, 34, 36, 35, 38], comparison: DEMO_COMPARE_LABEL, icon: ClipboardList },
    { id: 'pending-verifications', label: 'Pending Verifications', value: 84, trendPct: 15.7, trend: [18, 22, 21, 26, 25, 29, 32], comparison: DEMO_COMPARE_LABEL, icon: ShieldCheck, priority: 'attention' },
    { id: 'pending-approvals', label: 'Pending Approvals', value: 27, trendPct: 28.6, trend: [8, 10, 9, 12, 14, 13, 16], comparison: DEMO_COMPARE_LABEL, icon: ClipboardCheck, priority: 'attention' },
    { id: 'active-carriers', label: 'Active Carriers', value: 1892, trendPct: 10.1, trend: [35, 37, 36, 40, 42, 44, 47], comparison: DEMO_COMPARE_LABEL, icon: BadgeCheck },
    { id: 'active-loads', label: 'Active Loads', value: 156, trendPct: 7.2, trend: [22, 24, 23, 26, 27, 29, 30], comparison: DEMO_COMPARE_LABEL, icon: Package },
  ],
  pipeline: [
    { id: 'submitted', label: 'Application Submitted', count: 118, percentage: 37.8, status: 'complete', route: `${ADMIN_ROUTES.leads}?status=onboarding_submitted` },
    { id: 'documents', label: 'Documents Uploaded', count: 96, percentage: 30.8, status: 'complete', route: `${ADMIN_ROUTES.onboarding}?stage=documents` },
    { id: 'verification', label: 'Verification In Progress', count: 54, percentage: 17.3, status: 'active', route: `${ADMIN_ROUTES.verifications}?status=pending` },
    { id: 'agreement', label: 'Agreement Pending', count: 28, percentage: 9.0, status: 'pending', route: `${ADMIN_ROUTES.agreements}?status=pending` },
    { id: 'ready', label: 'Ready for Approval', count: 12, percentage: 3.8, status: 'pending', route: ADMIN_ROUTES.approvals },
    { id: 'approved', label: 'Approved / Activate', count: 4, percentage: 1.3, status: 'pending', route: ADMIN_ROUTES.activations },
  ],
  pipelineTotal: 312,
  activities: [
    { id: 'ev1', type: 'application', title: 'New carrier application submitted', entity: 'MC# 1234567 • Johnson Logistics LLC', timestamp: '2m ago', status: 'pending' },
    { id: 'ev2', type: 'verification', title: 'Verification completed', entity: 'MC# 9876543 • Prime Haulers Inc.', timestamp: '8m ago', status: 'pending' },
    { id: 'ev3', type: 'approval', title: 'Carrier approved', entity: 'MC# 4567890 • Swift Transport Group', timestamp: '15m ago', status: 'success' },
    { id: 'ev4', type: 'load', title: 'Load assigned', entity: 'Load #L-55678 • Dallas, TX → Atlanta, GA', timestamp: '22m ago', status: 'pending' },
    { id: 'ev5', type: 'document', title: 'Document expired', entity: 'MC# 1122334 • Blue Line Freight', timestamp: '35m ago', status: 'danger' },
    { id: 'ev6', type: 'system', title: 'System backup completed', entity: 'Scheduled job • node-cron', timestamp: '45m ago', status: 'neutral' },
  ],
  verifications: {
    items: [
      { id: 'v1', mcNumber: 'MC# 2345678', carrierName: 'Titan Freight Systems', stage: 'Insurance', submittedAt: 'May 20, 2025', priority: 'high' },
      { id: 'v2', mcNumber: 'MC# 3456789', carrierName: 'Road King Logistics', stage: 'Authority', submittedAt: 'May 20, 2025', priority: 'high' },
      { id: 'v3', mcNumber: 'MC# 4567891', carrierName: 'Summit Transport LLC', stage: 'Safety', submittedAt: 'May 19, 2025', priority: 'medium' },
      { id: 'v4', mcNumber: 'MC# 5678912', carrierName: 'Velocity Carriers Inc.', stage: 'Insurance', submittedAt: 'May 19, 2025', priority: 'medium' },
      { id: 'v5', mcNumber: 'MC# 6789123', carrierName: 'Northern Star Freight', stage: 'Authority', submittedAt: 'May 18, 2025', priority: 'low' },
    ],
    page: 1, pageSize: 5, totalItems: 84, totalPages: 17,
  },
  carrierRegions: [
    { id: 'midwest', x: 62, y: 30, intensity: 'high', count: 286, label: 'Midwest' },
    { id: 'northeast', x: 84, y: 26, intensity: 'high', count: 232, label: 'Northeast' },
    { id: 'california', x: 8, y: 40, intensity: 'medium', count: 187, label: 'California' },
    { id: 'south', x: 48, y: 55, intensity: 'medium', count: 164, label: 'South' },
    { id: 'southeast', x: 70, y: 50, intensity: 'medium', count: 128, label: 'Southeast' },
    { id: 'mountain', x: 30, y: 38, intensity: 'low', count: 41, label: 'Mountain' },
    { id: 'pacific-nw', x: 11, y: 14, intensity: 'low', count: 38, label: 'Pacific NW' },
    { id: 'florida', x: 76, y: 62, intensity: 'low', count: 44, label: 'Florida' },
  ],
  systemStatus: { label: 'All Systems Operational', ok: true },
};

/**
 * Typed mock adapter. Integration pass: replace body with real api-client calls
 * (GET leads/carriers/loads/verification-results) and map into DashboardSnapshot.
 */
export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  await new Promise((r) => setTimeout(r, 450)); // simulated latency so loading states are visible
  return SNAPSHOT;
}