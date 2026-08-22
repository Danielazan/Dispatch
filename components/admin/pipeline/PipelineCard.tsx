/* ============ PipelineCard v3 ============ */
'use client';
import { CheckCircle2, Hourglass, MoreVertical } from 'lucide-react';
import { STAGE_META } from '@/lib/admin/pipeline-mock-data';
import type { PipelineCardData, PipelineStageId } from '@/lib/admin/pipeline-types';

const TONE_STYLE = {
  'amber-outline': { border: '1px solid rgba(245,158,11,0.55)', bg: 'transparent', fg: 'var(--adm-a3)' },
  amber: { border: '1px solid rgba(245,158,11,0.4)', bg: 'rgba(245,158,11,0.12)', fg: 'var(--adm-a3)' },
  green: { border: '1px solid rgba(34,197,94,0.4)', bg: 'rgba(34,197,94,0.10)', fg: 'var(--adm-ok)' },
  'green-outline': { border: '1px solid rgba(34,197,94,0.5)', bg: 'transparent', fg: 'var(--adm-ok)' },
} as const;

export function PipelineCard({ card, stage, selected, compact, onSelect }: {
  card: PipelineCardData;
  stage: PipelineStageId;
  selected: boolean;
  compact: boolean;
  onSelect: (c: PipelineCardData, stage: PipelineStageId) => void;
}) {
  const meta = STAGE_META[stage];
  const tone = TONE_STYLE[meta.tone];

  return (
    <div data-pipe="card" className="relative min-w-0">
      <button
        onClick={() => onSelect(card, stage)}
        aria-pressed={selected}
        className={`w-full rounded-md border text-left transition-colors ${compact ? 'p-2.5' : 'p-3.5'}`}
        style={{
          background: selected ? 'rgba(245,158,11,0.06)' : 'var(--adm-s2)',
          borderColor: selected ? 'var(--adm-a5)' : 'var(--adm-b1)',
          boxShadow: selected ? '0 0 14px rgba(245,158,11,0.08)' : undefined,
        }}
      >
        <p className="truncate pr-6 text-[12.5px] font-medium text-[var(--adm-t1)]" title={card.carrierName}>
          {card.carrierName}
        </p>
        <p className="tnum mt-1 truncate text-[11px] text-[var(--adm-t3)]">{card.mcNumber}</p>

        {/* v3: date truncates, icon+badge cluster never wraps or collides */}
        <span className="mt-2.5 flex min-w-0 items-center justify-between gap-2">
          <span className="tnum min-w-0 truncate text-[10.5px] text-[var(--adm-t4)]" title={card.submittedAt}>
            {card.submittedAt}
          </span>
          <span className="flex shrink-0 items-center gap-1.5">
            {meta.icon === 'spin' && <span className="pipe-spin h-3.5 w-3.5 rounded-full border border-dashed border-[var(--adm-a4)]" aria-hidden="true" />}
            {meta.icon === 'hourglass' && <Hourglass size={12} className="text-[var(--adm-t2)]" aria-hidden="true" />}
            {meta.icon === 'check' && <CheckCircle2 size={13} className="text-[var(--adm-ok)]" aria-hidden="true" />}
            <span
              className="whitespace-nowrap rounded px-2 py-0.5 text-[9.5px] font-bold tracking-wide"
              style={{ border: tone.border, background: tone.bg, color: tone.fg }}
            >
              {card.badge}
            </span>
          </span>
        </span>
      </button>
      <button
        aria-label={`Options for ${card.carrierName}`}
        className="absolute right-2 top-2 rounded p-0.5 text-[var(--adm-t4)] hover:text-[var(--adm-t2)]"
      >
        <MoreVertical size={13} />
      </button>
    </div>
  );
}