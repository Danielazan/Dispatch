/* ============ PipelinePage v6 ============ */
'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin/admin-auth';
import type { CarrierSummary, Page } from '@/lib/admin/carrier-types';
import { ALL_STATUSES, fetchStatusQueue, QUEUE_COLUMNS, STATUS_LABELS, type QueueStatus } from '@/lib/admin/pipeline-data';
import { usePipelineEntranceTimeline } from './PipelineMotion';
import { StageSummaryStrip } from './StageSummaryStrip';
import { PipelineBoard } from './PipelineBoard';
import { PipelineDistribution } from './PipelineDistribution';
import { PipelineAttention } from './PipelineAttention';
import { PipelineSkeleton, PipelineErrorState, PipelinePermissionState } from './PipelineStates';

export function PipelinePage() {
  const { can } = useAdminAuth();
  const router = useRouter();
  const [pages, setPages] = useState<Record<QueueStatus, Page<CarrierSummary>> | null>(null);
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading');
  const [activeId, setActiveId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setState('loading');
    try {
      const results = await Promise.all(ALL_STATUSES.map(async (s) => [s, await fetchStatusQueue(s)] as const));
      const map = {} as Record<QueueStatus, Page<CarrierSummary>>;
      results.forEach(([s, p]) => { map[s] = p; });
      setPages(map);
      setState('ready');
    } catch { setState('error'); }
  }, []);

  useEffect(() => { load(); }, [load]);
  usePipelineEntranceTimeline(rootRef, state === 'ready');

  const loadMore = useCallback(async (s: QueueStatus) => {
    if (!pages) return;
    const cur = pages[s];
    if (!cur || cur.page >= cur.totalPages) return;
    try {
      const next = await fetchStatusQueue(s, cur.page + 1);
      setPages({ ...pages, [s]: { ...next, items: [...cur.items, ...next.items] } });
    } catch { /* keep current page on failure */ }
  }, [pages]);

  if (!can('carriers.view')) return <div className="p-6"><PipelinePermissionState /></div>;

  const totals: Record<string, number> = {};
  let grandTotal = 0;
  if (pages) {
    QUEUE_COLUMNS.forEach((col) => {
      totals[col.id] = col.statuses.reduce((sum, s) => sum + (pages[s]?.totalItems ?? 0), 0);
      grandTotal += totals[col.id];
    });
  }

  const onSelectStrip = (id: string) => {
    setActiveId(id);
    document.getElementById('pipe-col-' + id)?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  };

  return (
    <div ref={rootRef} data-pipe="shell" className="space-y-5 p-5 md:p-6">
      <div>
        <h1 data-pipe="title" className="text-[26px] font-extrabold leading-8 text-[var(--adm-t1)]">Onboarding Pipeline</h1>
        <p className="mt-1 text-[12px] text-[var(--adm-t3)]">Live carrier queues from the database — draft through suspended. Click a card to open its carrier file.</p>
      </div>

      {state === 'loading' && <PipelineSkeleton />}
      {state === 'error' && <PipelineErrorState onRetry={load} />}
      {state === 'ready' && pages && (
        <>
          <StageSummaryStrip
            activeId={activeId}
            onSelect={onSelectStrip}
            summaries={QUEUE_COLUMNS.map((col, i) => ({
              id: col.id, num: i + 1, label: col.title,
              count: totals[col.id] ?? 0,
              percentage: grandTotal ? ((totals[col.id] ?? 0) / grandTotal) * 100 : 0,
            }))}
          />
          <PipelineBoard pages={pages} totals={totals} onLoadMore={loadMore} onOpen={(id) => router.push('/admin/carriers/' + id)} />
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <PipelineDistribution
              total={grandTotal}
              counts={ALL_STATUSES.map((s) => ({ status: s, label: STATUS_LABELS[s], count: pages[s]?.totalItems ?? 0 }))}
            />
            <PipelineAttention
              rows={[
                { id: 'admin_review', label: 'Admin Review', count: pages.admin_review?.totalItems ?? 0, icon: 'review', hint: 'awaiting compliance decision' },
                { id: 'approved', label: 'Approved — Not Activated', count: pages.approved?.totalItems ?? 0, icon: 'approve', hint: 'ready to activate' },
                { id: 'rejected', label: 'Rejected', count: pages.rejected?.totalItems ?? 0, icon: 'rejected', hint: 'reason on file' },
                { id: 'suspended', label: 'Suspended', count: pages.suspended?.totalItems ?? 0, icon: 'suspended', hint: 'locked queue' },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}
