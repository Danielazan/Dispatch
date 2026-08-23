/* ============ CarrierFileHeader v2 ============ */
'use client';
import Link from 'next/link';
import { RefreshCw } from 'lucide-react';
import { ADMIN_ROUTES } from '@/lib/admin/admin-constants';
import { getLatestAgreement } from '@/lib/admin/carrier-utils';
import type { CarrierFile } from '@/lib/admin/carrier-types';
import { formatDateTime } from '@/lib/admin/format';
import { StatusBadge } from './StatusBadge';

export function blockingSentence(f: CarrierFile): string | null {
  if (f.status === 'rejected') return null;
  if (f.status === 'approved') return 'Approved — ready to activate. Only activation makes this carrier assignable to loads.';
  if (f.status === 'active') return 'Active carrier — assignable to loads.';
  if (f.status !== 'admin_review') return null;
  const blocks: string[] = [];
  if (f.verificationStatus !== 'admin_confirmed') blocks.push('verification — awaiting manual admin review');
  if (getLatestAgreement(f)?.status !== 'signed') blocks.push('agreement — awaiting signature');
  if (blocks.length === 0) return 'All preconditions met — ready for approval decision.';
  return 'Blocked on ' + blocks.join(' and ') + '.';
}

export function CarrierFileHeader({ file, onRefresh, refreshing }: { file: CarrierFile; onRefresh: () => void; refreshing: boolean }) {
  const sentence = blockingSentence(file);
  const leadId = file.onboardingSession?.lead?.id;
  return (
    <div className="space-y-4">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11.5px] text-[var(--adm-t4)]">
        <Link href={ADMIN_ROUTES.dashboard} className="hover:text-[var(--adm-t2)]">Dashboard</Link>
        <span aria-hidden="true">›</span>
        <Link href={ADMIN_ROUTES.carriers} className="hover:text-[var(--adm-t2)]">Carriers</Link>
        <span aria-hidden="true">›</span>
        <span className="text-[var(--adm-t2)]">Carrier File</span>
      </nav>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[26px] font-extrabold leading-8 text-[var(--adm-t1)]">{file.legalName}</h1>
          <p className="tnum mt-1 text-[12px] text-[var(--adm-t3)]">
            {file.authorityNumber ?? 'No authority on file'} • Submitted {formatDateTime(file.onboardingSession?.submittedAt ?? file.createdAt)}
            {leadId && <> • Lead: {leadId}</>}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Carrier statuses">
            <StatusBadge value={file.status} />
            <StatusBadge value={file.verificationStatus} label={'VERIFICATION: ' + (file.verificationStatus ?? '').replace(/_/g, ' ').toUpperCase()} />
            <StatusBadge value={file.agreementStatus} label={'AGREEMENT: ' + (file.agreementStatus ?? '').toUpperCase()} />
          </div>
        </div>
        <button onClick={onRefresh} disabled={refreshing} className="flex h-10 items-center gap-2.5 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s1)] px-4 text-[12.5px] text-[var(--adm-t2)] hover:border-[rgba(245,158,11,0.42)] disabled:opacity-50">
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>
      {file.status === 'rejected' ? (
        <p className="rounded-md border border-[rgba(239,68,68,0.4)] bg-[rgba(239,68,68,0.08)] px-4 py-3 text-[12px] text-[var(--adm-danger)]">
          Rejected — {file.rejectReason ?? 'no reason recorded'}.
        </p>
      ) : sentence ? (
        <p className="rounded-md border border-[rgba(245,158,11,0.35)] bg-[rgba(245,158,11,0.06)] px-4 py-3 text-[12px] text-[var(--adm-a3)]">{sentence}</p>
      ) : null}
    </div>
  );
}
