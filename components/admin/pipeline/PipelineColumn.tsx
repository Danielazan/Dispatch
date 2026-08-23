/* ============ PipelineColumn v6 ============ */
'use client';
import type { CarrierSummary, Page } from '@/lib/admin/carrier-types';
import type { QueueColumnDef, QueueStatus } from '@/lib/admin/pipeline-data';
import { PipelineCard } from './PipelineCard';

export function PipelineColumn({ def, pages, total, onLoadMore, onOpen }: {
  def: QueueColumnDef;
  pages: Record<QueueStatus, Page<CarrierSummary>>;
  total: number;
  onLoadMore: (s: QueueStatus) => void;
  onOpen: (id: string) => void;
}) {
  const items = def.statuses.flatMap((s) => pages[s]?.items ?? []);
  const remaining = Math.max(0, total - items.length);
  const nextStatus = def.statuses.find((s) => { const p = pages[s]; return !!p && p.page < p.totalPages; });

  return (
    <section data-pipe="col" id={'pipe-col-' + def.id} aria-label={def.title + ', ' + total + ' carriers'}
      className="flex min-w-0 flex-col rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)] p-3">
      <header className="flex min-w-0 items-center gap-2 px-1 pb-3">
        <h3 className="min-w-0 flex-1 truncate text-[11.5px] font-medium text-[var(--adm-t2)]" title={def.hint}>{def.title}</h3>
        <span className="tnum shrink-0 rounded-md px-2 py-0.5 text-[10.5px] font-bold" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--adm-a3)' }}>{total}</span>
      </header>
      <div className="pipe-scrollbar -mr-1 flex max-h-[540px] min-h-0 flex-col gap-3 overflow-y-auto pr-1">
        {items.map((c) => <PipelineCard key={c.id} carrier={c} onOpen={onOpen} />)}
        {items.length === 0 && <p className="py-4 text-center text-[10.5px] text-[var(--adm-t4)]">No carriers in this queue.</p>}
        {remaining > 0 && nextStatus && (
          <button onClick={() => onLoadMore(nextStatus)}
            className="w-full rounded-md border border-dashed border-[var(--adm-b1)] py-2 text-[11px] text-[var(--adm-t3)] transition-colors hover:border-[rgba(245,158,11,0.42)] hover:text-[var(--adm-t2)]">
            + {remaining} more
          </button>
        )}
      </div>
    </section>
  );
}
