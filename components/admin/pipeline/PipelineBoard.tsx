/* ============ PipelineBoard v6 ============ */
'use client';
import type { CarrierSummary, Page } from '@/lib/admin/carrier-types';
import { QUEUE_COLUMNS, type QueueStatus } from '@/lib/admin/pipeline-data';
import { PipelineColumn } from './PipelineColumn';

export function PipelineBoard({ pages, totals, onLoadMore, onOpen }: {
  pages: Record<QueueStatus, Page<CarrierSummary>>;
  totals: Record<string, number>;
  onLoadMore: (s: QueueStatus) => void;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="pipe-scrollbar overflow-x-auto pb-2">
      <div className="pipe-board items-start" style={{ '--pipe-cols': QUEUE_COLUMNS.length } as React.CSSProperties}>
        {QUEUE_COLUMNS.map((def) => (
          <PipelineColumn key={def.id} def={def} pages={pages} total={totals[def.id] ?? 0} onLoadMore={onLoadMore} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}
