/* ============ KpiCard v1 ============ */
'use client';
import { useLayoutEffect, useRef } from 'react';
import { ArrowUp, ArrowDown, MoreVertical } from 'lucide-react';
import type { DashboardMetric } from '@/lib/admin/admin-types';

function sparkPath(trend: number[], w = 96, h = 26) {
  const min = Math.min(...trend);
  const max = Math.max(...trend);
  const sx = (i: number) => (i / (trend.length - 1)) * w;
  const sy = (v: number) => h - 3 - ((v - min) / (max - min || 1)) * (h - 6);
  return trend.map((v, i) => `${i ? 'L' : 'M'}${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join(' ');
}

export function KpiCard({ metric }: { metric: DashboardMetric }) {
  const numRef = useRef<HTMLSpanElement>(null);
  const Icon = metric.icon;
  const up = metric.trendPct >= 0;
  const attention = metric.priority === 'attention';

  // Zero the counter pre-reveal so the mechanical count-up reads cleanly (skipped under reduced motion).
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (numRef.current) numRef.current.textContent = '0';
  }, []);

  return (
    <article
      data-dash="kpi"
      className="relative rounded-lg border p-4"
      style={{
        background: 'var(--adm-s1)',
        borderColor: attention ? 'rgba(245,158,11,0.28)' : 'var(--adm-b1)',
        boxShadow: attention ? '0 8px 24px rgba(0,0,0,0.24), 0 0 18px rgba(245,158,11,0.06)' : '0 12px 32px rgba(0,0,0,0.22)',
      }}
    >
      <div className="flex items-start justify-between">
        <p data-kpi="label" className="text-[12.5px] font-medium text-[var(--adm-t2)]">{metric.label}</p>
        <button className="rounded p-0.5 text-[var(--adm-t4)] hover:text-[var(--adm-t2)]" aria-label={`${metric.label} options`}>
          <MoreVertical size={14} />
        </button>
      </div>

      <div className="mt-1 flex items-start justify-between gap-2">
        <span
          ref={numRef}
          data-kpi="number"
          data-value={metric.value}
          className="tnum text-[30px] font-bold leading-9 text-[var(--adm-t1)]"
        >
          {metric.value.toLocaleString('en-US')}
        </span>
        <span
          data-kpi="icon"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border"
          style={{ borderColor: 'rgba(245,158,11,0.45)', background: 'rgba(245,158,11,0.06)' }}
        >
          <Icon size={20} strokeWidth={1.6} className="text-[var(--adm-a4)]" />
        </span>
      </div>

      <div data-kpi="trend" className="mt-2 flex items-end justify-between gap-2">
        <div className="leading-tight">
          <p className="flex items-center gap-1 text-[11.5px] font-semibold" style={{ color: up ? 'var(--adm-a4)' : 'var(--adm-danger)' }}>
            {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {Math.abs(metric.trendPct)}%
          </p>
          <p className="text-[10.5px] text-[var(--adm-t4)]">{metric.comparison}</p>
        </div>
        <svg width="96" height="26" viewBox="0 0 96 26" aria-hidden="true" className="shrink-0">
          <path
            data-kpi="spark"
            d={sparkPath(metric.trend)}
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            stroke={attention ? 'var(--adm-a3)' : 'var(--adm-a5)'}
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity={attention ? 0.95 : 0.75}
          />
        </svg>
      </div>
    </article>
  );
}