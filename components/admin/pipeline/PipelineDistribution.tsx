/* ============ PipelineDistribution v2 ============ */
'use client';
import type { QueueStatus } from '@/lib/admin/pipeline-data';

export const STATUS_COLORS: Record<QueueStatus, string> = {
  draft: '#565f66', submitted: '#707a82', admin_review: '#f59e0b', approved: '#ffad18',
  active: '#22c55e', rejected: '#ef4444', suspended: '#b91c1c',
};

const R = 54, C = 2 * Math.PI * R;

export function PipelineDistribution({ counts, total }: {
  counts: { status: QueueStatus; label: string; count: number }[]; total: number;
}) {
  let acc = 0;
  return (
    <section data-pipe="panel" aria-label="Carrier distribution by status" className="rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)] p-5">
      <h2 className="text-[13px] font-semibold tracking-[0.14em] text-[var(--adm-t2)]">DISTRIBUTION BY STATUS</h2>
      {total === 0 ? (
        <p className="py-8 text-center text-[11.5px] text-[var(--adm-t4)]">No carriers yet.</p>
      ) : (
        <div className="mt-4 flex items-center gap-6">
          <div className="relative shrink-0">
            <svg width="160" height="160" viewBox="0 0 160 160" role="img" aria-label={'Donut chart of ' + total + ' carriers by status'}>
              {counts.filter((c) => c.count > 0).map((c) => {
                const frac = c.count / total; const off = acc; acc += frac;
                return (
                  <circle key={c.status} cx="80" cy="80" r={R} fill="none" stroke={STATUS_COLORS[c.status]} strokeWidth="26"
                    strokeDasharray={Math.max(frac * C - 1.5, 0.6) + ' ' + C} strokeDashoffset={-off * C} transform="rotate(-90 80 80)" />
                );
              })}
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center">
              <b className="tnum text-[24px] font-bold text-[var(--adm-t1)]">{total}</b>
              <i className="not-italic text-[9.5px] text-[var(--adm-t4)]">Total carriers</i>
            </span>
          </div>
          <ul className="min-w-0 flex-1 space-y-2">
            {counts.map((c) => (
              <li key={c.status} className="flex min-w-0 items-center gap-2 text-[11px]">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: STATUS_COLORS[c.status] }} />
                <span className="min-w-0 flex-1 truncate text-[var(--adm-t2)]">{c.label}</span>
                <span className="tnum shrink-0 text-[var(--adm-t1)]">{c.count}</span>
                <span className="tnum w-12 shrink-0 text-right text-[var(--adm-t4)]">({total ? ((c.count / total) * 100).toFixed(1) : '0.0'}%)</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
