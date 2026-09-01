/* ============ Scene05Directory v5 ============ */
'use client';
import { useOnboarding, useSceneSave } from '@/lib/onboarding/context';
import { FormField } from '../ui/FormField';
import { InfoPanel } from '../InfoPanel';
import { Users } from 'lucide-react';

export function Scene05Directory() {
  const { state, updateField, saveSection } = useOnboarding();
  const d = state.sessionData?.carrier || {};

  const save = async () => saveSection(5, {
    dispatchContactName: d.dispatchContactName ?? undefined,
    dispatchPhone: d.dispatchPhone ?? undefined,
    dispatchEmail: d.dispatchEmail ?? undefined,
    afterHoursCell: d.afterHoursCell ?? undefined,
    accountingEmail: d.accountingEmail ?? undefined,
  });
  useSceneSave(save);

  return (
    <div className="rounded-lg border border-steel-700/30 bg-ink-900/50 p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-steel-700/20">
        <div className="p-2 rounded bg-brass-500/10"><Users size={18} className="text-brass-400" /></div>
        <div>
          <h4 className="text-[18px] font-semibold text-ivory-50">Contact Information</h4>
          <p className="text-[12px] text-steel-400 mt-1">Provide dispatch and accounting contact information for our directory.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="ob-grid-2">
            <FormField label="Primary Dispatch Contact Name" required value={d.dispatchContactName ?? ''} onChange={(e) => updateField('dispatchContactName', e.target.value)} placeholder="Full name" />
            <FormField label="Dispatch Phone Number" required value={d.dispatchPhone ?? ''} onChange={(e) => updateField('dispatchPhone', e.target.value)} placeholder="555-0100" />
            <FormField label="Dispatch Email" required value={d.dispatchEmail ?? ''} onChange={(e) => updateField('dispatchEmail', e.target.value)} placeholder="dispatch@company.com" />
            <FormField label="After-Hours / Emergency Cell" value={d.afterHoursCell ?? ''} onChange={(e) => updateField('afterHoursCell', e.target.value)} placeholder="555-0101" />
            <FormField label="Accounting / Invoice Email" value={d.accountingEmail ?? ''} onChange={(e) => updateField('accountingEmail', e.target.value)} placeholder="accounting@company.com" />
          </div>
        </div>
        <div className="lg:col-span-1">
          <InfoPanel whyBody="This information ensures our dispatch and accounting teams can reach the right people at the right time." />
        </div>
      </div>
    </div>
  );
}