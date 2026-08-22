/* ============ PipelineStates v1 ============ */
'use client';

export function PipelineSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading onboarding pipeline">
      <div className="flex justify-between"><div className="adm-skeleton h-14 w-80" /><div className="adm-skeleton h-10 w-72" /></div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-6">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="adm-skeleton h-[104px]" />)}</div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-6">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="adm-skeleton h-[340px]" />)}</div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="adm-skeleton h-[280px]" />)}</div>
    </div>
  );
}

export function PipelineErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="rounded-lg border border-[rgba(239,68,68,0.35)] bg-[var(--adm-s1)] px-8 py-6 text-center">
        <p className="text-[13px] font-semibold tracking-[0.14em] text-[var(--adm-t1)]">PIPELINE DATA UNAVAILABLE</p>
        <p className="mt-2 text-[12px] text-[var(--adm-t3)]">We couldn&apos;t load the onboarding queue snapshot.</p>
        <button onClick={onRetry} className="mt-4 rounded-md border border-[var(--adm-a6)] px-4 py-2 text-[12px] font-medium text-[var(--adm-a4)] hover:bg-[rgba(245,158,11,0.08)]">Retry</button>
      </div>
    </div>
  );
}

export function PipelinePermissionState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)] px-8 py-6 text-center">
        <p className="text-[13px] font-semibold tracking-[0.14em] text-[var(--adm-t2)]">INSUFFICIENT PERMISSIONS</p>
        <p className="mt-2 text-[12px] text-[var(--adm-t3)]">This queue requires <code className="text-[var(--adm-a3)]">carriers.view</code>. Contact your administrator.</p>
      </div>
    </div>
  );
}