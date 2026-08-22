/* ============ PipelineAnalytics v3 ============ */
'use client';
import { useState } from 'react';
import type { PipelineAnalyticsData } from '@/lib/admin/pipeline-types';

const W = 520, H = 190, PL = 30, PR = 10, PT = 10, PB = 28, YMAX = 60;

export function PipelineAnalytics({ data }: { data: PipelineAnalyticsData }) {
  const [range, setRange] = useState(data.ranges[1] ?? data.ranges[0]);
  const series = data.seriesByRange[range] ?? [];
  const xLabels = data.xLabelsByRange[range] ?? [];

  const px = (i: number) => PL + (i / (series.length - 1)) * (W - PL - PR);
  const py = (v: number) => PT + (1 - v / YMAX) * (H - PT - PB);
  const line = series.map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
  const area = `${line} L${px(series.length - 1).toFixed(1)},${H - PB} L${px(0).toFixed(1)},${H - PB} Z`;

  return (
    <section
      data-pipe="panel"
      aria-label="Pipeline analytics"
      className="flex min-w-0 flex-col rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)] p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[13px] font-semibold tracking-[0.14em] text-[var(--adm-t2)]">PIPELINE ANALYTICS</h2>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          aria-label="Analytics range"
          className="h-8 shrink-0 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] px-2 text-[11.5px] text-[var(--adm-t2)] focus:border-[rgba(245,158,11,0.42)] focus:outline-none"
        >
          {data.ranges.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>

      {/* v3: each stat is min-w-0; labels truncate; deltas wrap instead of colliding */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {data.stats.map((s) => (
          <div key={s.id} className="min-w-0">
            <p className="truncate text-[10px] text-[var(--adm-t4)]" title={s.label}>{s.label}</p>
            <p className="tnum mt-1 text-[19px] font-bold leading-6 text-[var(--adm-t1)]">{s.value}</p>
            <p className="mt-0.5 text-[9px] leading-3" style={{ color: 'var(--adm-ok)' }}>{s.delta}</p>
          </div>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="Completed onboardings trend chart">
        <defs>
          <linearGradient id="pipe-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(245,158,11,0.35)" />
            <stop offset="100%" stopColor="rgba(245,158,11,0.02)" />
          </linearGradient>
        </defs>
        {[0, 20, 40, 60].map((v) => (
          <g key={v}>
            <line x1={PL} x2={W - PR} y1={py(v)} y2={py(v)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x={PL - 6} y={py(v) + 3} textAnchor="end" fontSize="8.5" fill="var(--adm-t4)">{v}</text>
          </g>
        ))}
        <path d={area} fill="url(#pipe-area)" />
        <path d={line} fill="none" stroke="var(--adm-a4)" strokeWidth="1.6" strokeLinecap="round" />
        {series.map((v, i) => <circle key={i} cx={px(i)} cy={py(v)} r={i === series.length - 1 ? 3 : 2} fill="var(--adm-a4)" />)}
        {xLabels.map((l, i) => (
          <text
            key={l}
            x={PL + (i / (xLabels.length - 1)) * (W - PL - PR)}
            y={H - 8}
            textAnchor="middle"
            fontSize="8.5"
            fill="var(--adm-t4)"
          >
            {l}
          </text>
        ))}
      </svg>

      <p className="mt-2 flex items-center gap-2 text-[10.5px] text-[var(--adm-t3)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--adm-a4)]" /> Completed Onboardings
      </p>
    </section>
  );
}