/* ============ CarrierStates v1 ============ */
'use client';

export function CarrierSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading carrier file">
      <div className="adm-skeleton h-24" />
      <div className="adm-skeleton h-14" />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="adm-skeleton h-[320px]" />
        <div className="adm-skeleton h-[320px]" />
      </div>
    </div>
  );
}

export function CarrierErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="rounded-lg border border-[rgba(239,68,68,0.35)] bg-[var(--adm-s1)] px-8 py-6 text-center">
        <p className="text-[13px] font-semibold tracking-[0.14em] text-[var(--adm-t1)]">CARRIER FILE UNAVAILABLE</p>
        <p className="mt-2 text-[12px] text-[var(--adm-t3)]">We couldn&apos;t load this carrier file.</p>
        <button onClick={onRetry} className="mt-4 rounded-md border border-[var(--adm-a6)] px-4 py-2 text-[12px] font-medium text-[var(--adm-a4)] hover:bg-[rgba(245,158,11,0.08)]">Retry</button>
      </div>
    </div>
  );
}

export function CarrierNotFoundState() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)] px-8 py-6 text-center">
        <p className="text-[13px] font-semibold tracking-[0.14em] text-[var(--adm-t2)]">CARRIER NOT FOUND</p>
        <p className="mt-2 text-[12px] text-[var(--adm-t3)]">This carrier record does not exist (404 record_not_found).</p>
      </div>
    </div>
  );
}

export function CarrierPermissionState() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)] px-8 py-6 text-center">
        <p className="text-[13px] font-semibold tracking-[0.14em] text-[var(--adm-t2)]">INSUFFICIENT PERMISSIONS</p>
        <p className="mt-2 text-[12px] text-[var(--adm-t3)]">This file requires <code className="text-[var(--adm-a3)]">carriers.view</code>. Contact your administrator.</p>
      </div>
    </div>
  );
}