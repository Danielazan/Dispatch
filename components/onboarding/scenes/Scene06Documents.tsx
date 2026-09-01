/* ============ Scene06Documents v5 ============ */
'use client';
import { useOnboarding, useSceneSave } from '@/lib/onboarding/context';
import { DocumentUploadCard } from '../ui/DocumentUploadCard';
import { InfoPanel } from '../InfoPanel';
import { FileText } from 'lucide-react';

export function Scene06Documents() {
  const { state, saveSection } = useOnboarding();
  const d = state.sessionData?.carrier || {};
  const requiresNoa = d.paymentPreference === 'Freight Factoring' || !!((d.factoringCompanyName ?? '') as string).trim();

  const save = async () => saveSection(6, {});
  useSceneSave(save);

  return (
    <div className="rounded-lg border border-steel-700/30 bg-ink-900/50 p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-steel-700/20">
        <div className="p-2 rounded bg-brass-500/10"><FileText size={18} className="text-brass-400" /></div>
        <div>
          <h4 className="text-[18px] font-semibold text-ivory-50">Required Documents</h4>
          <p className="text-[12px] text-steel-400 mt-1">Please attach clean, legible copies. One active file per type.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 gap-4">
          <DocumentUploadCard documentType="mc_authority_letter" title="FMCSA MC Authority / NSC Certificate" />
          <DocumentUploadCard documentType="certificate_of_insurance" title="Certificate of Insurance (COI)" />
          <DocumentUploadCard documentType="w9_or_w8bene" title="Form W-9 (US) or W-8BEN-E (Canada)" />
          {requiresNoa && (
            <DocumentUploadCard documentType="noa" title="Factoring Notice of Assignment (NOA)" />
          )}
        </div>
        <div className="lg:col-span-1">
          <InfoPanel whyBody="These documents are required for compliance verification and to book cross-border loads." />
        </div>
      </div>
      <div className="mt-5 space-y-2 text-[12px] leading-relaxed text-steel-400">
        <p>• Accepted formats: PDF, JPG, or PNG · max 10MB per file.</p>
        <p>• Ensure all documents are legible and match the business name and authority numbers provided.</p>
      </div>
    </div>
  );
}