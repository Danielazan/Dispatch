/* ============ PipelineColumn v5 ============ */
'use client';
import { useCallback, useState } from 'react';
import { getStageQueue, STAGE_META } from '@/lib/admin/pipeline-mock-data';
import type { PipelineCardData, PipelineColumnData, PipelineStageId } from '@/lib/admin/pipeline-types';
import { PipelineCard } from './PipelineCard';

const PAGE_SIZE = 10;

export function PipelineColumn({ column, selectedId, compact, onSelect }: {
  column: PipelineColumnData;
  selectedId: string | null;
  compact: boolean;
  onSelect: (c: PipelineCardData, s: PipelineStageId) => void;
}) {
  const [items, setItems] = useState<PipelineCardData[]>(column.cards);
  const [nextPage, setNextPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [touched, setTouched] = useState(false);

  const meta = STAGE_META[column.stage];
  const remaining = column.total - items.length;

  // Progressive load: appends the next page INSIDE the column's own scroll area.
  const loadMore = useCallback(async () => {
    if (loadingMore || remaining <= 0) return;
    setLoadingMore(true);
    setTouched(true);
    try {
      const res = await getStageQueue(column.stage, nextPage, PAGE_SIZE);
      setItems((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        return [...prev, ...res.items.filter((i) => !ids.has(i.id))];
      });
      setNextPage((p) => p + 1);
    } finally {
      setLoadingMore(false);
    }
  }, [column.stage, nextPage, loadingMore, remaining]);

  return (
    <section
      data-pipe="col"
      id={`pipe-col-${column.stage}`}
      aria-label={`${meta.label}, ${column.total} carriers`}
      className="flex min-w-0 flex-col rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)] p-3"
    >
      <header className="flex min-w-0 items-center gap-2 px-1 pb-3">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--adm-b2)] text-[10px] text-[var(--adm-t3)]">{meta.num}</span>
        <h3 className="min-w-0 flex-1 truncate text-[11.5px] font-medium text-[var(--adm-t2)]" title={meta.label}>{meta.label}</h3>
        <span className="tnum shrink-0 rounded-md px-2 py-0.5 text-[10.5px] font-bold" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--adm-a3)' }}>{column.total}</span>
      </header>

      {/* Bounded viewport: the column scrolls internally — the page NEVER stretches */}
      <div
        aria-busy={loadingMore}
        className={`pipe-scrollbar -mr-1 flex max-h-[540px] min-h-0 flex-col overflow-y-auto pr-1 ${compact ? 'gap-2' : 'gap-3'}`}
      >
        {items.map((c) => (
          <PipelineCard key={c.id} card={c} stage={column.stage} compact={compact} selected={selectedId === c.id} onSelect={onSelect} />
        ))}

        {remaining > 0 ? (
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-[var(--adm-b1)] py-2 text-[11px] text-[var(--adm-t3)] transition-colors hover:border-[rgba(245,158,11,0.42)] hover:text-[var(--adm-t2)] disabled:opacity-60"
          >
            {loadingMore && <span className="pipe-spin h-3 w-3 rounded-full border border-dashed border-[var(--adm-a4)]" aria-hidden="true" />}
            {loadingMore ? 'Loading…' : `+ ${remaining} more`}
          </button>
        ) : (
          <p className="py-1 text-center text-[10.5px] text-[var(--adm-t4)]">Queue clear</p>
        )}

        {touched && (
          <p className="tnum pb-1 text-center text-[10px] text-[var(--adm-t4)]">
            Showing {items.length} of {column.total}
          </p>
        )}
      </div>
    </section>
  );
}