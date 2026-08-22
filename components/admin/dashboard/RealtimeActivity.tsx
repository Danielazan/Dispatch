/* ============ RealtimeActivity v1 ============ */
'use client';
import { FileText, ShieldCheck, Check, Truck, AlertTriangle, Shield } from 'lucide-react';
import type { ActivityEvent } from '@/lib/admin/admin-types';

const ICONS: Record<string, { icon: typeof Check; bg: string }> = {
  pending: { icon: FileText, bg: 'var(--adm-a5)' },
  success: { icon: Check, bg: 'var(--adm-ok)' },
  danger: { icon: AlertTriangle, bg: 'var(--adm-danger)' },
  neutral: { icon: Shield, bg: 'var(--adm-neutral, #64707a)' },
};
const TYPE_ICON: Record<string, typeof Check> = {
  application: FileText, verification: ShieldCheck, approval: Check, load: Truck, document: AlertTriangle, system: Shield,
};

export function RealtimeActivity({ events }: { events: ActivityEvent[] }) {
  return (
    <section
      data-dash="panel"
      aria-label="Real-time operational activity"
      className="flex flex-col rounded-lg border border-[var(--adm-b1)] p-5"
      style={{ background: 'var(--adm-s1)' }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-semibold tracking-[0.14em] text-[var(--adm-t2)]">REAL-TIME ACTIVITY</h2>
        <button className="rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] px-3 py-1.5 text-[11px] text-[var(--adm-t2)] hover:border-[rgba(245,158,11,0.42)]">
          View All
        </button>
      </div>

      <div className="relative mt-5 flex-1">
        <span data-dash="spine" className="absolute bottom-2 left-[13px] top-1 w-px" style={{ background: 'linear-gradient(180deg, var(--adm-b2), transparent)' }} />
        <ul className="space-y-5">
          {events.map((ev) => {
            const Icon = TYPE_ICON[ev.type] ?? FileText;
            const tone = ICONS[ev.status];
            return (
              <li key={ev.id} data-dash="activity" className="relative flex items-start gap-3">
                <span
                  className="z-10 flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-full"
                  style={{ background: tone.bg }}
                >
                  <Icon size={13} strokeWidth={2.2} className="text-black" style={{ color: ev.status === 'neutral' ? 'var(--adm-t1)' : '#05080b' }} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-medium text-[var(--adm-t1)]">{ev.title}</p>
                  <p className="mt-0.5 truncate text-[11px] text-[var(--adm-t3)]">{ev.entity}</p>
                </div>
                <span className="shrink-0 text-[10.5px] text-[var(--adm-t4)]">{ev.timestamp}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}