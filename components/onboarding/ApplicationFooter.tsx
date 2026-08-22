/* ============ ApplicationFooter v2 (PART 5 — responsive) ============ */
'use client';
import { site } from '@/config/site';
import { ShieldCheck, Lock } from 'lucide-react';

export function ApplicationFooter() {
  return (
    <footer data-footer className="h-14 bg-ink-950 border-t border-steel-700/20 flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <ShieldCheck size={18} strokeWidth={1.5} className="text-ivory-100 shrink-0" />
        <div className="leading-tight min-w-0">
          <p className="text-[11px] tracking-[0.08em] text-ivory-100 uppercase truncate">{site.footer.line1}</p>
          <p className="text-[11px] text-steel-400 truncate">{site.footer.line2}</p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-3 text-[10px] font-tech uppercase tracking-wider text-steel-500">
        {site.footer.meta.map((m, i) => (
          <span key={m} className="flex items-center gap-3">
            {i > 0 && <span className="text-steel-700">•</span>}
            {m}
            {i === site.footer.meta.length - 1 && <Lock size={11} className="text-status-live" />}
          </span>
        ))}
      </div>
    </footer>
  );
}