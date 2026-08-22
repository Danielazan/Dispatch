/* ============ Scene01Company v2 ============ */
'use client';
import { useOnboarding, useSceneSave } from '@/lib/onboarding/context';
import { FormField } from '../ui/FormField';
import { Building2 } from 'lucide-react';

/* S11 FIX: coerce null → undefined before PATCH (Zod rejects null). */
export function Scene01Company() {
  const { state, updateField, saveSection } = useOnboarding();
  const d = state.sessionData?.carrier || {};

  const save = async () =>
    saveSection(1, {
      legalName: d.legalName ?? undefined,
      dbaName: d.dbaName ?? undefined,
      authorityNumber: d.authorityNumber ?? undefined,
      dotNumber: d.dotNumber ?? undefined,
      ein: d.ein ?? undefined,
      address: d.address ?? undefined,
      phone: d.phone ?? undefined,
      email: d.email ?? undefined,
    });
  useSceneSave(save);

  return (
    <div style={{ minWidth: 0 }}>
      <div className="flex items-start gap-3 mb-4" data-text>
        <Building2 size={20} strokeWidth={1.25} className="text-brass-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-[15px] font-semibold text-ivory-50">Company Details</h3>
          <p className="text-[12px] text-steel-400">Provide your legal business information as it appears on official documents.</p>
        </div>
      </div>

      <div className="ob-grid-2">
        <FormField label="Legal Business Name" required value={d.legalName ?? ''} onChange={(e) => updateField('legalName', e.target.value)} placeholder="Enter legal business name" />
        <FormField label="USDOT Number" required value={d.dotNumber ?? ''} onChange={(e) => updateField('dotNumber', e.target.value)} placeholder="Enter USDOT number" />
        <FormField label="Doing Business As (DBA)" value={d.dbaName ?? ''} onChange={(e) => updateField('dbaName', e.target.value)} placeholder="Enter DBA name (if applicable)" />
        <FormField label="MC Number" value={d.authorityNumber ?? ''} onChange={(e) => updateField('authorityNumber', e.target.value)} placeholder="Enter MC number (if applicable)" />
        <FormField label="EIN / Tax ID" required value={d.ein ?? ''} onChange={(e) => updateField('ein', e.target.value)} placeholder="Enter EIN or Tax ID" />
        <FormField label="Primary Phone" required value={d.phone ?? ''} onChange={(e) => updateField('phone', e.target.value)} placeholder="555-0100" />
        <FormField label="Contact Email" required value={d.email ?? ''} onChange={(e) => updateField('email', e.target.value)} placeholder="name@company.com" />
        <FormField label="Physical Address" required value={d.address ?? ''} onChange={(e) => updateField('address', e.target.value)} placeholder="Street, city, state, ZIP" />
      </div>
    </div>
  );
}