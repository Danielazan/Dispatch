/* ============ QuickActions v2 ============ */
'use client';
import Link from 'next/link';
import { UserPlus, Truck, Route, UploadCloud, Users, BarChart3 } from 'lucide-react';
import { ADMIN_ROUTES } from '@/lib/admin/admin-constants';
import { useAdminAuth } from '@/lib/admin/admin-auth';

const ACTIONS = [
  { label: 'Add New Carrier', icon: UserPlus, href: ADMIN_ROUTES.carrierNew, perm: 'carriers.approve' },
  { label: 'Create Load', icon: Truck, href: ADMIN_ROUTES.loadsNew, perm: 'loads.manage' },
  { label: 'Assign Load', icon: Route, href: ADMIN_ROUTES.loads, perm: 'loads.manage' },
  { label: 'Upload Document', icon: UploadCloud, href: ADMIN_ROUTES.documents, perm: 'documents.review' },
  { label: 'Add Staff User', icon: Users, href: ADMIN_ROUTES.staffNew, perm: 'staff.manage' },
  { label: 'System Report', icon: BarChart3, href: ADMIN_ROUTES.reports, perm: 'roles.manage' },
];

export function QuickActions() {
  const { can } = useAdminAuth();
  return (
    <section
      data-dash="panel"
      aria-label="Quick actions"
      className="rounded-lg border border-[var(--adm-b1)] p-5"
      style={{ background: 'var(--adm-s1)' }}
    >
      <h2 className="text-[13px] font-semibold tracking-[0.14em] text-[var(--adm-t2)]">QUICK ACTIONS</h2>

      {/* v2: 2 tiles per row at all breakpoints — wider industrial control switches */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {ACTIONS.map((a) => {
          const allowed = can(a.perm);
          const Icon = a.icon;
          return (
            <Link
              key={a.label}
              href={allowed ? a.href : '#'}
              aria-disabled={!allowed}
              data-dash="qaction"
              className={
                'adm-qact group flex min-h-[116px] flex-col items-center justify-center gap-3 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] p-4 text-center transition-colors ' +
                (allowed ? 'hover:border-[rgba(245,158,11,0.42)]' : 'opacity-45 pointer-events-none')
              }
            >
              <Icon size={24} strokeWidth={1.5} className="text-[var(--adm-a4)] transition-transform group-hover:-translate-y-px" />
              <span className="text-[12px] font-medium leading-4 text-[var(--adm-t1)]">{a.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}