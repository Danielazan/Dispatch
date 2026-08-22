/* ============ Scene05Documents v1 ============ */
'use client';
import { useOnboarding, useSceneSave } from '@/lib/onboarding/context';
import { DocumentUploadCard } from '../ui/DocumentUploadCard';
import { FileText } from 'lucide-react';

export function Scene05Documents() {
  const { state, saveSection } = useOnboarding();
  const d = state.sessionData?.carrier || {};

  // NOA rule mirrors submissionRequirements.js exactly
  const requiresNoa =
    d.paymentPreference === 'Freight Factoring' ||
    !!((d.factoringCompanyName ?? '') as string).trim();

  const save = async () => saveSection(5, {});
  useSceneSave(save);

  return (
    <div style={{ minWidth: 0 }}>
      <div className="flex items-start gap-3 mb-4" data-text>
        <FileText size={20} strokeWidth={1.25} className="text-brass-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-[15px] font-semibold text-ivory-50">Mandatory Compliance Documents</h3>
          <p className="text-[12px] text-steel-400">
            Upload the required documents below. One active file per type — re-uploading replaces the previous file.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <DocumentUploadCard documentType="mc_authority_letter" title="MC Authority Letter" />
        <DocumentUploadCard documentType="certificate_of_insurance" title="Certificate of Insurance" />
        <DocumentUploadCard documentType="w9_or_w8bene" title="W-9 / W-8BEN" />
        
        {requiresNoa && (
          <DocumentUploadCard documentType="noa" title="Notice of Assignment (NOA)" />
        )}
      </div>

      <div className="mt-5 space-y-2 text-[12px] leading-relaxed text-steel-400">
        <p>• Accepted formats: PDF, JPG, or PNG · max 10MB per file.</p>
        <p>• Ensure all documents are legible and match the business name and authority numbers provided in earlier steps.</p>
      </div>
    </div>
  );
}