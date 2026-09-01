/* ============ Scene01Company v14 ============ */
'use client';
import { useOnboarding, useSceneSave } from '@/lib/onboarding/context';
import { FormField } from '../ui/FormField';
import { InfoPanel } from '../InfoPanel';
import { Building2 } from 'lucide-react';

export function Scene01Company() {
  const { state, updateField, saveSection } = useOnboarding();
  const d = state.sessionData?.carrier || {};

  const save = async () => saveSection(1, {
    legalName: d.legalName ?? undefined, dbaName: d.dbaName ?? undefined,
    authorityNumber: d.authorityNumber ?? undefined, dotNumber: d.dotNumber ?? undefined,
    ein: d.ein ?? undefined, address: d.address ?? undefined,
    phone: d.phone ?? undefined, email: d.email ?? undefined,
  });
  useSceneSave(save);

  return (
    <div className="rounded-lg border border-steel-700/30 bg-ink-900/50 p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-steel-700/20">
        <div className="p-2 rounded bg-brass-500/10"><Building2 size={18} className="text-brass-400" /></div>
        <div>
          <h4 className="text-[18px] font-semibold text-ivory-50">Company Details</h4>
          <p className="text-[12px] text-steel-400 mt-1">Provide your legal business information as it appears on official documents.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="ob-grid-2">
            <FormField label="Legal Business Name" required value={d.legalName ?? ''} onChange={(e) => updateField('legalName', e.target.value)} placeholder="Enter legal business name" />
            <FormField label="USDOT Number" required value={d.dotNumber ?? ''} onChange={(e) => updateField('dotNumber', e.target.value)} placeholder="e.g. 1234567" />
            <FormField label="Doing Business As (DBA)" value={d.dbaName ?? ''} onChange={(e) => updateField('dbaName', e.target.value)} placeholder="Enter DBA name (if applicable)" />
            <FormField label="MC Number" value={d.authorityNumber ?? ''} onChange={(e) => updateField('authorityNumber', e.target.value)} placeholder="e.g. MC-123456" />
            <FormField label="EIN / Tax ID" required value={d.ein ?? ''} onChange={(e) => updateField('ein', e.target.value)} placeholder="e.g. 12-3456789" />
            <FormField label="Primary Phone" required value={d.phone ?? ''} onChange={(e) => updateField('phone', e.target.value)} placeholder="555-0100" />
            <FormField label="Contact Email" required value={d.email ?? ''} onChange={(e) => updateField('email', e.target.value)} placeholder="name@company.com" />
            <FormField label="Physical Address" required value={d.address ?? ''} onChange={(e) => updateField('address', e.target.value)} placeholder="Street, city, state, ZIP" />
          </div>
        </div>
        <div className="lg:col-span-1">
          <InfoPanel whyBody="This information helps us verify your business, create your carrier profile, and ensure compliance with FMCSA requirements." />
        </div>
      </div>
    </div>
  );
}