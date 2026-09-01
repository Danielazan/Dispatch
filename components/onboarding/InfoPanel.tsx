/* ============ InfoPanel v2 ============ */
'use client';
import { Info, Lock } from 'lucide-react';

export function InfoPanel({ whyBody, secureBody }: { whyBody?: string; secureBody?: string }) {
  return (
    <aside className="space-y-4">
      <div className="rounded-[9px] border border-steel-700/25 bg-ink-900/40 p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <Info size={16} className="text-brass-400" />
          <h3 className="text-[13px] font-semibold text-ivory-50">Why we need this</h3>
        </div>
        <p className="text-[12px] leading-relaxed text-steel-400">
          {whyBody ?? 'This information helps us verify your business, create your carrier profile, and ensure compliance with FMCSA requirements.'}
        </p>
      </div>

      <div className="rounded-[9px] border border-steel-700/25 bg-ink-900/40 p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <Lock size={16} className="text-brass-400" />
          <h3 className="text-[13px] font-semibold text-ivory-50">Your information is secure</h3>
        </div>
        <p className="text-[12px] leading-relaxed text-steel-400">
          {secureBody ?? 'All data is encrypted and handled in accordance with our privacy and security standards.'}
        </p>
      </div>
    </aside>
  );
}
