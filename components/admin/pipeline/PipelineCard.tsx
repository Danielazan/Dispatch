/* ============ PipelineCard v4 ============ */
'use client';
import { MoreVertical } from 'lucide-react';
import type { CarrierSummary } from '@/lib/admin/carrier-types';
import { formatDateTime } from '@/lib/admin/format';
import { StatusBadge } from '@/components/admin/carrier/StatusBadge';

export function PipelineCard({ carrier, onOpen }: { carrier: CarrierSummary; onOpen: (id: string) => void }) {
  return (
    <div data-pipe="card" className="relative min-w-0">
      <button onClick={() => onOpen(carrier.id)}
        className="w-full rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] p-3.5 text-left transition-colors hover:border-[rgba(245,158,11,0.42)]">
        <p className="truncate pr-6 text-[12.5px] font-medium text-[var(--adm-t1)]" title={carrier.legalName ?? undefined}>{carrier.legalName ?? '—'}</p>
        <p className="tnum mt-1 truncate text-[11px] text-[var(--adm-t3)]">{carrier.authorityNumber ?? '—'}</p>
        <span className="mt-2.5 flex min-w-0 items-center justify-between gap-2">
          <span className="tnum min-w-0 truncate text-[10.5px] text-[var(--adm-t4)]">{formatDateTime(carrier.createdAt ?? null)}</span>
          <StatusBadge value={carrier.status ?? ''} />
        </span>
      </button>
      <button aria-label={'Options for ' + (carrier.legalName ?? carrier.id)} onClick={() => onOpen(carrier.id)}
        className="absolute right-2 top-2 rounded p-0.5 text-[var(--adm-t4)] hover:text-[var(--adm-t2)]">
        <MoreVertical size={13} />
      </button>
    </div>
  );
}
