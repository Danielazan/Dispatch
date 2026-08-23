/* ============ StatusBadge v2 ============ */
'use client';
/** §8.9 tone system — text + dot + color, never color alone. v2: crash-proof on absent wire fields. */
const TONE: Record<string, 'green' | 'amber' | 'amber-strong' | 'red' | 'grey'> = {
  active: 'green', verified: 'green', signed: 'green', accepted: 'green', admin_confirmed: 'green', converted: 'green', delivered: 'green',
  pending: 'amber', manual_pending: 'amber', sent: 'amber', negotiating: 'amber', in_transit: 'amber', onboarding_started: 'amber', submitted: 'amber', admin_review: 'amber', inconclusive: 'amber',
  approved: 'amber-strong',
  rejected: 'red', failed: 'red', mismatch: 'red', not_found: 'red', suspended: 'red', declined: 'red', abandoned: 'red',
  cancelled: 'grey', expired: 'grey', voided: 'grey', new: 'grey', draft: 'grey',
};

const STYLE = {
  green: { fg: 'var(--adm-ok)', bg: 'rgba(34,197,94,0.10)', bd: 'rgba(34,197,94,0.4)' },
  amber: { fg: 'var(--adm-a3)', bg: 'rgba(245,158,11,0.10)', bd: 'rgba(245,158,11,0.4)' },
  'amber-strong': { fg: 'var(--adm-a4)', bg: 'rgba(245,158,11,0.18)', bd: 'rgba(245,158,11,0.6)' },
  red: { fg: 'var(--adm-danger)', bg: 'rgba(239,68,68,0.10)', bd: 'rgba(239,68,68,0.4)' },
  grey: { fg: 'var(--adm-t3)', bg: 'rgba(255,255,255,0.05)', bd: 'var(--adm-b1)' },
} as const;

export function StatusBadge({ value, label }: { value?: string | null; label?: string }) {
  const v = value ?? '';
  const tone = TONE[v] ?? 'grey';
  const s = STYLE[tone];
  const text = label ?? (v ? String(v).replace(/_/g, ' ').toUpperCase() : '—');
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded px-2 py-0.5 text-[10px] font-bold tracking-wide"
      style={{ color: s.fg, background: s.bg, border: '1px solid ' + s.bd }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.fg }} aria-hidden="true" />
      {text}
    </span>
  );
}
