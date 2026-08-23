/* ============ CarrierVerificationPanel v3 ============ */
'use client';
import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { ApiRequestError } from '@/lib/api-client';
import { carrierApi } from '@/lib/admin/carrier-data';
import type { CarrierFile } from '@/lib/admin/carrier-types';
import { formatDateTime } from '@/lib/admin/format';
import { StatusBadge } from './StatusBadge';

export function CarrierVerificationPanel({ file, can, refresh, notify }: { file: CarrierFile; can: (k: string) => boolean; refresh: () => Promise<void>; notify: (m: string) => void }) {
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canOverride = can('verification.override');
  const results = Array.isArray(file.verificationResults) ? file.verificationResults : [];
  const latest = results[results.length - 1] ?? null;

  const confirm = async () => {
    if (!latest) return;
    setBusy(true); setError(null);
    try {
      await carrierApi.overrideVerification(latest.id, { status: 'admin_confirmed', adminNotes: notes || 'Confirmed.' });
      await refresh(); notify('Verification confirmed.'); setNotes('');
    } catch (e) { setError(e instanceof ApiRequestError ? e.message : 'Connection problem.'); }
    finally { setBusy(false); }
  };

  return (
    <section aria-label="Verification" className="rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)] p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[13px] font-semibold tracking-[0.14em] text-[var(--adm-t2)]">VERIFICATION</h2>
        <StatusBadge value={file.verificationStatus} />
      </div>
      <ul className="mt-4 space-y-2.5">
        {results.map((v) => (
          <li key={v.id} className="rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="tnum text-[11.5px] text-[var(--adm-t1)]">{v.inputNumber} • {v.inputCountry}</p>
              <StatusBadge value={v.resultStatus} />
            </div>
            <p className="tnum mt-1 text-[10px] text-[var(--adm-t4)]">method: {(v.method ?? '').replace(/_/g, ' ')} • {formatDateTime(v.createdAt)}</p>
          </li>
        ))}
        {results.length === 0 && <li className="py-3 text-center text-[11.5px] text-[var(--adm-t4)]">No verification attempts yet.</li>}
      </ul>
      {file.verificationStatus !== 'admin_confirmed' && (
        <div className="mt-4 rounded-md border border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.05)] p-3">
          <p className="text-[11px] text-[var(--adm-t3)]">Confirm manually to unblock approval.</p>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Admin notes..." className="mt-2 w-full rounded border border-[var(--adm-b1)] bg-[var(--adm-s3)] p-2 text-[11px] text-[var(--adm-t1)] focus:border-[rgba(245,158,11,0.42)] focus:outline-none" />
          <button onClick={confirm} disabled={!canOverride || busy || !latest} className="mt-2 flex items-center gap-2 rounded-md bg-[var(--adm-a5)] px-3.5 py-2 text-[11.5px] font-bold text-black hover:opacity-90 disabled:opacity-40"><ShieldCheck size={13} /> {busy ? 'Confirming...' : 'Confirm Verification'}</button>
          {error && <p role="alert" className="mt-2 text-[11px] text-[var(--adm-danger)]">{error}</p>}
        </div>
      )}
    </section>
  );
}
