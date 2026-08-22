/* ============ StageSummaryStrip v2 ============ */
'use client';
import { useLayoutEffect, useRef } from 'react';
import type { StageSummary, PipelineStageId } from '@/lib/admin/pipeline-types';

function sparkPath(trend: number[], w = 88, h = 24) {
  const min = Math.min(...trend); const max = Math.max(...trend);
  const sx = (i: number) => (i / (trend.length - 1)) * w;
  const sy = (v: number) => h - 3 - ((v - min) / (max - min || 1)) * (h - 6);
  return trend.map((v, i) => `${i ? 'L' : 'M'}${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join(' ');
}

export function StageSummaryStrip({ summaries, active, showPct, onSelect }: {
  summaries: StageSummary[];
  active: PipelineStageId;
  showPct: boolean;
  onSelect: (s: PipelineStageId) => void;
}) {
  return (
    <section
      aria-label="Pipeline stage summary"
      className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6"
    >
      {summaries.map((s) => <StripCard key={s.stage} s={s} active={active === s.stage} showPct={showPct} onSelect={onSelect} />)}
    </section>
  );
}

function StripCard({ s, active, showPct, onSelect }: { s: StageSummary; active: boolean; showPct: boolean; onSelect: (st: PipelineStageId) => void }) {
  const numRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (numRef.current) numRef.current.textContent = '0';
  }, []);

  return (
    <button
      data-pipe="stage-sum"
      onClick={() => onSelect(s.stage)}
      aria-pressed={active}
      className="relative min-w-0 rounded-lg border p-3 text-left transition-colors min-[1440px]:p-3.5"
      style={{ background: 'var(--adm-s1)', borderColor: active ? 'rgba(245,158,11,0.35)' : 'var(--adm-b1)' }}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--adm-b2)] text-[10px] text-[var(--adm-t3)]">{s.num}</span>
        <span data-sum="label" className="truncate text-[11px] font-medium text-[var(--adm-t2)] min-[1440px]:text-[11.5px]">{s.label}</span>
      </span>
      <span className="mt-2 flex items-end justify-between gap-2">
        <span className="flex items-baseline gap-1.5">
          <span ref={numRef} data-sum="number" data-value={s.count} className="tnum text-[24px] font-bold leading-8 text-[var(--adm-t1)] min-[1440px]:text-[26px]">{s.count}</span>
          {showPct && <span className="tnum text-[10px] text-[var(--adm-t4)]">{s.percentage.toFixed(1)}%</span>}
        </span>
        <svg width="88" height="24" viewBox="0 0 88 24" aria-hidden="true" className="hidden shrink-0 sm:block">
          <path data-sum="spark" d={sparkPath(s.trend)} fill="none" pathLength={1} strokeDasharray={1} stroke="var(--adm-a5)" strokeWidth="1.3" strokeLinecap="round" opacity={0.8} />
        </svg>
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] rounded-b bg-[var(--adm-a4)] transition-transform duration-500"
        style={{ width: '100%', transform: active ? 'scaleX(0.42)' : 'scaleX(0)', transformOrigin: 'left', opacity: active ? 1 : 0 }}
      />
    </button>
  );
}