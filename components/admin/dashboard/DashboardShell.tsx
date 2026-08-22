/* ============ DashboardShell v1 ============ */
'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getDashboardSnapshot } from '@/lib/admin/admin-mock-data';
import type { DashboardSnapshot } from '@/lib/admin/admin-types';
import { useDashboardEntranceTimeline } from './DashboardMotion';
import { DashboardHeader } from './DashboardHeader';
import { DashboardKpiGrid } from './DashboardKpiGrid';
import { OnboardingPipeline } from './OnboardingPipeline';
import { CarrierDistributionMap } from './CarrierDistributionMap';
import { RealtimeActivity } from './RealtimeActivity';
import { PendingVerifications } from './PendingVerifications';
import { QuickActions } from './QuickActions';
import { DashboardSkeleton, DashboardErrorState, DashboardEmptyState } from './DashboardStates';

export function DashboardShell() {
  const [snap, setSnap] = useState<DashboardSnapshot | null>(null);
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading');
  const rootRef = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    setState('loading');
    getDashboardSnapshot()
      .then((s) => { setSnap(s); setState('ready'); })
      .catch(() => setState('error'));
  }, []);

  useEffect(() => { load(); }, [load]);
  useDashboardEntranceTimeline(rootRef, state === 'ready');

  const empty = snap?.metrics.every((m) => m.value === 0) ?? false;

  return (
    <div ref={rootRef} data-dash="shell" className="space-y-5 p-5 md:p-6 2xl:p-7">
      {state === 'loading' && <DashboardSkeleton />}
      {state === 'error' && <DashboardErrorState onRetry={load} />}
      {state === 'ready' && snap && (empty ? <DashboardEmptyState /> : (
        <>
          <DashboardHeader />
          <DashboardKpiGrid metrics={snap.metrics} />
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <OnboardingPipeline data={snap.pipeline} total={snap.pipelineTotal} />
            <CarrierDistributionMap regions={snap.carrierRegions} />
            <RealtimeActivity events={snap.activities} />
          </div>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="xl:col-span-2"><PendingVerifications data={snap.verifications} /></div>
            <QuickActions />
          </div>
        </>
      ))}
    </div>
  );
}