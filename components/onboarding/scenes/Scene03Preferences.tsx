/* ============ Scene03Preferences v5 ============ */
'use client';
import { useOnboarding, useSceneSave } from '@/lib/onboarding/context';
import { FormField } from '../ui/FormField';
import { InfoPanel } from '../InfoPanel';
import { MapPin } from 'lucide-react';

const isTrue = (v: any) => v === true || v === 'true';

export function Scene03Preferences() {
  const { state, updateField, saveSection } = useOnboarding();
  const d = state.sessionData?.carrier || {};

  const save = async () => saveSection(3, {
    preferredOrigins: d.preferredOrigins ?? undefined,
    preferredDestinations: d.preferredDestinations ?? undefined,
    minRatePerMile: d.minRatePerMile ? Number(d.minRatePerMile) : undefined,
    prohibitedLocations: d.prohibitedLocations ?? undefined,
    comfortableWithLayovers: isTrue(d.comfortableWithLayovers),
  });
  useSceneSave(save);

  return (
    <div className="rounded-lg border border-steel-700/30 bg-ink-900/50 p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-steel-700/20">
        <div className="p-2 rounded bg-brass-500/10"><MapPin size={18} className="text-brass-400" /></div>
        <div>
          <h4 className="text-[18px] font-semibold text-ivory-50">Lane & Rate Preferences</h4>
          <p className="text-[12px] text-steel-400 mt-1">Share your preferred lanes, minimum rates, and operational preferences.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="ob-grid-2">
            <FormField label="Preferred Origin Regions / Hubs" value={d.preferredOrigins ?? ''} onChange={(e) => updateField('preferredOrigins', e.target.value)} placeholder="e.g. TX, CA, Midwest" />
            <FormField label="Preferred Destination Regions" value={d.preferredDestinations ?? ''} onChange={(e) => updateField('preferredDestinations', e.target.value)} placeholder="e.g. Nationwide, East Coast" />
            <FormField label="Minimum Target Rate Per Mile ($)" type="number" step="0.01" value={d.minRatePerMile ?? ''} onChange={(e) => updateField('minRatePerMile', e.target.value)} placeholder="e.g. 2.50" />
            <FormField label="Prohibited States / Cities" value={d.prohibitedLocations ?? ''} onChange={(e) => updateField('prohibitedLocations', e.target.value)} placeholder="e.g. NYC, certain states" />
            <div className="flex items-center gap-2 mt-2 col-span-2">
              <input type="checkbox" id="layovers" checked={isTrue(d.comfortableWithLayovers)} onChange={(e) => updateField('comfortableWithLayovers', e.target.checked ? 'true' : 'false')} className="h-4 w-4 accent-brass-500" />
              <label htmlFor="layovers" className="text-[13px] text-ivory-50">Drivers comfortable with layovers / overnight stays</label>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <InfoPanel whyBody="This information helps us dispatch loads that fit your preferred lanes and rate expectations." />
        </div>
      </div>
    </div>
  );
}