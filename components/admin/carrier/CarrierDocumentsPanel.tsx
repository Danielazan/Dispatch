/* ============ CarrierDocumentsPanel v4 ============ */
'use client';
import { useState } from 'react';
import { Download, Eye } from 'lucide-react';
import { ApiRequestError } from '@/lib/api-client';
import { carrierApi } from '@/lib/admin/carrier-data';
import { DOC_LABEL, type CarrierDocument, type CarrierFile } from '@/lib/admin/carrier-types';
import { formatDateTime } from '@/lib/admin/format';
import { StatusBadge } from './StatusBadge';
import { DocumentPreviewModal } from './DocumentPreviewModal';

export function CarrierDocumentsPanel({ file, can, refresh, notify }: { file: CarrierFile; can: (k: string) => boolean; refresh: () => Promise<void>; notify: (m: string) => void }) {
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<CarrierDocument | null>(null);
  const canReview = can('documents.review');
  const canDownload = can('documents.view');
  const docs = Array.isArray(file.documents) ? file.documents : [];

  const review = async (docId: string, status: 'accepted' | 'rejected', docNotes?: string) => {
    setBusyId(docId); setFieldError(null);
    try {
      await carrierApi.reviewDocument(docId, { status, notes: docNotes });
      await refresh(); notify(status === 'accepted' ? 'Document accepted.' : 'Document rejected.'); setRejectingId(null); setNotes('');
    } catch (e) {
      if (e instanceof ApiRequestError) {
        if (e.status === 404) notify('Backend GAP-024: document review endpoint not yet implemented.');
        else if (e.details?.[0]?.path === 'notes') setFieldError(e.details[0].message);
        else notify(e.message);
      } else notify('Review failed.');
    } finally { setBusyId(null); }
  };

  const download = async (docId: string, filename: string) => {
    setBusyId(docId);
    try { await carrierApi.downloadDocument(docId, filename); }
    catch (e) { notify(e instanceof ApiRequestError ? 'Download blocked (' + e.status + ').' : 'Download failed.'); }
    finally { setBusyId(null); }
  };

  return (
    <section aria-label="Documents" className="rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)] p-5">
      <h2 className="text-[13px] font-semibold tracking-[0.14em] text-[var(--adm-t2)]">DOCUMENTS</h2>
      <ul className="mt-4 space-y-3">
        {docs.map((d) => (
          <li key={d.id} className="rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] p-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[12.5px] font-medium text-[var(--adm-t1)]">{DOC_LABEL[d.documentType] ?? d.documentType}</p>
                <p className="tnum mt-0.5 truncate text-[10.5px] text-[var(--adm-t4)]">{d.fileName} • {formatDateTime(d.createdAt)}</p>
              </div>
              <StatusBadge value={d.reviewStatus} />
            </div>
            {d.reviewStatus === 'rejected' && d.reviewNotes && (<p className="mt-2 rounded border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.07)] px-2.5 py-1.5 text-[11px] text-[var(--adm-danger)]">{d.reviewNotes}</p>)}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {/* v4: in-browser preview is now the primary action (§6.6) */}
              <button onClick={() => setPreviewDoc(d)} disabled={busyId === d.id} className="flex items-center gap-1.5 rounded-md border border-[rgba(245,158,11,0.45)] bg-[rgba(245,158,11,0.08)] px-2.5 py-1.5 text-[10.5px] font-medium text-[var(--adm-a3)] hover:bg-[rgba(245,158,11,0.14)] disabled:opacity-40">
                <Eye size={12} /> Preview
              </button>
              <button onClick={() => download(d.id, d.fileName)} disabled={!canDownload || busyId === d.id} className="flex items-center gap-1.5 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s3)] px-2.5 py-1.5 text-[10.5px] text-[var(--adm-t2)] hover:border-[rgba(245,158,11,0.42)] disabled:opacity-40">
                <Download size={12} /> Download
              </button>
              {canReview && (<>
                <button onClick={() => review(d.id, 'accepted')} disabled={busyId === d.id || d.reviewStatus === 'accepted'} className="rounded-md border border-[rgba(34,197,94,0.45)] px-2.5 py-1.5 text-[10.5px] font-medium text-[var(--adm-ok)] hover:bg-[rgba(34,197,94,0.08)] disabled:opacity-40">Accept</button>
                <button onClick={() => { setRejectingId(rejectingId === d.id ? null : d.id); setNotes(''); setFieldError(null); }} disabled={busyId === d.id} className="rounded-md border border-[rgba(239,68,68,0.45)] px-2.5 py-1.5 text-[10.5px] font-medium text-[var(--adm-danger)] hover:bg-[rgba(239,68,68,0.08)] disabled:opacity-40">Reject</button>
              </>)}
            </div>
            {rejectingId === d.id && (
              <div className="mt-2.5">
                <textarea value={notes} onChange={(e) => { setNotes(e.target.value); setFieldError(null); }} rows={2} placeholder="Rejection notes (required)..." className="w-full rounded border border-[var(--adm-b1)] bg-[var(--adm-s3)] p-2 text-[11px] text-[var(--adm-t1)] focus:border-[rgba(245,158,11,0.42)] focus:outline-none" />
                {fieldError && <p role="alert" className="mt-1 text-[10.5px] text-[var(--adm-danger)]">{fieldError}</p>}
                <button onClick={() => review(d.id, 'rejected', notes)} disabled={busyId === d.id} className="mt-1.5 rounded-md bg-[var(--adm-danger)] px-3 py-1.5 text-[10.5px] font-bold text-black hover:opacity-90 disabled:opacity-50">Confirm rejection</button>
              </div>
            )}
          </li>
        ))}
        {docs.length === 0 && <li className="py-4 text-center text-[11.5px] text-[var(--adm-t4)]">No documents on file.</li>}
      </ul>
      <DocumentPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
    </section>
  );
}
