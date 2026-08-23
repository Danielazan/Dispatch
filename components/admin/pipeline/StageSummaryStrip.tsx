/* ============ StageSummaryStrip v4 ============ */
'use client';
import { useLayoutEffect, useRef } from 'react';

export interface StripSummary { id: string; num: number; label: string; count: number; percentage: number; }

export function StageSummaryStrip({ summaries, activeId, onSelect }: {
  summaries: StripSummary[]; activeId: string | null; onSelect: (id: string) => void;
}) {
  return (
    <section aria-label="Live queue summary" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {summaries.map((s) => <StripCard key={s.id} s={s} active={activeId === s.id} onSelect={onSelect} />)}
    </section>
  );
}

function StripCard({ s, active, onSelect }: { s: StripSummary; active: boolean; onSelect: (id: string) => void }) {
  const numRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (numRef.current) numRef.current.textContent = '0';
  }, []);
  return (
    <button data-pipe="stage-sum" onClick={() => onSelect(s.id)} aria-pressed={active}
      className="relative min-w-0 rounded-lg border p-3 text-left transition-colors"
      style={{ background: 'var(--adm-s1)', borderColor: active ? 'rgba(245,158,11,0.35)' : 'var(--adm-b1)' }}>
      <span className="flex min-w-0 items-center gap-2">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--adm-b2)] text-[10px] text-[var(--adm-t3)]">{s.num}</span>
        <span className="truncate text-[11px] font-medium text-[var(--adm-t2)]" title={s.label}>{s.label}</span>
      </span>
      <span className="mt-2 flex items-baseline gap-1.5">
        <span ref={numRef} data-sum="number" data-value={s.count} className="tnum text-[24px] font-bold leading-8 text-[var(--adm-t1)]">{s.count}</span>
        <span className="tnum text-[10px] text-[var(--adm-t4)]">{s.percentage.toFixed(1)}%</span>
      </span>
      <span aria-hidden="true" className="absolute bottom-0 left-0 h-[2px] rounded-b bg-[var(--adm-a4)] transition-transform duration-500"
        style={{ width: '100%', transform: active ? 'scaleX(0.42)' : 'scaleX(0)', transformOrigin: 'left', opacity: active ? 1 : 0 }} />
    </button>
  );
}
