/* ============ admin dashboard page v1 ============ */
import { AdminShell } from '@/components/admin/shell/AdminShell';
import { DashboardShell } from '@/components/admin/dashboard/DashboardShell';

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <DashboardShell />
    </AdminShell>
  );
}