/* ============ admin layout v2 ============ */
import './admin.css';
import './pipeline.css';
import { AdminAuthProvider } from '@/lib/admin/admin-auth';
import { AdminGuard } from '@/components/admin/shell/AdminGuard';

export const metadata = { robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AdminAuthProvider>
  );
}