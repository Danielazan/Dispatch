/* ============ PendingVerifications v2 ============ */
'use client';
import Link from 'next/link';
import { ArrowRight, Eye, ChevronRight } from 'lucide-react';
import { ADMIN_ROUTES } from '@/lib/admin/admin-constants';
import type { Paged, VerificationRow } from '@/lib/admin/pipeline-types';

const STAGE_STYLE: Record<VerificationRow['stage'], { bg: string; fg: string }> = {
  Insurance: { bg: 'rgba(217,119,6,0.18)', fg: '#ffbd45' },
  Authority: { bg: 'rgba(245,158,11,0.16)', fg: '#e7c14a' },
  Safety: { bg: 'rgba(202,178,10,0.16)', fg: '#e3d26b' },
};
const PRIORITY: Record<VerificationRow['priority'], { dot: string; label: string }> = {
  high: { dot: 'var(--adm-danger)', label: 'High' },
  medium: { dot: 'var(--adm-warn)', label: 'Medium' },
  low: { dot: 'var(--adm-ok)', label: 'Low' },
};

export function PendingVerifications({ data }: { data: Paged<VerificationRow> }) {
  const { items, totalItems, page, pageSize } = data;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <section
      data-dash="panel"
      aria-label={`Pending verifications, ${totalItems} items`}
      className="rounded-lg border border-[var(--adm-b1)]"
      style={{ background: 'var(--adm-s1)' }}
    >
      <div className="flex items-center gap-3 px-5 pt-5">
        <h2 className="text-[13px] font-semibold tracking-[0.14em] text-[var(--adm-t2)]">PENDING VERIFICATIONS</h2>
        <span className="tnum rounded-md px-2 py-0.5 text-[11px] font-bold" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--adm-a3)' }}>
          {totalItems}
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-[12.5px]">
          <thead>
            <tr className="text-[10.5px] tracking-[0.14em] text-[var(--adm-t4)]">
              <th className="px-5 py-2.5 font-semibold">MC NUMBER</th>
              <th className="px-3 py-2.5 font-semibold">CARRIER NAME</th>
              <th className="px-3 py-2.5 font-semibold">STAGE</th>
              <th className="px-3 py-2.5 font-semibold">SUBMITTED</th>
              <th className="px-3 py-2.5 font-semibold">PRIORITY</th>
              <th className="px-5 py-2.5 text-right font-semibold">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id} data-dash="vrow" className="adm-vrow border-t transition-colors hover:bg-[var(--adm-s2)]" style={{ borderColor: 'var(--adm-b1)' }}>
                <td className="tnum px-5 py-3 text-[var(--adm-t2)]">{row.mcNumber}</td>
                <td className="px-3 py-3 font-medium text-[var(--adm-t1)]">{row.carrierName}</td>
                <td className="px-3 py-3">
                  <span className="rounded-md px-2.5 py-1 text-[10.5px] font-semibold" style={{ background: STAGE_STYLE[row.stage].bg, color: STAGE_STYLE[row.stage].fg }}>
                    {row.stage}
                  </span>
                </td>
                <td className="px-3 py-3 text-[var(--adm-t3)]">{row.submittedAt}</td>
                <td className="px-3 py-3">
                  <span className="flex items-center gap-2 text-[var(--adm-t2)]">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: PRIORITY[row.priority].dot }} />
                    {PRIORITY[row.priority].label}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="flex justify-end gap-1.5">
                    {/* v2: demo rows bridge to the LIVE carrier queue (real backend) */}
                    <Link href={ADMIN_ROUTES.carriers} aria-label={`Preview ${row.carrierName} in live carrier queue`} className="rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] p-1.5 text-[var(--adm-t2)] hover:border-[rgba(245,158,11,0.42)] hover:text-[var(--adm-a4)]">
                      <Eye size={13} />
                    </Link>
                    <Link href={ADMIN_ROUTES.carriers} aria-label={`Open live carrier queue for ${row.carrierName}`} className="rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] p-1.5 text-[var(--adm-t2)] hover:border-[rgba(245,158,11,0.42)] hover:text-[var(--adm-a4)]">
                      <ChevronRight size={13} />
                    </Link>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4" style={{ borderColor: 'var(--adm-b1)' }}>
        <p className="text-[11.5px] text-[var(--adm-t4)]">Showing {from} to {to} of {totalItems} results</p>
        <Link href={ADMIN_ROUTES.carriers} className="flex items-center gap-2 rounded-md border border-[var(--adm-a6)] px-3.5 py-2 text-[12px] font-medium text-[var(--adm-a4)] hover:bg-[rgba(245,158,11,0.08)]">
          View All Verifications <ArrowRight size={13} />
        </Link>
      </div>
    </section>
  );
}