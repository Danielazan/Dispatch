/* ============ PipelinePage v5 ============ */
'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getPipelineSnapshot, buildCarrierDetail, STAGE_ORDER } from '@/lib/admin/pipeline-mock-data';
import type { CarrierPipelineDetail, PipelineCardData, PipelineSnapshot, PipelineStageId } from '@/lib/admin/pipeline-types';
import { useAdminAuth } from '@/lib/admin/admin-auth';
import { usePipelineEntranceTimeline } from './PipelineMotion';
import { PipelineHeader } from './PipelineHeader';
import { StageSummaryStrip } from './StageSummaryStrip';
import { PipelineBoard } from './PipelineBoard';
import { PipelineAnalytics } from './PipelineAnalytics';
import { PipelineDistribution } from './PipelineDistribution';
import { PipelineBottlenecks } from './PipelineBottlenecks';
import { CarrierDetailDrawer } from './CarrierDetailDrawer';
import { PipelineSkeleton, PipelineErrorState, PipelinePermissionState } from './PipelineStates';

export function PipelinePage() {
  const { can } = useAdminAuth();
  const [snap, setSnap] = useState<PipelineSnapshot | null>(null);
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading');
  const [activeStage, setActiveStage] = useState<PipelineStageId>('submitted');
  const [hiddenStages, setHiddenStages] = useState<PipelineStageId[]>([]);
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [showPct, setShowPct] = useState(true);
  const [detail, setDetail] = useState<CarrierPipelineDetail | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    setState('loading');
    getPipelineSnapshot().then((s) => {
      setSnap(s);
      setState('ready');
      if (window.matchMedia('(min-width: 1760px)').matches) {
        const first = s.columns[0]?.cards[0];
        if (first) setDetail(s.details[first.id] ?? buildCarrierDetail(first, 0));
      }
    }).catch(() => setState('error'));
  }, []);

  useEffect(() => { load(); }, [load]);
  usePipelineEntranceTimeline(rootRef, state === 'ready');

  const jumpToStage = useCallback((s: PipelineStageId) => {
    setActiveStage(s);
    document.getElementById(`pipe-col-${s}`)?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }, []);

  const onSelectCard = useCallback((c: PipelineCardData, stage: PipelineStageId) => {
    setActiveStage(stage);
    setDetail((prev) => prev?.id === c.id ? prev : (snap?.details[c.id] ?? buildCarrierDetail(c, STAGE_ORDER.indexOf(stage))));
  }, [snap]);

  if (!can('carriers.view')) return <div className="p-6"><PipelinePermissionState /></div>;

  return (
    <div ref={rootRef} data-pipe="shell" className="flex min-h-full">
      <div className="min-w-0 flex-1 space-y-5 p-5 md:p-6">
        {state === 'loading' && <PipelineSkeleton />}
        {state === 'error' && <PipelineErrorState onRetry={load} />}
        {state === 'ready' && snap && (
          <>
            <PipelineHeader
              columns={snap.columns}
              hiddenStages={hiddenStages}
              onToggleStage={(s) => setHiddenStages((h) => h.includes(s) ? h.filter((x) => x !== s) : [...h, s])}
              density={density}
              onToggleDensity={() => setDensity((d) => d === 'compact' ? 'comfortable' : 'compact')}
              showPct={showPct}
              onToggleShowPct={() => setShowPct((v) => !v)}
            />
            <StageSummaryStrip summaries={snap.summaries} active={activeStage} showPct={showPct} onSelect={jumpToStage} />
            <PipelineBoard
              columns={snap.columns}
              hiddenStages={hiddenStages}
              selectedId={detail?.id ?? null}
              compact={density === 'compact'}
              onSelect={onSelectCard}
            />
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              <PipelineAnalytics data={snap.analytics} />
              <PipelineDistribution slices={snap.distribution} total={snap.pipelineTotal} />
              <PipelineBottlenecks rows={snap.bottlenecks} onJump={jumpToStage} />
            </div>
          </>
        )}
      </div>
      {detail && <CarrierDetailDrawer detail={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}