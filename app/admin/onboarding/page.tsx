/* ============ admin onboarding pipeline page v1 ============ */
import { AdminShell } from '@/components/admin/shell/AdminShell';
import { PipelinePage } from '@/components/admin/pipeline/PipelinePage';

export default function AdminOnboardingPipelinePage() {
  return (
    <AdminShell>
      <PipelinePage />
    </AdminShell>
  );
}