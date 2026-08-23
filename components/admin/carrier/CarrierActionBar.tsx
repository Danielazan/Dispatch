/* ============ CarrierActionBar v3 ============ */
'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { BadgeCheck, ShieldCheck, XCircle } from 'lucide-react';
import { ApiRequestError } from '@/lib/api-client';
import { carrierApi } from '@/lib/admin/carrier-data';
import { getLatestAgreement } from '@/lib/admin/carrier-utils';
import type { CarrierFile } from '@/lib/admin/carrier-types';

export function CarrierActionBar({ file, can, refresh, notify }: { file: CarrierFile; can: (k: string) => boolean; refresh: () => Promise<void>; notify: (m: string) => void }) {
  const [modal, setModal] = useState<null | 'approve' | 'activate' | 'reject'>(null);
  const [reason, setReason] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const allowed = can('carriers.approve');
  const blocks: string[] = [];
  if (file.status === 'admin_review') {
    if (file.verificationStatus !== 'admin_confirmed') blocks.push('Verification not admin-confirmed');
    if (getLatestAgreement(file)?.status !== 'signed') blocks.push('Latest agreement not signed');
  }
  const run = async (fn: () => Promise<unknown>, success: string) => {
    setBusy(true); setApiError(null); setFieldError(null);
    try { await fn(); await refresh(); setModal(null); setReason(''); notify(success); }
    catch (e) {
      if (e instanceof ApiRequestError) {
        if (e.status === 400 && e.details?.[0]?.path === 'reason') setFieldError(e.details[0].message);
        else setApiError(e.message);
      } else setApiError('Connection problem.');
    } finally { setBusy(false); }
  };
  return (
    <div className="rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)] p-4">
      <div className="flex flex-wrap items-center gap-3">
        {file.status === 'admin_review' && (<>
          <button onClick={() => setModal('approve')} disabled={!allowed || busy || blocks.length > 0} className="flex h-10 items-center gap-2 rounded-md bg-[var(--adm-a5)] px-4 text-[12.5px] font-bold text-black hover:opacity-90 disabled:opacity-40"><BadgeCheck size={15} /> Approve</button>
          <button onClick={() => setModal('reject')} disabled={!allowed || busy} className="flex h-10 items-center gap-2 rounded-md border border-[rgba(239,68,68,0.5)] px-4 text-[12.5px] font-medium text-[var(--adm-danger)] hover:bg-[rgba(239,68,68,0.08)] disabled:opacity-40"><XCircle size={15} /> Reject</button>
        </>)}
        {file.status === 'approved' && (<button onClick={() => setModal('activate')} disabled={!allowed || busy} className="flex h-10 items-center gap-2 rounded-md bg-[var(--adm-a5)] px-4 text-[12.5px] font-bold text-black hover:opacity-90 disabled:opacity-40"><ShieldCheck size={15} /> Activate</button>)}
        {['active', 'rejected', 'suspended'].includes(file.status) && (<p className="text-[12px] text-[var(--adm-t3)]">No state-changing actions available.</p>)}
        {!allowed && <p className="text-[11px] text-[var(--adm-t4)]">Requires carriers.approve.</p>}
      </div>
      {blocks.length > 0 && file.status === 'admin_review' && (<ul className="mt-3 space-y-1">{blocks.map((b) => <li key={b} className="text-[11px] text-[var(--adm-a3)]">• {b}</li>)}</ul>)}
      {apiError && <p role="alert" className="mt-3 rounded border border-[rgba(239,68,68,0.4)] bg-[rgba(239,68,68,0.08)] px-3 py-2 text-[11.5px] text-[var(--adm-danger)]">{apiError}</p>}
      {modal && createPortal(
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60" onClick={() => !busy && setModal(null)} aria-hidden="true" />
          <div className="pipe-pop relative w-full max-w-md rounded-lg border border-[var(--adm-b2)] bg-[var(--adm-s2)] p-5 shadow-2xl">
            {modal === 'approve' && (<><h2 className="text-[15px] font-bold text-[var(--adm-t1)]">Approve carrier?</h2><p className="mt-2 text-[12px] leading-5 text-[var(--adm-t3)]">Approval is a compliance decision, not activation.</p></>)}
            {modal === 'activate' && (<><h2 className="text-[15px] font-bold text-[var(--adm-t1)]">Activate carrier?</h2><p className="mt-2 text-[12px] leading-5 text-[var(--adm-t3)]">Activation flips the carrier to active.</p></>)}
            {modal === 'reject' && (<>
              <h2 className="text-[15px] font-bold text-[var(--adm-t1)]">Reject carrier</h2>
              <textarea value={reason} onChange={(e) => { setReason(e.target.value); setFieldError(null); }} rows={4} placeholder="Reason..." className="mt-3 w-full rounded border border-[var(--adm-b1)] bg-[var(--adm-s3)] p-2.5 text-[12px] text-[var(--adm-t1)] focus:border-[rgba(245,158,11,0.42)] focus:outline-none" />
              {fieldError && <p role="alert" className="mt-1.5 text-[11px] text-[var(--adm-danger)]">{fieldError}</p>}
            </>)}
            <div className="mt-4 flex justify-end gap-2.5">
              <button onClick={() => setModal(null)} disabled={busy} className="rounded-md border border-[var(--adm-b1)] px-4 py-2 text-[12px] text-[var(--adm-t2)] disabled:opacity-50">Cancel</button>
              <button disabled={busy} onClick={() => {
                if (modal === 'approve') run(() => carrierApi.approve(file.id), 'Approved.');
                if (modal === 'activate') run(() => carrierApi.activate(file.id), 'Activated.');
                if (modal === 'reject') run(() => carrierApi.reject(file.id, reason), 'Rejected.');
              }} className={'rounded-md px-4 py-2 text-[12px] font-bold disabled:opacity-50 ' + (modal === 'reject' ? 'bg-[var(--adm-danger)] text-black' : 'bg-[var(--adm-a5)] text-black')}>
                {busy ? 'Working...' : (modal === 'reject' ? 'Reject' : modal === 'activate' ? 'Activate' : 'Approve')}
              </button>
            </div>
          </div>
        </div>, document.body)}
    </div>
  );
}
