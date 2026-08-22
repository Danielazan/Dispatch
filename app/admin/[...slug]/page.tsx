/* ============ admin placeholder module v1 ============ */
'use client';
import Link from 'next/link';
import { AdminShell } from '@/components/admin/shell/AdminShell';
import { ADMIN_ROUTES } from '@/lib/admin/admin-constants';

export default function AdminPlaceholderPage() {
  return (
    <AdminShell>
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)] px-8 py-6 text-center">
          <p className="text-[13px] font-semibold tracking-[0.14em] text-[var(--adm-t2)]">MODULE OFFLINE</p>
          <p className="mt-2 max-w-sm text-[12px] text-[var(--adm-t3)]">
            This operations module comes online in a later integration phase. The Dashboard is fully operational.
          </p>
          <Link href={ADMIN_ROUTES.dashboard}
            className="mt-4 inline-block rounded-md border border-[var(--adm-a6)] px-4 py-2 text-[12px] font-medium text-[var(--adm-a4)] hover:bg-[rgba(245,158,11,0.08)]">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}