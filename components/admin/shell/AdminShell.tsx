/* ============ AdminShell v1 ============ */
'use client';
import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminCommandBar } from './AdminCommandBar';

export function AdminShell({ children, systemOk = true, systemLabel = 'All Systems Operational' }: {
  children: React.ReactNode;
  systemOk?: boolean;
  systemLabel?: string;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div className="aik-admin min-h-screen" style={{ background: 'var(--adm-bg)' }}>
      <div className="flex">
        <AdminSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        <div className="min-w-0 flex-1">
          <AdminCommandBar onMenu={() => setDrawerOpen(true)} systemOk={systemOk} systemLabel={systemLabel} />
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}