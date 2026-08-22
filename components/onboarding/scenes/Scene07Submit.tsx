/* ============ Scene07Submit v3 ============ */
'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useOnboarding, useSceneSave } from '@/lib/onboarding/context';
import { obApi } from '@/lib/onboarding/api';
import { LEGAL_TEXT } from '@/config/site';
import { PenLine, Eraser, AlertTriangle, CheckCircle2, ExternalLink, ShieldAlert } from 'lucide-react';

/* Map 422 missing carrier fields → the scene that owns them. Mirrors submissionRequirements.js. */
const FIELD_TO_STEP: Record<string, { step: number; label: string }> = {
  legalName: { step: 0, label: 'Business Information' },
  dbaName: { step: 0, label: 'Business Information' },
  address: { step: 0, label: 'Business Information' },
  phone: { step: 0, label: 'Business Information' },
  email: { step: 0, label: 'Business Information' },
  authorityNumber: { step: 1, label: 'Authority & Compliance' },
  dotNumber: { step: 1, label: 'Authority & Compliance' },
  ein: { step: 1, label: 'Authority & Compliance' },
  paymentPreference: { step: 3, label: 'Driver & Fleet Details' },
  factoringCompanyName: { step: 3, label: 'Driver & Fleet Details' },
};
const DOCUMENTS_STEP = 4;

const DOC_LABELS: Record<string, string> = {
  mc_authority_letter: 'MC Authority Letter',
  certificate_of_insurance: 'Certificate of Insurance',
  w9_or_w8bene: 'W-9 / W-8BEN',
  noa: 'Notice of Assignment (NOA)',
};

function fieldError(details: any[] | undefined, path: string): string | undefined {
  if (!Array.isArray(details)) return undefined;
  return details.find((d) => d?.path === path)?.message;
}

/* GAP-011 RESOLVED (2026-08-22) — real 422 envelope captured:
   error.code = 'submission_incomplete'
   error.details = [{ path: 'carrier.<field>' | 'documents.<type>', message }]
   Paths are DOT-JOINED with a prefix → strip 'carrier.' / 'documents.' before routing. */
function parseMissing(e: any): { carrierFields: string[]; documents: string[] } | null {
  const details = Array.isArray(e?.details) ? e.details : [];
  if (details.length === 0) return null;
  const carrierFields: string[] = [];
  const documents: string[] = [];
  for (const item of details) {
    const p: string = typeof item?.path === 'string' ? item.path : '';
    if (p.startsWith('documents.')) documents.push(p.slice('documents.'.length));
    else if (p.startsWith('carrier.')) carrierFields.push(p.slice('carrier.'.length));
  }
  if (carrierFields.length === 0 && documents.length === 0) return null;
  return { carrierFields, documents };
}

export function Scene07Submit() {
  const { state, goToStep, refreshSession, reload } = useOnboarding();
  const lead = state.sessionData?.lead;

  useSceneSave(async () => true);

  const [consent, setConsent] = useState(false);
  const [signerName, setSignerName] = useState(lead?.contactName ?? '');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ signerName?: string; signature?: string; consent?: string }>({});
  const [agreementNote, setAgreementNote] = useState<string | null>(null);
  const [missing, setMissing] = useState<{ carrierFields: string[]; documents: string[] } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [signatureMode, setSignatureMode] = useState<'loading' | 'canvas' | 'docusign'>('loading');
  const [docusignUrl, setDocusignUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    obApi.getSignatureUrl(state.token)
      .then((data: any) => {
        if (cancelled) return;
        const isDocusign = (data?.mode === 'docusign' || data?.method === 'docusign');
        const url = data?.signingUrl ?? data?.url ?? null;
        if (isDocusign && url) { setSignatureMode('docusign'); setDocusignUrl(url); }
        else setSignatureMode('canvas');
      })
      .catch(() => { if (!cancelled) setSignatureMode('canvas'); });
    return () => { cancelled = true; };
  }, [state.token]);

  /* ---- Canvas signature capture (touch-friendly, ≤800px PNG) ---- */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || signatureMode !== 'canvas') return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#1a1d21';
      ctx.fillStyle = '#1a1d21';
    }
  }, [signatureMode]);

  const getPos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const onPointerDown = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    drawing.current = true;
    const pos = getPos(e);
    lastPoint.current = pos;
    const ctx = canvas.getContext('2d');
    if (ctx) { ctx.beginPath(); ctx.arc(pos.x, pos.y, 1, 0, Math.PI * 2); ctx.fill(); }
    setHasSignature(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const pos = getPos(e);
    if (ctx && lastPoint.current) {
      ctx.beginPath();
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    lastPoint.current = pos;
  };
  const onPointerUp = () => { drawing.current = false; lastPoint.current = null; };

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    setHasSignature(false);
  }, []);

  const exportSignature = useCallback((): string | null => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return null;
    const MAX = 800;
    const scale = Math.min(1, MAX / canvas.width);
    const out = document.createElement('canvas');
    out.width = Math.max(1, Math.round(canvas.width * scale));
    out.height = Math.max(1, Math.round(canvas.height * scale));
    const octx = out.getContext('2d');
    if (!octx) return null;
    octx.drawImage(canvas, 0, 0, out.width, out.height);
    return out.toDataURL('image/png');
  }, [hasSignature]);

  /* ---- STEP 2 helper: sign AFTER submit. Retries briefly because the
         agreement dispatch runs async server-side (Integration Ref §12). ---- */
  const signAgreement = async (signatureImage: string): Promise<'signed' | 'already' | 'failed'> => {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await obApi.postCustomSignature(state.token, {
          signerName: signerName.trim(),
          signatureImage,
          consentAccepted: true,
        });
        return 'signed';
      } catch (e: any) {
        if (e?.status === 409 && e?.code === 'agreement_already_signed') return 'already';
        if (e?.code === 'no_active_agreement' && attempt < 3) {
          await new Promise((r) => setTimeout(r, 900)); // async dispatch race — retry
          continue;
        }
        if (e?.status === 400) {
          setFieldErrors({
            signerName: fieldError(e.details, 'signerName'),
            signature: fieldError(e.details, 'signatureImage'),
            consent: fieldError(e.details, 'consentAccepted'),
          });
          return 'failed';
        }
        if (e?.status === 429) { setError('Too many signature attempts — please wait a moment and try again.'); return 'failed'; }
        if (e?.status === 410) { reload(); return 'failed'; }
        return 'failed';
      }
    }
    return 'failed';
  };

  /* ---- v3 SEQUENCE (backend wins over handover §10.3 — DOC-DIFF-2):
         SUBMIT first (creates the agreement) → SIGN → refreshSession. ---- */
  const handleSubmit = async () => {
    setError(null);
    setFieldErrors({});
    setMissing(null);
    setAgreementNote(null);

    const fe: typeof fieldErrors = {};
    if (!signerName.trim()) fe.signerName = 'Enter the signer name.';
    if (signatureMode === 'canvas' && !hasSignature) fe.signature = 'Please sign above.';
    if (!consent) fe.consent = 'You must accept the authorization to submit.';
    if (Object.keys(fe).length) { setFieldErrors(fe); return; }

    const signatureImage = exportSignature();
    if (signatureMode === 'canvas' && !signatureImage) { setFieldErrors({ signature: 'Unable to read the signature — please sign again.' }); return; }

    setSubmitting(true);
    try {
      // STEP 1 — SUBMIT
      let submitted = false;
      try {
        await obApi.submit(state.token);
        submitted = true;
      } catch (e: any) {
        if (e?.status === 422) {
          setMissing(parseMissing(e));
          setError('Your application is incomplete. Resolve the items below, then return here to submit.');
          setSubmitting(false); return;
        } else if (e?.status === 423) {
          submitted = true; // already submitted earlier — recover into signature
          setAgreementNote('Application already submitted — completing your signature.');
        } else if (e?.status === 429) {
          setError('Too many attempts — please wait a moment and try again.');
          setSubmitting(false); return;
        } else if (e?.status === 410) {
          reload(); setSubmitting(false); return;
        } else throw e;
      }

      // STEP 2 — SIGN (agreement now exists; retry handles the async race)
      if (submitted) {
        const outcome = await signAgreement(signatureImage ?? '');
        if (outcome === 'signed') setAgreementNote('Signature recorded. Your application is submitted.');
        else if (outcome === 'already') setAgreementNote('Agreement already signed — proceeding.');
        // 'failed' → still submitted; refreshSession below shows the true state
      }

      // STEP 3 — response-shape-agnostic refetch (D11) → AlreadySubmittedState
      await refreshSession();
    } catch (e: any) {
      setError(e?.message ?? 'Submission failed — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minWidth: 0 }}>
      <div className="flex items-start gap-3 mb-4" data-text>
        <PenLine size={20} strokeWidth={1.25} className="text-brass-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-[15px] font-semibold text-ivory-50">Authorization & Signature</h3>
          <p className="text-[12px] text-steel-400">
            Read the authorization below, then sign. This is the point of no return — after submission your application is locked for review.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2.5 border border-brass-500/40 rounded-[6px] px-3 py-2 bg-brass-500/5 mb-4">
        <AlertTriangle size={14} className="text-brass-400 shrink-0 mt-0.5" />
        <p className="text-[12px] leading-relaxed text-brass-300">
          Final legal copy pending — the consent language shown is a placeholder and must be replaced with approved copy before production launch.
        </p>
      </div>

      <div className="rounded-[8px] border border-steel-700/30 bg-ink-900/50 px-4 py-4 mb-5">
        <h5 className="text-[14px] font-semibold text-ivory-50">{LEGAL_TEXT.agreementTitle}</h5>
        <p className="mt-2 text-[12px] leading-relaxed text-steel-300 whitespace-pre-line">{LEGAL_TEXT.agreementBody}</p>
      </div>

      <div className="mb-4">
        <label htmlFor="signer-name" className="block mb-1.5 text-[12px] text-steel-300">
          Signer Name <span className="text-red-400 ml-1">*</span>
        </label>
        <input
          id="signer-name"
          value={signerName}
          onChange={(e) => setSignerName(e.target.value)}
          placeholder="Full legal name"
          disabled={submitting}
          className={`h-10 w-full bg-ink-900 border rounded-[6px] px-3.5 text-[13px] text-ivory-50 placeholder:text-steel-600 focus:outline-none focus:border-brass-500/70 transition-colors ${fieldErrors.signerName ? 'border-red-500/50' : 'border-steel-700/30'}`}
        />
        {fieldErrors.signerName && <p className="mt-1 text-[11px] text-red-400">{fieldErrors.signerName}</p>}
      </div>

      {signatureMode === 'loading' && (
        <div className="rounded-[8px] border border-steel-700/30 bg-ink-900/30 h-40 grid place-items-center">
          <p className="text-[12px] text-steel-400">Preparing signature pad…</p>
        </div>
      )}

      {signatureMode === 'docusign' && docusignUrl && (
        <div className="rounded-[8px] border border-steel-700/30 bg-ink-900/50 px-4 py-5 text-center">
          <p className="text-[13px] text-ivory-100">You'll sign electronically via our e-signature provider.</p>
          <a href={docusignUrl} target="_blank" rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 h-10 px-6 rounded-[7px] bg-brass-500 hover:bg-brass-400 text-ink-950 text-[13px] font-semibold transition-colors">
            Open Signing Page <ExternalLink size={14} />
          </a>
        </div>
      )}

      {signatureMode === 'canvas' && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[12px] text-steel-300">Signature <span className="text-red-400 ml-1">*</span></label>
            <button type="button" onClick={clearSignature} disabled={submitting}
              className="flex items-center gap-1.5 text-[12px] text-steel-400 hover:text-brass-300 transition-colors disabled:opacity-50">
              <Eraser size={13} /> Clear
            </button>
          </div>
          <canvas
            ref={canvasRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            style={{ touchAction: 'none', width: '100%', height: 160, background: '#f4f1ea', cursor: 'crosshair' }}
            className={`rounded-[8px] border ${fieldErrors.signature ? 'border-red-500/50' : 'border-steel-700/30'}`}
            aria-label="Signature pad"
          />
          <p className="mt-1 text-[11px] text-steel-500">Sign above using your mouse or finger.</p>
          {fieldErrors.signature && <p className="mt-1 text-[11px] text-red-400">{fieldErrors.signature}</p>}
        </div>
      )}

      <div className="mb-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            disabled={submitting}
            className="mt-0.5 h-4 w-4 shrink-0 rounded-[2px] border border-steel-700/40 accent-brass-500"
          />
          <span className="text-[12px] leading-relaxed text-steel-300">{LEGAL_TEXT.consentCheckboxLabel}</span>
        </label>
        {fieldErrors.consent && <p className="mt-1 text-[11px] text-red-400">{fieldErrors.consent}</p>}
      </div>

      {agreementNote && (
        <div className="flex items-center gap-2 mb-3 text-[12px] text-status-live">
          <CheckCircle2 size={14} /> {agreementNote}
        </div>
      )}

      {/* 422 missing list with nav links (paths prefix-stripped) */}
      {missing && (
        <div className="rounded-[8px] border border-brass-500/40 bg-brass-500/5 px-4 py-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert size={14} className="text-brass-400" />
            <h4 className="text-[13px] font-semibold text-brass-300">Missing before submission</h4>
          </div>
          <div className="space-y-1.5">
            {missing.carrierFields.map((f) => {
              const t = FIELD_TO_STEP[f] ?? { step: 0, label: 'Business Information' };
              return (
                <button key={f} type="button" onClick={() => goToStep(t.step)}
                  className="block text-left text-[12px] text-brass-300 underline decoration-brass-500/40 hover:text-brass-200">
                  {f} → {t.label}
                </button>
              );
            })}
            {missing.documents.map((doc) => (
              <button key={doc} type="button" onClick={() => goToStep(DOCUMENTS_STEP)}
                className="block text-left text-[12px] text-brass-300 underline decoration-brass-500/40 hover:text-brass-200">
                {DOC_LABELS[doc] ?? doc} → Documents Upload
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mb-4 text-[12px] text-red-400" role="alert">{error}</p>}

      <div className="flex items-center gap-4">
        <button type="button" onClick={handleSubmit} disabled={submitting || signatureMode === 'loading'}
          className="group flex items-center gap-3 h-11 px-8 rounded-[7px] bg-brass-500 hover:bg-brass-400 text-ink-950 text-[13px] font-display font-semibold uppercase tracking-[0.06em] shadow-[0_16px_36px_rgba(0,0,0,0.18)] transition-colors disabled:opacity-60">
          {submitting ? 'Submitting…' : 'Sign & Submit Application'}
        </button>
        <span className="text-[11px] text-steel-500 max-w-[260px]">
          Submitting locks this application for compliance review. You'll receive confirmation by email.
        </span>
      </div>
    </div>
  );
}