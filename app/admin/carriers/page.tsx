/* ============ admin carriers list page v1 ============ */
import { AdminShell } from '@/components/admin/shell/AdminShell';
import { CarriersListPage } from '@/components/admin/carriers/CarriersListPage';

export default function AdminCarriersPage() {
  return (
    <AdminShell>
      <CarriersListPage />
    </AdminShell>
  );
}