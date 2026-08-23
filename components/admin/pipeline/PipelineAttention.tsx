/* ============ PipelineAttention v1 ============ */
'use client';
import { useRouter } from 'next/navigation';
import { ArrowRight, BadgeCheck, ShieldAlert, ShieldCheck, UserX } from 'lucide-react';
import { ADMIN_ROUTES } from '@/lib/admin/admin-constants';

const ICONS = { review: ShieldCheck, approve: BadgeCheck, rejected: UserX, suspended: ShieldAlert } as const;

export function PipelineAttention({ rows }: {
  rows: { id: string; label: string; count: number; icon: keyof typeof ICONS; hint: string }[];
}) {
  const router = useRouter();
  return (
    <section data-pipe="panel" aria-label="Queues needing attention" className="rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)] p-5">
      <h2 className="text-[13px] font-semibold tracking-[0.14em] text-[var(--adm-t2)]">QUEUES NEEDING ATTENTION</h2>
      <ul className="mt-4 space-y-3">
        {rows.map((r) => {
          const Icon = ICONS[r.icon];
          return (
            <li key={r.id} className="flex items-center gap-3 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[rgba(245,158,11,0.45)] bg-[rgba(245,158,11,0.06)]">
                <Icon size={15} className="text-[var(--adm-a4)]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-medium text-[var(--adm-t1)]">{r.label}</span>
                <span className="tnum block text-[10.5px] text-[var(--adm-t3)]">{r.count} carriers • {r.hint}</span>
              </span>
              <button onClick={() => router.push(ADMIN_ROUTES.carriers + '?status=' + r.id)}
                className="shrink-0 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s3)] px-3.5 py-2 text-[11px] text-[var(--adm-t2)] hover:border-[rgba(245,158,11,0.42)] hover:text-[var(--adm-a4)]">
                View
              </button>
            </li>
          );
        })}
      </ul>
      <button onClick={() => router.push(ADMIN_ROUTES.carriers)} className="mt-4 flex items-center gap-2 text-[11.5px] font-medium text-[var(--adm-a4)] hover:underline">
        Open full carrier queue <ArrowRight size={13} />
      </button>
    </section>
  );
}
