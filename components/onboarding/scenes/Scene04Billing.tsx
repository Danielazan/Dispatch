/* ============ Scene04Billing v5 - includes factoringNoaEmail ============ */
'use client';
import { useState } from 'react';
import { useOnboarding, useSceneSave } from '@/lib/onboarding/context';
import { SelectField } from '../ui/SelectField';
import { FormField } from '../ui/FormField';
import { InfoPanel } from '../InfoPanel';
import { CreditCard, Lock } from 'lucide-react';

const PAYMENT_OPTIONS = [
  { value: 'Freight Factoring', label: 'Freight Factoring Company' },
  { value: 'QuickPay', label: 'QuickPay (1-3 Days)' },
  { value: 'Net-30', label: 'Standard Net-30 Terms' },
  { value: 'Direct Deposit', label: 'Direct Deposit' },
];

export function Scene04Billing() {
  const { state, updateField, saveSection } = useOnboarding();
  const d = state.sessionData?.carrier || {};
  const [payError, setPayError] = useState<string | null>(null);
  const requiresNoa = d.paymentPreference === 'Freight Factoring' || !!((d.factoringCompanyName ?? '') as string).trim();

  const save = async () => {
    if (!((d.paymentPreference ?? '') as string).trim()) {
      setPayError('Select how you want to be paid — this is required for submission.');
      return false;
    }
    setPayError(null);
    return saveSection(4, {
      paymentPreference: d.paymentPreference ?? undefined,
      factoringCompanyName: d.factoringCompanyName ?? undefined,
      factoringNoaEmail: d.factoringNoaEmail ?? undefined,
    });
  };
  useSceneSave(save);

  return (
    <div className="rounded-lg border border-steel-700/30 bg-ink-900/50 p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-steel-700/20">
        <div className="p-2 rounded bg-brass-500/10"><CreditCard size={18} className="text-brass-400" /></div>
        <div>
          <h4 className="text-[18px] font-semibold text-ivory-50">Payment Setup</h4>
          <p className="text-[12px] text-steel-400 mt-1">How do you prefer to collect invoice pay from shippers / brokers?</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="ob-grid-2">
            <SelectField label="Payment Preference" required options={PAYMENT_OPTIONS} placeholder="Select payment preference" value={d.paymentPreference ?? ''} error={payError ?? undefined} onChange={(e) => updateField('paymentPreference', e.target.value)} />
            {requiresNoa && (
              <FormField label="Factoring Company Name" value={d.factoringCompanyName ?? ''} onChange={(e) => updateField('factoringCompanyName', e.target.value)} placeholder="Factoring company name" />
            )}
            {requiresNoa && (
              <FormField label="Factoring NOA Contact Email" value={d.factoringNoaEmail ?? ''} onChange={(e) => updateField('factoringNoaEmail', e.target.value)} placeholder="noa@factoring.com" />
            )}
          </div>
          {requiresNoa && (
            <div className="mt-4 flex items-start gap-2.5 border border-brass-500/30 rounded-[6px] px-3 py-2 bg-brass-500/5">
              <Lock size={13} className="text-brass-400 shrink-0 mt-0.5" />
              <p className="text-[12px] leading-relaxed text-brass-300">Because factoring applies, a Notice of Assignment (NOA) will be required in Documents Upload.</p>
            </div>
          )}
        </div>
        <div className="lg:col-span-1">
          <InfoPanel whyBody="This information determines how you get paid and whether a Notice of Assignment is required." />
        </div>
      </div>
    </div>
  );
}