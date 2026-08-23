/* ============ admin carrier detail page v1 ============ */
import { AdminShell } from '@/components/admin/shell/AdminShell';
import { CarrierFilePage } from '@/components/admin/carrier/CarrierFilePage';

export default function AdminCarrierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <AdminShell>
      <CarrierFilePage params={params} />
    </AdminShell>
  );
}