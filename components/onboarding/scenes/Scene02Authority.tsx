/* ============ Scene02Authority v2 ============ */
'use client';
import { useOnboarding, useSceneSave } from '@/lib/onboarding/context';
import { FormField } from '../ui/FormField';
import { ShieldCheck } from 'lucide-react';

/* S11 FIX: coerce null → undefined before PATCH (Zod rejects null). */
export function Scene02Authority() {
  const { state, updateField, saveSection } = useOnboarding();
  const d = state.sessionData?.carrier || {};
  const missing = (['authorityNumber', 'dotNumber', 'ein'] as const).filter(
    (k) => !((d[k] ?? '') as string).trim()
  );

  const save = async () => {
    const ok = await saveSection(1, {
      authorityNumber: d.authorityNumber ?? undefined,
      dotNumber: d.dotNumber ?? undefined,
      ein: d.ein ?? undefined,
    });
    if (!ok) return false;
    return saveSection(3, {});
  };
  useSceneSave(save);

  return (
    <div style={{ minWidth: 0 }}>
      <div className="flex items-start gap-3 mb-4" data-text>
        <ShieldCheck size={20} strokeWidth={1.25} className="text-brass-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-[15px] font-semibold text-ivory-50">Operating Authority</h3>
          <p className="text-[12px] text-steel-400">Confirm the numbers compliance will verify against FMCSA records.</p>
        </div>
      </div>

      <div className="ob-grid-2">
        <FormField label="MC / Authority Number" required value={d.authorityNumber ?? ''} onChange={(e) => updateField('authorityNumber', e.target.value)} placeholder="e.g. MC-123456" />
        <FormField label="USDOT Number" required value={d.dotNumber ?? ''} onChange={(e) => updateField('dotNumber', e.target.value)} placeholder="e.g. 1234567" />
        <FormField label="EIN / Tax ID" required value={d.ein ?? ''} onChange={(e) => updateField('ein', e.target.value)} placeholder="e.g. 12-3456789" />
      </div>

      {missing.length > 0 && (
        <p className="mt-4 text-[12px] text-brass-300 border border-brass-500/30 rounded-[6px] px-3 py-2 bg-brass-500/5">
          You can continue, but {missing.length === 1 ? 'this field is' : 'these fields are'} required before final submission.
        </p>
      )}

      <p className="mt-4 text-[12px] leading-relaxed text-steel-400">
        After submission, authority numbers enter verification. Most reviews currently start in the manual queue — this is normal and does not delay your submission.
      </p>
    </div>
  );
}