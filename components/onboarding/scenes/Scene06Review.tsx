/* ============ Scene06Review v1 ============ */
'use client';
import { useEffect, useState } from 'react';
import { useOnboarding, useSceneSave } from '@/lib/onboarding/context';
import { obApi } from '@/lib/onboarding/api';
import { LEGAL_TEXT } from '@/config/site';
import { ClipboardCheck, Pencil, FileText, AlertTriangle } from 'lucide-react';

type ReviewChip = { label: string; cls: string };

/* Chip colors mirror §8.9 guidance + DocumentUploadCard palette:
   accepted=green(status-live) · pending=brass · rejected=red */
function reviewChip(status?: string): ReviewChip {
  if (status === 'accepted') return { label: 'ACCEPTED', cls: 'text-status-live border-status-live/40 bg-status-live/5' };
  if (status === 'rejected') return { label: 'REJECTED', cls: 'text-red-400 border-red-500/40 bg-red-500/5' };
  if (status === 'pending') return { label: 'PENDING REVIEW', cls: 'text-brass-300 border-brass-500/40 bg-brass-500/5' };
  return { label: 'NOT UPLOADED', cls: 'text-steel-400 border-steel-700/40 bg-ink-900/30' };
}

/* Read-only field groups mirroring GET /session carrier shape (sections 1 & 2).
   editStep = registry index to return to. */
const GROUPS: { title: string; editStep: number; fields: { key: string; label: string }[] }[] = [
  {
    title: 'Business Information',
    editStep: 0,
    fields: [
      { key: 'legalName', label: 'Legal Name' },
      { key: 'dbaName', label: 'DBA Name' },
      { key: 'address', label: 'Address' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
    ],
  },
  {
    title: 'Authority & Compliance',
    editStep: 1,
    fields: [
      { key: 'authorityNumber', label: 'MC / Authority Number' },
      { key: 'dotNumber', label: 'USDOT Number' },
      { key: 'ein', label: 'EIN / Tax ID' },
    ],
  },
  {
    title: 'Payment Details',
    editStep: 3,
    fields: [
      { key: 'paymentPreference', label: 'Payment Preference' },
      { key: 'factoringCompanyName', label: 'Factoring Company' },
    ],
  },
];

const DOC_LABELS: Record<string, string> = {
  mc_authority_letter: 'MC Authority Letter',
  certificate_of_insurance: 'Certificate of Insurance',
  w9_or_w8bene: 'W-9 / W-8BEN',
  noa: 'Notice of Assignment (NOA)',
};

export function Scene06Review() {
  const { state, goToStep } = useOnboarding();
  const d = state.sessionData?.carrier || {};
  const docs = state.sessionData?.carrier?.documents ?? [];

  /* NOA visibility rule mirrors submissionRequirements.js (Decision 7) */
  const requiresNoa =
    d.paymentPreference === 'Freight Factoring' ||
    !!((d.factoringCompanyName ?? '') as string).trim();

  /* Scene 06 makes NO write calls (§10.2). Register a no-op save so
     Save & Continue can proceed to Scene 07 without a PATCH. */
  useSceneSave(async () => true);

  const [agreement, setAgreement] = useState<any | null>(null);
  const [agreementError, setAgreementError] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setAgreementError(false);
    obApi.getAgreement(state.token)
      .then((data) => { if (!cancelled) setAgreement(data); })
      .catch(() => { if (!cancelled) { setAgreement(null); setAgreementError(true); } });
    return () => { cancelled = true; };
  }, [state.token]);

  const legalText = agreement?.legalText ?? {};
  const title = legalText.agreementTitle ?? LEGAL_TEXT.agreementTitle;
  /* GAP-009: body field name unconfirmed in Postman — render defensively */
  const body = legalText.agreementBody ?? legalText.body ?? null;

  return (
    <div style={{ minWidth: 0 }}>
      <div className="flex items-start gap-3 mb-4" data-text>
        <ClipboardCheck size={20} strokeWidth={1.25} className="text-brass-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-[15px] font-semibold text-ivory-50">Review & Agreement</h3>
          <p className="text-[12px] text-steel-400">
            Confirm every detail below is accurate before proceeding to authorization. After submission your application is locked for review.
          </p>
        </div>
      </div>

      {/* Carrier field summary */}
      <div className="space-y-4">
        {GROUPS.map((group) => (
          <div key={group.title} className="rounded-[8px] border border-steel-700/30 bg-ink-900/50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-steel-700/25">
              <h4 className="text-[12px] font-semibold text-ivory-100 uppercase tracking-[0.08em]">{group.title}</h4>
              <button type="button" onClick={() => goToStep(group.editStep)}
                className="flex items-center gap-1.5 text-[12px] text-brass-400 hover:text-brass-300 transition-colors">
                <Pencil size={12} /> Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 px-4 py-3">
              {group.fields.map((f) => (
                <div key={f.key}>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-steel-500">{f.label}</p>
                  <p className="text-[13px] text-ivory-50 mt-0.5">
                    {((d as any)[f.key] ?? '') === ''
                      ? <span className="text-steel-600 italic">Not provided</span>
                      : (d as any)[f.key]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Documents summary */}
        <div className="rounded-[8px] border border-steel-700/30 bg-ink-900/50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-steel-700/25">
            <h4 className="text-[12px] font-semibold text-ivory-100 uppercase tracking-[0.08em]">Documents</h4>
            <button type="button" onClick={() => goToStep(4)}
              className="flex items-center gap-1.5 text-[12px] text-brass-400 hover:text-brass-300 transition-colors">
              <Pencil size={12} /> Edit
            </button>
          </div>
          <div className="px-4 py-3 space-y-2.5">
            {Object.entries(DOC_LABELS).map(([type, label]) => {
              const doc = docs.find((x) => x.documentType === type);
              /* Hide NOA row only when it is neither uploaded nor required */
              if (!doc && type === 'noa' && !requiresNoa) return null;
              const chip = reviewChip(doc?.reviewStatus);
              return (
                <div key={type} className="flex items-center gap-3 flex-wrap">
                  <FileText size={15} className="text-steel-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-ivory-100">{label}</p>
                    {doc?.fileName && <p className="text-[11px] font-tech text-steel-500 truncate">{doc.fileName}</p>}
                  </div>
                  <span className={`text-[10px] font-tech uppercase tracking-wider border rounded-[5px] px-2 py-1 ${chip.cls}`}>{chip.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Agreement preview (B9: final legal copy pending banner) */}
      <div className="mt-5">
        <div className="flex items-start gap-2.5 border border-brass-500/40 rounded-[6px] px-3 py-2 bg-brass-500/5 mb-3">
          <AlertTriangle size={14} className="text-brass-400 shrink-0 mt-0.5" />
          <p className="text-[12px] leading-relaxed text-brass-300">
            Final legal copy pending — the text shown below is a placeholder and must be replaced with approved legal copy before production launch.
          </p>
        </div>
        <div className="rounded-[8px] border border-steel-700/30 bg-ink-900/50 px-4 py-4">
          {agreementError ? (
            <p className="text-[13px] text-steel-400">
              Unable to load the agreement preview. This does not block your review — the agreement will be presented again at the authorization step.
            </p>
          ) : (
            <>
              <h5 className="text-[14px] font-semibold text-ivory-50">{title}</h5>
              <p className="mt-2 text-[12px] leading-relaxed text-steel-300 whitespace-pre-line">
                {body ?? LEGAL_TEXT.agreementBody}
              </p>
            </>
          )}
        </div>
      </div>

      <p className="mt-5 text-[12px] leading-relaxed text-steel-400">
        If anything is incorrect, use the Edit links above to return to the relevant section. Your progress is preserved.
      </p>
    </div>
  );
}