'use client';
import { useOnboarding, useSceneSave } from '@/lib/onboarding/context';
import { DocumentUploadCard } from '../ui/DocumentUploadCard';
import { ShieldCheck } from 'lucide-react';

/* Writes: PATCH §4 (progress). COI upload via POST /documents (token-scoped). */
export function Scene03Insurance() {
  const { saveSection } = useOnboarding();
  const save = async () => saveSection(4, {});
  useSceneSave(save);

  return (
    <div style={{ minWidth: 0 }}>
      <div className="flex items-start gap-3 mb-4" data-text>
        <ShieldCheck size={20} strokeWidth={1.25} className="text-brass-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-[15px] font-semibold text-ivory-50">Insurance & Safety</h3>
          <p className="text-[12px] text-steel-400">Upload your Certificate of Insurance now, or later in Documents Upload.</p>
        </div>
      </div>

      <DocumentUploadCard documentType="certificate_of_insurance" title="Certificate of Insurance" />

      <div className="mt-5 space-y-2 text-[12px] leading-relaxed text-steel-400">
        <p>• Ensure the COI lists your current legal business name and authority numbers exactly as entered in Steps 1–2.</p>
        <p>• Cargo and liability coverage pages should be included where applicable.</p>
        <p>• PDF, JPG, or PNG · max 10MB. Re-uploading replaces the previous file.</p>
      </div>
    </div>
  );
}