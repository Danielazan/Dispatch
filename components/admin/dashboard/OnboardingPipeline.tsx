/* ============ OnboardingPipeline v1 ============ */
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { PipelineStage } from '@/lib/admin/admin-types';
import { ADMIN_ROUTES } from '@/lib/admin/admin-constants';

const FILLS = ['#ffb020', '#e09612', '#b97f10', '#8f6a12', '#4a5157', '#343a40'];

export function OnboardingPipeline({ data, total }: { data: PipelineStage[]; total: number }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const W = 240, H = 252, GAP = 4;
  const segH = (H - GAP * (data.length - 1)) / data.length;
  const max = Math.max(...data.map((d) => d.count));
  const wFor = (c: number) => Math.max(0.16, c / max) * W;

  return (
    <section
      data-dash="panel"
      aria-label={`Onboarding pipeline, ${total} carriers`}
      className="flex flex-col rounded-lg border border-[var(--adm-b1)] p-5"
      style={{ background: 'var(--adm-s1)' }}
    >
      <h2 className="text-[13px] font-semibold tracking-[0.14em] text-[var(--adm-t2)]">ONBOARDING PIPELINE</h2>

      <div className="relative mt-4 flex flex-1 gap-4">
        {/* pressure trace */}
        <span
          data-dash="pipeline-trace"
          className="pointer-events-none absolute left-[23%] top-0 h-full w-px"
          style={{ background: 'linear-gradient(180deg, rgba(255,173,24,0.5), rgba(255,173,24,0))' }}
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="h-[252px] w-[46%] shrink-0" aria-hidden="true">
          {data.map((stage, i) => {
            const y = i * (segH + GAP);
            const topW = wFor(stage.count);
            const botW = i < data.length - 1 ? wFor(data[i + 1].count) : wFor(stage.count) * 0.55;
            const cx = W / 2;
            const dim = hovered !== null && hovered !== i;
            return (
              <polygon
                key={stage.id}
                data-dash="pipeline-stage"
                points={`${cx - topW / 2},${y} ${cx + topW / 2},${y} ${cx + botW / 2},${y + segH} ${cx - botW / 2},${y + segH}`}
                fill={FILLS[i] ?? FILLS[FILLS.length - 1]}
                opacity={dim ? 0.55 : hovered === i ? 1 : 0.92}
                style={{ transition: 'opacity 0.2s ease' }}
              />
            );
          })}
        </svg>

        <ul className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          {data.map((stage, i) => (
            <li
              key={stage.id}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="flex items-center gap-2"
              style={{ opacity: hovered !== null && hovered !== i ? 0.6 : 1, transition: 'opacity 0.2s ease' }}
            >
              <span className="h-px w-5 shrink-0 bg-[var(--adm-b2)]" aria-hidden="true" />
              <Link href={stage.route} className="group flex min-w-0 flex-1 items-baseline justify-between gap-2 rounded px-1 py-0.5 hover:bg-[var(--adm-s2)]">
                <span className="truncate text-[12px] text-[var(--adm-t2)] group-hover:text-[var(--adm-t1)]">{stage.label}</span>
                <span className="flex shrink-0 items-baseline gap-2">
                  <b className="tnum text-[13px] font-semibold text-[var(--adm-t1)]">{stage.count}</b>
                  <i className="tnum not-italic text-[10.5px] text-[var(--adm-t4)]">{stage.percentage.toFixed(1)}%</i>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[var(--adm-b1)] pt-4">
        <p className="text-[12px] text-[var(--adm-t3)]">
          Total in Pipeline <b className="tnum ml-3 text-[15px] font-semibold text-[var(--adm-t1)]">{total}</b>
        </p>
        <Link
          href={ADMIN_ROUTES.onboarding}
          className="flex items-center gap-2 rounded-md border border-[var(--adm-a6)] px-3.5 py-2 text-[12px] font-medium text-[var(--adm-a4)] transition-colors hover:bg-[rgba(245,158,11,0.08)]"
        >
          View Pipeline <ArrowRight size={13} />
        </Link>
      </div>
    </section>
  );
}