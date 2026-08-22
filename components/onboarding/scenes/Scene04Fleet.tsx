/* ============ Scene04Fleet v2 ============ */
'use client';
import { useState } from 'react';
import { useOnboarding, useSceneSave } from '@/lib/onboarding/context';
import { SelectField } from '../ui/SelectField';
import { FormField } from '../ui/FormField';
import { Truck, Lock } from 'lucide-react';

/* S11 FIX: backend Zod = z.string().optional() → REJECTS null (400).
   Coerce null → undefined so JSON.stringify omits the key. Keep '' so user clears persist. */
const PAYMENT_OPTIONS = [
  { value: 'Direct Deposit', label: 'Direct Deposit' },
  { value: 'QuickPay', label: 'QuickPay' },
  { value: 'Net-30', label: 'Net-30' },
  { value: 'Freight Factoring', label: 'Freight Factoring' },
];

export function Scene04Fleet() {
  const { state, updateField, saveSection } = useOnboarding();
  const d = state.sessionData?.carrier || {};
  const [payError, setPayError] = useState<string | null>(null);
  const requiresNoa =
    d.paymentPreference === 'Freight Factoring' ||
    !!((d.factoringCompanyName ?? '') as string).trim();

  const save = async () => {
    if (!((d.paymentPreference ?? '') as string).trim()) {
      setPayError('Select how you want to be paid — this is required for submission.');
      return false;
    }
    setPayError(null);
    const ok = await saveSection(2, {
      paymentPreference: d.paymentPreference ?? undefined,
      factoringCompanyName: d.factoringCompanyName ?? undefined,
    });
    if (!ok) return false;
    return saveSection(5, {});
  };
  useSceneSave(save);

  return (
    <div style={{ minWidth: 0 }}>
      <div className="flex items-start gap-3 mb-4" data-text>
        <Truck size={20} strokeWidth={1.25} className="text-brass-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-[15px] font-semibold text-ivory-50">Driver & Fleet Details</h3>
          <p className="text-[12px] text-steel-400">Fleet and equipment details are confirmed with compliance during review. Payment setup is required now.</p>
        </div>
      </div>

      <div className="ob-grid-2">
        <SelectField
          label="Payment Preference"
          required
          options={PAYMENT_OPTIONS}
          placeholder="Select payment preference"
          value={d.paymentPreference ?? ''}
          error={payError ?? undefined}
          onChange={(e) => updateField('paymentPreference', e.target.value)}
        />
        {d.paymentPreference === 'Freight Factoring' && (
          <FormField
            label="Factoring Company"
            value={d.factoringCompanyName ?? ''}
            onChange={(e) => updateField('factoringCompanyName', e.target.value)}
            placeholder="Factoring company name"
          />
        )}
      </div>

      {requiresNoa && (
        <div className="mt-4 flex items-start gap-2.5 border border-brass-500/30 rounded-[6px] px-3 py-2 bg-brass-500/5">
          <Lock size={13} className="text-brass-400 shrink-0 mt-0.5" />
          <p className="text-[12px] leading-relaxed text-brass-300">
            Because factoring applies to your operation, a Notice of Assignment (NOA) will be required in Documents Upload.
          </p>
        </div>
      )}
    </div>
  );
}