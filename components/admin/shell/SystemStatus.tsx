/* ============ SystemStatus v1 ============ */
'use client';
export function SystemStatus({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="hidden items-center gap-2.5 md:flex" role="status" aria-label={`System status: ${label}`}>
      <span
        className="adm-pulse h-2 w-2 rounded-full"
        style={{ background: ok ? 'var(--adm-ok)' : 'var(--adm-danger)' }}
      />
      <div className="leading-tight">
        <p className="text-[11px] font-medium text-[var(--adm-t2)]">System Status</p>
        <p className="text-[11px] text-[var(--adm-t3)]">{label}</p>
      </div>
    </div>
  );
}