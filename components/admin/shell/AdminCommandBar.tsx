/* ============ AdminCommandBar v2 ============ */
'use client';
import { Menu, Search, Bell, MessageSquare, ChevronDown } from 'lucide-react';
import { useAdminAuth } from '@/lib/admin/admin-auth';
import { SystemStatus } from './SystemStatus';

export function AdminCommandBar({ onMenu, systemOk, systemLabel }: { onMenu: () => void; systemOk: boolean; systemLabel: string }) {
  const { adminUser } = useAdminAuth();
  const name = adminUser?.fullName || 'Admin';
  const roleName = adminUser?.role?.name ?? 'Staff'; // v2: never crash on absent role (DOC-DIFF-3)
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() || 'AD';

  return (
    <header
      className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b px-4 md:px-6"
      style={{ background: 'var(--adm-command)', borderColor: 'var(--adm-b1)' }}
    >
      <button className="rounded p-1.5 text-[var(--adm-t2)] hover:text-[var(--adm-t1)] lg:hidden" onClick={onMenu} aria-label="Open navigation">
        <Menu size={18} />
      </button>

      <div className="adm-search flex h-9 w-full max-w-md items-center gap-2.5 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s1)] px-3 transition-colors focus-within:border-[rgba(245,158,11,0.42)]">
        <Search size={14} className="shrink-0 text-[var(--adm-t3)]" />
        <input
          type="search"
          placeholder="Search carriers, loads, staff, MC#, email..."
          aria-label="Global search"
          className="w-full bg-transparent text-[12.5px] text-[var(--adm-t1)] placeholder:text-[var(--adm-t4)] focus:outline-none"
        />
        <kbd className="hidden shrink-0 rounded border border-[var(--adm-b1)] bg-[var(--adm-s2)] px-1.5 py-0.5 text-[10px] text-[var(--adm-t3)] sm:block">⌘K</kbd>
      </div>

      <div className="ml-auto flex items-center gap-4 md:gap-5">
        <SystemStatus label={systemLabel} ok={systemOk} />

        <button className="relative rounded p-1 text-[var(--adm-t2)] hover:text-[var(--adm-t1)]" aria-label="Notifications, 12 unread">
          <Bell size={17} />
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--adm-a5)] px-1 text-[9.5px] font-bold text-black">12</span>
        </button>
        <button className="relative rounded p-1 text-[var(--adm-t2)] hover:text-[var(--adm-t1)]" aria-label="Messages, 3 unread">
          <MessageSquare size={17} />
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--adm-a5)] px-1 text-[9.5px] font-bold text-black">3</span>
        </button>

        <button className="flex items-center gap-2.5" aria-label="Account menu">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--adm-a6)] bg-[var(--adm-s3)] text-[11px] font-bold text-[var(--adm-a3)]">
            {initials}
          </span>
          <span className="hidden text-left leading-tight md:block">
            <span className="block text-[12px] font-medium text-[var(--adm-t1)]">{name}</span>
            <span className="block text-[10.5px] text-[var(--adm-t3)]">{roleName}</span>
          </span>
          <ChevronDown size={14} className="hidden text-[var(--adm-t3)] md:block" />
        </button>
      </div>
    </header>
  );
}