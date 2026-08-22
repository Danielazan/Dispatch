/* ============ PipelineDistribution v3 ============ */
'use client';
import { STAGE_META } from '@/lib/admin/pipeline-mock-data';
import type { DistributionSlice } from '@/lib/admin/pipeline-types';

const R = 54, C = 2 * Math.PI * R;

export function PipelineDistribution({ slices, total }: { slices: DistributionSlice[]; total: number }) {
  let acc = 0;
  return (
    <section
      data-pipe="panel"
      aria-label="Pipeline distribution"
      className="flex min-w-0 flex-col rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)] p-5"
    >
      <h2 className="text-[13px] font-semibold tracking-[0.14em] text-[var(--adm-t2)]">PIPELINE DISTRIBUTION</h2>

      <div className="mt-4 flex items-center gap-6">
        <div className="relative shrink-0">
          <svg width="160" height="160" viewBox="0 0 160 160" role="img" aria-label={`Donut chart of ${total} carriers in pipeline`}>
            {slices.map((s) => {
              const frac = s.count / total;
              const off = acc; acc += frac;
              return (
                <circle
                  key={s.stage} cx="80" cy="80" r={R} fill="none"
                  stroke={STAGE_META[s.stage].fill} strokeWidth="26"
                  strokeDasharray={`${Math.max(frac * C - 1.5, 0.6)} ${C}`}
                  strokeDashoffset={-off * C}
                  transform="rotate(-90 80 80)"
                />
              );
            })}
          </svg>
          <span className="absolute inset-0 flex flex-col items-center justify-center">
            <b className="tnum text-[24px] font-bold text-[var(--adm-t1)]">{total}</b>
            <i className="not-italic text-[9.5px] text-[var(--adm-t4)]">Total in Pipeline</i>
          </span>
        </div>

        {/* v3: labels truncate with min-w-0; counts and percentages never collapse */}
        <ul className="min-w-0 flex-1 space-y-2">
          {slices.map((s) => (
            <li key={s.stage} className="flex min-w-0 items-center gap-2 text-[11px]">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: STAGE_META[s.stage].fill }} />
              <span className="min-w-0 flex-1 truncate text-[var(--adm-t2)]" title={s.label}>{s.label}</span>
              <span className="tnum shrink-0 text-[var(--adm-t1)]">{s.count}</span>
              <span className="tnum w-12 shrink-0 text-right text-[var(--adm-t4)]">({s.percentage.toFixed(1)}%)</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}