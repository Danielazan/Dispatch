/* ============ AdminSidebar v1 ============ */
'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';
import {
  Gauge, Users, Truck, ClipboardList, ShieldCheck, FileCheck2, FileText, BadgeCheck,
  CheckCircle2, Package, UserRound, KeyRound, Settings, ScrollText, LogOut,
  MonitorSmartphone, Clock3, MapPin, X,
} from 'lucide-react';
import { useAdminAuth } from '@/lib/admin/admin-auth';
import { ADMIN_ROUTES, motion } from '@/lib/admin/admin-constants';
import { MOCK_SESSION } from '@/lib/admin/admin-mock-data';

const NAV = [
  { label: 'Dashboard', href: ADMIN_ROUTES.dashboard, icon: Gauge },
  { label: 'Marketing Leads', href: ADMIN_ROUTES.leads, icon: Users },
  { label: 'Carriers', href: ADMIN_ROUTES.carriers, icon: Truck },
  { label: 'Onboarding Pipeline', href: ADMIN_ROUTES.onboarding, icon: ClipboardList },
  { label: 'Compliance', href: ADMIN_ROUTES.compliance, icon: ShieldCheck },
  { label: 'Verifications', href: ADMIN_ROUTES.verifications, icon: FileCheck2 },
  { label: 'Agreements', href: ADMIN_ROUTES.agreements, icon: FileText },
  { label: 'Approvals', href: ADMIN_ROUTES.approvals, icon: BadgeCheck },
  { label: 'Activations', href: ADMIN_ROUTES.activations, icon: CheckCircle2 },
  { label: 'Loads', href: ADMIN_ROUTES.loads, icon: Package },
  { label: 'Staff & Users', href: ADMIN_ROUTES.staff, icon: UserRound },
  { label: 'Roles & Permissions', href: ADMIN_ROUTES.roles, icon: KeyRound },
  { label: 'System Settings', href: ADMIN_ROUTES.settings, icon: Settings },
  { label: 'Audit Logs', href: ADMIN_ROUTES.audit, icon: ScrollText },
];

function BrandMark() {
  return (
    <svg width="34" height="30" viewBox="0 0 34 30" aria-hidden="true">
      <path d="M2 22 L12 22 L8 30 L0 30 Z" fill="#d97706" />
      <path d="M6 12 L20 12 L15 21 L3 21 Z" fill="#f59e0b" />
      <path d="M12 1 L30 1 L24 10 L8 10 Z" fill="#ffad18" />
    </svg>
  );
}

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAdminAuth();
  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState({ top: 0, height: 0, ready: false });

  // Physical sliding active indicator — one element, moved by GSAP.
  useEffect(() => {
    const root = navRef.current;
    if (!root) return;
    const active = root.querySelector<HTMLElement>('[data-active="true"]');
    if (!active) return;
    const next = { top: active.offsetTop, height: active.offsetHeight, ready: true };
    setIndicator((prev) => {
      if (!prev.ready) return next;
      gsap.to('.sidebar-active-indicator', { top: next.top, height: next.height, duration: 0.55, ease: 'power3.out' });
      return next;
    });
  }, [pathname]);

  const body = (
    <div className="flex h-full flex-col" style={{ background: 'var(--adm-sidebar)' }}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-6">
        <BrandMark />
        <div className="leading-tight">
          <p className="text-[15px] font-extrabold tracking-wide text-[var(--adm-t1)]">AIK FREIGHT</p>
          <p className="text-[10px] font-bold tracking-[0.22em] text-[var(--adm-a5)]">DISPATCH ADMIN</p>
        </div>
        <button
          className="ml-auto rounded p-1 text-[var(--adm-t3)] hover:text-[var(--adm-t1)] lg:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav ref={navRef} aria-label="Main navigation" className="relative flex-1 overflow-y-auto px-3 pb-4">
        <p className="px-2 pb-2 text-[10px] font-semibold tracking-[0.18em] text-[var(--adm-t4)]">MAIN NAVIGATION</p>
        <span
          className="sidebar-active-indicator absolute left-0 w-[3px] rounded-r bg-[var(--adm-a5)]"
          style={{ top: indicator.top, height: indicator.height, opacity: indicator.ready ? 1 : 0 }}
        />
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  data-active={active}
                  onClick={onClose}
                  className={
                    'group relative flex items-center gap-3 rounded-md px-3 py-2 text-[13px] transition-colors ' +
                    (active
                      ? 'font-medium text-[var(--adm-a4)]'
                      : 'text-[var(--adm-t2)] hover:bg-[var(--adm-s2)] hover:text-[var(--adm-t1)]')
                  }
                  style={active ? { background: 'rgba(245,158,11,0.07)' } : undefined}
                >
                  <Icon size={16} strokeWidth={1.8} className={active ? 'text-[var(--adm-a4)]' : 'text-[var(--adm-t3)] group-hover:text-[var(--adm-t2)]'} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Active session */}
      <div className="border-t px-5 py-4" style={{ borderColor: 'var(--adm-b1)' }}>
        <p className="pb-3 text-[10px] font-semibold tracking-[0.18em] text-[var(--adm-t4)]">ACTIVE SESSION</p>
        <ul className="space-y-2.5 text-[11px] text-[var(--adm-t3)]">
          <li className="flex items-start gap-2.5">
            <MapPin size={13} className="mt-0.5 shrink-0" />
            <span>IP Address<br /><b className="font-medium text-[var(--adm-t2)]">{MOCK_SESSION.ip}</b></span>
            <span className="ml-auto mt-1 h-1.5 w-1.5 rounded-full bg-[var(--adm-ok)]" />
          </li>
          <li className="flex items-start gap-2.5">
            <MonitorSmartphone size={13} className="mt-0.5 shrink-0" />
            <span>Device<br /><b className="font-medium text-[var(--adm-t2)]">{MOCK_SESSION.device}</b></span>
          </li>
          <li className="flex items-start gap-2.5">
            <Clock3 size={13} className="mt-0.5 shrink-0" />
            <span>Last Login<br /><b className="font-medium text-[var(--adm-t2)]">{MOCK_SESSION.lastLogin}</b></span>
          </li>
        </ul>
        <button
          onClick={async () => { await logout(); router.replace(ADMIN_ROUTES.login); }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-[var(--adm-a6)] py-2 text-[12px] font-medium text-[var(--adm-a4)] transition-colors hover:bg-[rgba(245,158,11,0.08)]"
        >
          <LogOut size={14} /> Log Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop rail */}
      <aside className="hidden lg:block h-screen sticky top-0 shrink-0 border-r" style={{ width: 252, borderColor: 'var(--adm-b1)' }}>
        {body}
      </aside>
      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
          <aside className="absolute left-0 top-0 h-full w-[280px] shadow-2xl">{body}</aside>
        </div>
      )}
    </>
  );
}