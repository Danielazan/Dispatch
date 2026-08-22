/* ============ PipelineBottlenecks v3 ============ */
'use client';
import { useRouter } from 'next/navigation';
import { ArrowRight, ClipboardList, FileText, ShieldCheck } from 'lucide-react';
import { ADMIN_ROUTES } from '@/lib/admin/admin-constants';
import type { BottleneckRow, PipelineStageId } from '@/lib/admin/pipeline-types';

const ICONS: Record<PipelineStageId, typeof FileText> = {
  documents: FileText, verification: ShieldCheck, agreement: ClipboardList,
  submitted: FileText, ready: ClipboardList, approved: ClipboardList,
};

export function PipelineBottlenecks({ rows, onJump }: { rows: BottleneckRow[]; onJump: (s: PipelineStageId) => void }) {
  const router = useRouter();
  return (
    <section
      data-pipe="panel"
      aria-label="Pipeline bottlenecks"
      className="flex min-w-0 flex-col rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)] p-5"
    >
      <h2 className="text-[13px] font-semibold tracking-[0.14em] text-[var(--adm-t2)]">BOTTLENECKS</h2>

      <ul className="mt-4 space-y-3">
        {rows.map((r) => {
          const Icon = ICONS[r.id];
          return (
            <li key={r.id} className="flex items-center gap-3 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[rgba(245,158,11,0.45)] bg-[rgba(245,158,11,0.06)]">
                <Icon size={15} className="text-[var(--adm-a4)]" />
              </span>
              {/* v3: label truncates; meta wraps to a second line instead of stacking vertically */}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-medium text-[var(--adm-t1)]" title={r.label}>{r.label}</span>
                <span className="tnum block text-[10.5px] leading-4 text-[var(--adm-t3)]">
                  {r.carriers} carriers • {r.sharePct.toFixed(1)}% of pipeline
                </span>
              </span>
              <button
                onClick={() => onJump(r.id)}
                className="shrink-0 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s3)] px-3.5 py-2 text-[11px] text-[var(--adm-t2)] hover:border-[rgba(245,158,11,0.42)] hover:text-[var(--adm-a4)]"
              >
                View
              </button>
            </li>
          );
        })}
      </ul>

      <button
        onClick={() => router.push(ADMIN_ROUTES.reports)}
        className="mt-auto flex items-center gap-2 pt-4 text-[11.5px] font-medium text-[var(--adm-a4)] hover:underline"
      >
        View Pipeline Insights <ArrowRight size={13} />
      </button>
    </section>
  );
}