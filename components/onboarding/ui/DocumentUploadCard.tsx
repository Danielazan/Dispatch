'use client';
import { useRef, useState } from 'react';
import { useOnboarding } from '@/lib/onboarding/context';
import { obApi } from '@/lib/onboarding/api';
import { Upload, Trash2 } from 'lucide-react';

const ACCEPTED = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_BYTES = 10 * 1024 * 1024;

interface Props {
  documentType: string;
  title: string;
}

export function DocumentUploadCard({ documentType, title }: Props) {
  const { state, refreshSession } = useOnboarding();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readOnly = state.sessionData?.readOnly === true || state.sessionData?.status === 'submitted';
  const doc = (state.sessionData?.carrier?.documents ?? []).find((d) => d.documentType === documentType);
  const status = !doc ? 'not-uploaded' : busy ? 'uploading' : doc.reviewStatus === 'accepted' ? 'accepted' : doc.reviewStatus === 'rejected' ? 'rejected' : 'pending';

  const onFile = async (file: File | null) => {
    if (!file) return;
    setError(null);
    if (!ACCEPTED.includes(file.type)) { setError('Only PDF, JPG, or PNG files are accepted.'); return; }
    if (file.size > MAX_BYTES) { setError('File exceeds the 10MB limit.'); return; }
    setBusy(true);
    try {
      await obApi.uploadDocument(state.token, file, documentType);
      await refreshSession(); // response-shape-agnostic: truth comes from the session GET
    } catch (e: any) {
      setError(e?.message ?? 'Upload failed — please try again.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = async () => {
    if (!doc || readOnly) return;
    if (!window.confirm(`Remove the uploaded ${title}? You can upload a replacement afterwards.`)) return;
    setBusy(true);
    setError(null);
    try {
      await obApi.deleteDocument(state.token, doc.id);
      await refreshSession();
    } catch (e: any) {
      setError(e?.message ?? 'Remove failed — please try again.');
    } finally {
      setBusy(false);
    }
  };

  const chip =
    status === 'accepted' ? { t: 'ACCEPTED', c: 'text-status-live border-status-live/40' }
    : status === 'rejected' ? { t: 'REJECTED — RE-UPLOAD', c: 'text-red-400 border-red-500/40' }
    : status === 'pending' ? { t: 'PENDING REVIEW', c: 'text-brass-300 border-brass-500/40' }
    : status === 'uploading' ? { t: 'UPLOADING…', c: 'text-steel-300 border-steel-600/50' }
    : { t: 'NOT UPLOADED YET', c: 'text-steel-400 border-steel-700/40' };

  return (
    <div className={`rounded-[8px] px-4 py-3.5 border ${status === 'not-uploaded' ? 'border-dashed border-steel-700/40 bg-ink-900/30' : 'border-steel-700/30 bg-ink-900/50'}`}>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[13px] text-ivory-100">{title}</span>
        <span className={`ml-auto text-[10px] font-tech uppercase tracking-wider border rounded-[5px] px-2 py-1 ${chip.c}`}>{chip.t}</span>
      </div>
      {doc?.fileName && status !== 'uploading' && (
        <p className="mt-1.5 text-[11px] font-tech text-steel-500 truncate">{doc.fileName}</p>
      )}
      {error && <p className="mt-2 text-[11px] text-red-400">{error}</p>}
      {!readOnly && (
        <div className="mt-3 flex items-center gap-2">
          <button type="button" disabled={busy} onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 h-8 px-3 rounded-[6px] border border-steel-700/40 text-[12px] font-semibold text-ivory-100 hover:border-brass-500/60 hover:text-brass-300 transition-colors disabled:opacity-50">
            <Upload size={13} /> {doc ? 'Replace file' : 'Upload file'}
          </button>
          {doc && status !== 'uploading' && (
            <button type="button" disabled={busy} onClick={remove}
              className="flex items-center gap-2 h-8 px-3 rounded-[6px] border border-steel-700/40 text-[12px] text-steel-400 hover:border-red-500/50 hover:text-red-400 transition-colors disabled:opacity-50">
              <Trash2 size={13} /> Remove
            </button>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept="application/pdf,image/jpeg,image/png" style={{ display: 'none' }}
        onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
    </div>
  );
}