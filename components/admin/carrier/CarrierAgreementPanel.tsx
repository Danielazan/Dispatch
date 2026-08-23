/* ============ CarrierAgreementPanel v3 ============ */
'use client';
import { Download } from 'lucide-react';
import { getLatestAgreement } from '@/lib/admin/carrier-utils';
import type { CarrierFile } from '@/lib/admin/carrier-types';
import { formatDateTime } from '@/lib/admin/format';
import { StatusBadge } from './StatusBadge';

export function CarrierAgreementPanel({ file, notify }: { file: CarrierFile; notify: (m: string) => void }) {
  const latest = getLatestAgreement(file);
  const agreements = Array.isArray(file.agreements) ? file.agreements : [];
  return (
    <section aria-label="Agreement" className="rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)] p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[13px] font-semibold tracking-[0.14em] text-[var(--adm-t2)]">AGREEMENT</h2>
        {latest && <StatusBadge value={latest.status} />}
      </div>
      {latest ? (
        <div className="mt-4 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] p-3.5">
          <p className="text-[11.5px] text-[var(--adm-t2)]">method: <b className="text-[var(--adm-t1)]">{(latest.method ?? '').replace(/_/g, ' ')}</b></p>
          {latest.signerName && <p className="tnum mt-1 text-[11px] text-[var(--adm-t3)]">Signer: {latest.signerName}{latest.signedAt ? ' • signed ' + formatDateTime(latest.signedAt) : ''}</p>}
          <p className="mt-2 rounded border border-[var(--adm-b1)] bg-[var(--adm-s3)] px-2.5 py-1.5 text-[10px] italic text-[var(--adm-t4)]">"{latest.consentTextShown}"</p>
          {latest.status === 'signed' && (<button onClick={() => notify('Signed-PDF download mechanism unconfirmed (GAP-022).')} className="mt-2.5 flex items-center gap-1.5 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s3)] px-2.5 py-1.5 text-[10.5px] text-[var(--adm-t2)] hover:border-[rgba(245,158,11,0.42)]"><Download size={12} /> Download signed PDF</button>)}
        </div>
      ) : (<p className="mt-4 py-3 text-center text-[11.5px] text-[var(--adm-t4)]">No agreement records yet.</p>)}
      {agreements.length > 1 && (<>
        <h3 className="mt-4 text-[10.5px] font-semibold tracking-[0.16em] text-[var(--adm-t4)]">HISTORY</h3>
        <ul className="mt-2 space-y-1.5">
          {[...agreements].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-2 text-[10.5px] text-[var(--adm-t3)]">
              <span className="tnum">{formatDateTime(a.createdAt)}</span>
              <StatusBadge value={a.status} />
            </li>
          ))}
        </ul>
      </>)}
    </section>
  );
}
