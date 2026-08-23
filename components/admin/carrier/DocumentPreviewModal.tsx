/* ============ DocumentPreviewModal v1 ============ */
'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, ExternalLink, FileText, X } from 'lucide-react';
import { carrierApi } from '@/lib/admin/carrier-data';
import type { CarrierDocument } from '@/lib/admin/carrier-types';

export function DocumentPreviewModal({ doc, onClose }: { doc: CarrierDocument | null; onClose: () => void }) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [url, setUrl] = useState<string | null>(null);
  const [kind, setKind] = useState<'image' | 'pdf' | 'other'>('other');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!doc) return;
    let cancelled = false;
    let objectUrl: string | null = null;
    setState('loading');
    carrierApi.previewDocument(doc.id)
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
        setKind(blob.type.startsWith('image/') ? 'image' : blob.type === 'application/pdf' ? 'pdf' : 'other');
        setState('ready');
      })
      .catch((e) => { if (!cancelled) { setError(e?.message ?? 'Preview failed.'); setState('error'); } });
    return () => { cancelled = true; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [doc]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (doc) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [doc, onClose]);

  if (!doc) return null;

  return createPortal(
    <div className="fixed inset-0 z-[75] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={'Preview ' + doc.fileName}>
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      <div className="relative flex h-[85vh] w-[min(980px,94vw)] flex-col overflow-hidden rounded-lg border border-[var(--adm-b2)] bg-[var(--adm-s1)] shadow-2xl">
        <div className="flex items-center gap-3 border-b border-[var(--adm-b1)] px-4 py-3">
          <FileText size={16} className="shrink-0 text-[var(--adm-a4)]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-[var(--adm-t1)]">{doc.fileName}</p>
            <p className="text-[10.5px] text-[var(--adm-t4)]">{doc.mimeType ?? 'unknown type'} • authenticated preview</p>
          </div>
          {url && (
            <button onClick={() => window.open(url, '_blank')} className="flex items-center gap-1.5 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] px-2.5 py-1.5 text-[10.5px] text-[var(--adm-t2)] hover:border-[rgba(245,158,11,0.42)]">
              <ExternalLink size={12} /> Open in new tab
            </button>
          )}
          <button onClick={onClose} aria-label="Close preview" className="rounded p-1 text-[var(--adm-t3)] hover:text-[var(--adm-t1)]"><X size={16} /></button>
        </div>

        <div className="min-h-0 flex-1 bg-[#05080b]">
          {state === 'loading' && (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 rounded-full border-2 border-[var(--adm-s4)] border-t-[var(--adm-a5)]" style={{ animation: 'spin 0.9s linear infinite' }} />
              <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
            </div>
          )}
          {state === 'error' && (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-[13px] font-semibold text-[var(--adm-danger)]">PREVIEW UNAVAILABLE</p>
              <p className="max-w-sm text-[12px] text-[var(--adm-t3)]">{error}</p>
            </div>
          )}
          {state === 'ready' && url && kind === 'image' && (
            <div className="flex h-full items-center justify-center p-4">
              <img src={url} alt={doc.fileName} className="max-h-full max-w-full object-contain" />
            </div>
          )}
          {state === 'ready' && url && kind === 'pdf' && (
            <iframe src={url} title={doc.fileName} className="h-full w-full" />
          )}
          {state === 'ready' && url && kind === 'other' && (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-[13px] font-semibold text-[var(--adm-t2)]">NO INLINE PREVIEW FOR THIS FILE TYPE</p>
              <p className="max-w-sm text-[12px] text-[var(--adm-t3)]">Use download or open-in-new-tab instead.</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
