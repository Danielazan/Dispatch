/* ============ PipelineBoard v5 ============ */
'use client';
import type { PipelineCardData, PipelineColumnData, PipelineStageId } from '@/lib/admin/pipeline-types';
import { PipelineColumn } from './PipelineColumn';

export function PipelineBoard({ columns, hiddenStages, selectedId, compact, onSelect }: {
  columns: PipelineColumnData[];
  hiddenStages: PipelineStageId[];
  selectedId: string | null;
  compact: boolean;
  onSelect: (c: PipelineCardData, s: PipelineStageId) => void;
}) {
  const visible = columns.filter((c) => !hiddenStages.includes(c.stage));
  return (
    <div className="pipe-board-wrap pipe-scrollbar pb-2">
      <div className="pipe-board items-start" style={{ '--pipe-cols': visible.length } as React.CSSProperties}>
        {visible.map((col) => (
          <PipelineColumn
            key={col.stage}
            column={col}
            selectedId={selectedId}
            compact={compact}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}