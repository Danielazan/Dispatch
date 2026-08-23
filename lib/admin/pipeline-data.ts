/* ============ pipeline-data v1 ============ */
import { apiGet } from '@/lib/api-client';
import type { CarrierSummary, Page } from './carrier-types';

export type QueueStatus = 'draft' | 'submitted' | 'admin_review' | 'approved' | 'rejected' | 'active' | 'suspended';

export const ALL_STATUSES: QueueStatus[] = ['draft', 'submitted', 'admin_review', 'approved', 'rejected', 'active', 'suspended'];

export const STATUS_LABELS: Record<QueueStatus, string> = {
  draft: 'Draft', submitted: 'Submitted', admin_review: 'Admin Review', approved: 'Approved',
  active: 'Active', rejected: 'Rejected', suspended: 'Suspended',
};

export interface QueueColumnDef { id: string; title: string; hint: string; statuses: QueueStatus[]; }

/* Columns built ONLY from locked carrier statuses (§8.2) — no invented stages. */
export const QUEUE_COLUMNS: QueueColumnDef[] = [
  { id: 'in_progress', title: 'In Progress', hint: 'draft + submitted — onboarding not yet submitted', statuses: ['draft', 'submitted'] },
  { id: 'admin_review', title: 'Admin Review', hint: 'submitted applications awaiting compliance decision', statuses: ['admin_review'] },
  { id: 'approved', title: 'Approved', hint: 'ready to activate', statuses: ['approved'] },
  { id: 'active', title: 'Active', hint: 'assignable to loads', statuses: ['active'] },
  { id: 'rejected', title: 'Rejected', hint: 'rejection reason on file', statuses: ['rejected'] },
  { id: 'suspended', title: 'Suspended', hint: 'locked status queue', statuses: ['suspended'] },
];

export const PAGE_SIZE = 4;

export function fetchStatusQueue(status: QueueStatus, page = 1, pageSize = PAGE_SIZE): Promise<Page<CarrierSummary>> {
  return apiGet<Page<CarrierSummary>>('/api/carriers?status=' + status + '&page=' + page + '&pageSize=' + pageSize + '&sortBy=created_at&sortOrder=desc');
}
