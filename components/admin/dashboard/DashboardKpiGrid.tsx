/* ============ DashboardKpiGrid v1 ============ */
'use client';
import type { DashboardMetric } from '@/lib/admin/admin-types';
import { KpiCard } from './KpiCard';

export function DashboardKpiGrid({ metrics }: { metrics: DashboardMetric[] }) {
  return (
    <section aria-label="Key operational metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      {metrics.map((m) => <KpiCard key={m.id} metric={m} />)}
    </section>
  );
}