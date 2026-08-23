/* ============ CarrierFilePage v2 ============ */
'use client';
import { useCallback, useEffect, use, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAdminAuth } from '@/lib/admin/admin-auth';
import { ApiRequestError } from '@/lib/api-client';
import { carrierApi } from '@/lib/admin/carrier-data';
import type { CarrierFile } from '@/lib/admin/carrier-types';
import { CarrierFileHeader } from './CarrierFileHeader';
import { CarrierActionBar } from './CarrierActionBar';
import { CarrierSectionsPanel } from './CarrierSectionsPanel';
import { CarrierDocumentsPanel } from './CarrierDocumentsPanel';
import { CarrierVerificationPanel } from './CarrierVerificationPanel';
import { CarrierAgreementPanel } from './CarrierAgreementPanel';
import { CarrierSkeleton, CarrierErrorState, CarrierNotFoundState, CarrierPermissionState } from './CarrierStates';

type LoadState = 'loading' | 'ready' | 'error' | 'notfound' | 'forbidden';

const PENDING_FAMILY = ['pending', 'sent', 'manual_pending', 'inconclusive'];

export function CarrierFilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { can } = useAdminAuth();
  const [file, setFile] = useState<CarrierFile | null>(null);
  const [state, setState] = useState<LoadState>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const notify = useCallback((m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  const load = useCallback(async (silent = false) => {
    if (!silent) setState('loading'); else setRefreshing(true);
    try {
      const f = await carrierApi.file(id);
      setFile(f);
      setState('ready');
    } catch (e) {
      if (e instanceof ApiRequestError) {
        if (e.status === 404) setState('notfound');
        else if (e.status === 403) setState('forbidden');
        else setState((s) => (silent ? s : 'error'));
      } else setState((s) => (silent ? s : 'error'));
    } finally { setRefreshing(false); }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  // §10 — poll every ~10s while concurrent async sub-processes unresolved; pause when tab hidden.
  const pollingNeeded = !!file && file.status === 'admin_review' &&
    (PENDING_FAMILY.includes(file.verificationStatus) || PENDING_FAMILY.includes(file.agreementStatus));
  useEffect(() => {
    if (!pollingNeeded) return;
    const t = setInterval(() => { if (!document.hidden) load(true); }, 10000);
    return () => clearInterval(t);
  }, [pollingNeeded, load]);

  const refresh = useCallback(() => load(true), [load]);

  if (!can('carriers.view')) return <div className="p-6"><CarrierPermissionState /></div>;

  return (
    <div className="space-y-5 p-5 md:p-6">
      {state === 'loading' && <CarrierSkeleton />}
      {state === 'error' && <CarrierErrorState onRetry={() => load()} />}
      {state === 'notfound' && <CarrierNotFoundState />}
      {state === 'forbidden' && <CarrierPermissionState />}
      {state === 'ready' && file && (
        <>
          <CarrierFileHeader file={file} onRefresh={refresh} refreshing={refreshing} />
          <CarrierActionBar file={file} can={can} refresh={refresh} notify={notify} />
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <div className="space-y-5">
              <CarrierSectionsPanel file={file} />
              <CarrierDocumentsPanel file={file} can={can} refresh={refresh} notify={notify} />
            </div>
            <div className="space-y-5">
              <CarrierVerificationPanel file={file} can={can} refresh={refresh} notify={notify} />
              <CarrierAgreementPanel file={file} notify={notify} />
            </div>
          </div>
        </>
      )}
      {toast && createPortal(
        <div className="pipe-pop fixed bottom-6 right-6 z-[80] rounded-md border border-[rgba(245,158,11,0.45)] bg-[var(--adm-s3)] px-4 py-2.5 text-[12px] text-[var(--adm-a3)] shadow-2xl" role="status">
          {toast}
        </div>,
        document.body,
      )}
    </div>
  );
}