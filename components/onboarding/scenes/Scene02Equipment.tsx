/* ============ Scene02Equipment v5 ============ */
'use client';
import { useOnboarding, useSceneSave } from '@/lib/onboarding/context';
import { FormField } from '../ui/FormField';
import { SelectField } from '../ui/SelectField';
import { InfoPanel } from '../InfoPanel';
import { Truck } from 'lucide-react';

const TRUCK_TYPES = [
  { value: 'Sleeper Cab', label: 'Sleeper Cab' },
  { value: 'Day Cab', label: 'Day Cab' },
];
const isTrue = (v: any) => v === true || v === 'true';

export function Scene02Equipment() {
  const { state, updateField, saveSection } = useOnboarding();
  const d = state.sessionData?.carrier || {};

  const save = async () => saveSection(2, {
    activeTrucksCount: d.activeTrucksCount ? Number(d.activeTrucksCount) : undefined,
    truckType: d.truckType ?? undefined,
    trailerConfig: d.trailerConfig ?? undefined,
    maxFreightWeight: d.maxFreightWeight ?? undefined,
    carriesTarps: isTrue(d.carriesTarps),
    tarpSize: d.tarpSize ?? undefined,
    strapCount: d.strapCount ? Number(d.strapCount) : undefined,
    chainBinderCount: d.chainBinderCount ? Number(d.chainBinderCount) : undefined,
    hasFastCard: isTrue(d.hasFastCard),
    hasTwicCard: isTrue(d.hasTwicCard),
  });
  useSceneSave(save);

  return (
    <div className="rounded-lg border border-steel-700/30 bg-ink-900/50 p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-steel-700/20">
        <div className="p-2 rounded bg-brass-500/10"><Truck size={18} className="text-brass-400" /></div>
        <div>
          <h4 className="text-[18px] font-semibold text-ivory-50">Fleet & Equipment</h4>
          <p className="text-[12px] text-steel-400 mt-1">Tell us about your active trucks, trailer configurations, and equipment certifications.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="ob-grid-2">
            <FormField label="Active Trucks Count" type="number" value={d.activeTrucksCount ?? ''} onChange={(e) => updateField('activeTrucksCount', e.target.value)} placeholder="e.g. 5" />
            <SelectField label="Truck Type" options={TRUCK_TYPES} value={d.truckType ?? ''} onChange={(e) => updateField('truckType', e.target.value)} placeholder="Select truck type" />
            <FormField label="Trailer Configurations" value={d.trailerConfig ?? ''} onChange={(e) => updateField('trailerConfig', e.target.value)} placeholder="e.g. Dry Van, Reefer, Flatbed" />
            <FormField label="Max Freight Weight" value={d.maxFreightWeight ?? ''} onChange={(e) => updateField('maxFreightWeight', e.target.value)} placeholder="e.g. 80,000 lbs" />
            <FormField label="Strap Count" type="number" value={d.strapCount ?? ''} onChange={(e) => updateField('strapCount', e.target.value)} placeholder="e.g. 10" />
            <FormField label="Chain/Binder Count" type="number" value={d.chainBinderCount ?? ''} onChange={(e) => updateField('chainBinderCount', e.target.value)} placeholder="e.g. 4" />
            {isTrue(d.carriesTarps) && (
              <FormField label="Tarp Size" value={d.tarpSize ?? ''} onChange={(e) => updateField('tarpSize', e.target.value)} placeholder="e.g. 4ft or 8ft" />
            )}
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="tarps" checked={isTrue(d.carriesTarps)} onChange={(e) => updateField('carriesTarps', e.target.checked ? 'true' : 'false')} className="h-4 w-4 accent-brass-500" />
              <label htmlFor="tarps" className="text-[13px] text-ivory-50">Carries Tarps</label>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="fast" checked={isTrue(d.hasFastCard)} onChange={(e) => updateField('hasFastCard', e.target.checked ? 'true' : 'false')} className="h-4 w-4 accent-brass-500" />
              <label htmlFor="fast" className="text-[13px] text-ivory-50">Has FAST Card</label>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="twic" checked={isTrue(d.hasTwicCard)} onChange={(e) => updateField('hasTwicCard', e.target.checked ? 'true' : 'false')} className="h-4 w-4 accent-brass-500" />
              <label htmlFor="twic" className="text-[13px] text-ivory-50">Has TWIC Card</label>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <InfoPanel whyBody="This information helps us match your equipment to the right loads and ensure compliance with weight and safety regulations." />
        </div>
      </div>
    </div>
  );
}