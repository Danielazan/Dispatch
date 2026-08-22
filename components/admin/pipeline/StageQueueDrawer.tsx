/* ============ StageQueueDrawer v1 ============ */
'use client';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, ChevronRight as Open, Search, X } from 'lucide-react';
import { getStageQueue, STAGE_META } from '@/lib/admin/pipeline-mock-data';
import type { Paged, PipelineCardData, PipelineStageId } from '@/lib/admin/pipeline-types';

const PAGE_SIZE = 10;

export function StageQueueDrawer({ stage, onClose, onSelect }: {
  stage: PipelineStageId;
  onClose: () => void;
  onSelect: (c: PipelineCardData, s: PipelineStageId) => void;
}) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [data, setData] = useState<Paged<PipelineCardData> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback((p: number, q: string) => {
    setLoading(true);
    getStageQueue(stage, p, PAGE_SIZE, q).then((d) => { setData(d); setLoading(false); });
  }, [stage]);

  // Debounced search resets to page 1 (also performs the initial load).
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(1, query); }, 250);
    return () => clearTimeout(t);
  }, [query, load]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const meta = STAGE_META[stage];
  const from = data && data.totalItems > 0 ? (data.page - 1) * data.pageSize + 1 : 0;
  const to = data ? Math.min(data.page * data.pageSize, data.totalItems) : 0;

  return createPortal(
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={`${meta.label} queue`}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <aside className="pipe-drawer absolute right-0 top-0 flex h-full w-[min(480px,94vw)] flex-col border-l border-[var(--adm-b1)] bg-[var(--adm-sidebar)]">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[var(--adm-b1)] p-5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--adm-b2)] text-[11px] text-[var(--adm-t3)]">{meta.num}</span>
          <h2 className="min-w-0 flex-1 truncate text-[15px] font-bold text-[var(--adm-t1)]">{meta.label}</h2>
          {data && (
            <span className="tnum shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--adm-a3)' }}>
              {data.totalItems}
            </span>
          )}
          <button onClick={onClose} aria-label="Close queue" className="rounded p-1 text-[var(--adm-t3)] hover:text-[var(--adm-t1)]"><X size={16} /></button>
        </div>

        {/* Search */}
        <div className="border-b border-[var(--adm-b1)] p-4">
          <div className="flex h-9 items-center gap-2.5 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s1)] px-3 focus-within:border-[rgba(245,158,11,0.42)]">
            <Search size={13} className="shrink-0 text-[var(--adm-t3)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search carrier name or MC#…"
              aria-label="Search queue"
              className="w-full bg-transparent text-[12px] text-[var(--adm-t1)] placeholder:text-[var(--adm-t4)] focus:outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="pipe-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
          {loading && Array.from({ length: 6 }).map((_, i) => <div key={i} className="adm-skeleton h-[58px]" />)}
          {!loading && data && data.items.length === 0 && (
            <p className="px-2 py-8 text-center text-[11.5px] text-[var(--adm-t4)]">No carriers match “{query}” in this stage.</p>
          )}
          {!loading && data?.items.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c, stage)}
              className="group flex w-full items-center gap-3 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] p-3 text-left transition-colors hover:border-[rgba(245,158,11,0.42)]"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-medium text-[var(--adm-t1)]">{c.carrierName}</span>
                <span className="tnum mt-0.5 block text-[10.5px] text-[var(--adm-t3)]">{c.mcNumber} • {c.submittedAt}</span>
              </span>
              <Open size={14} className="shrink-0 text-[var(--adm-t4)] transition-colors group-hover:text-[var(--adm-a4)]" />
            </button>
          ))}
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-between border-t border-[var(--adm-b1)] p-4">
          <p className="tnum text-[11px] text-[var(--adm-t4)]">
            {data && data.totalItems > 0 ? `Showing ${from}–${to} of ${data.totalItems}` : 'Showing 0 results'}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { const p = page - 1; setPage(p); load(p, query); }}
              disabled={!data || page <= 1 || loading}
              aria-label="Previous page"
              className="rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] p-1.5 text-[var(--adm-t2)] hover:border-[rgba(245,158,11,0.42)] disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="tnum text-[11px] text-[var(--adm-t3)]">{data ? `${data.page} / ${data.totalPages}` : '–'}</span>
            <button
              onClick={() => { const p = page + 1; setPage(p); load(p, query); }}
              disabled={!data || page >= (data?.totalPages ?? 1) || loading}
              aria-label="Next page"
              className="rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] p-1.5 text-[var(--adm-t2)] hover:border-[rgba(245,158,11,0.42)] disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  );
}