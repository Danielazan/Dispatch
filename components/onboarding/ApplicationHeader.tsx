/* ============ ApplicationHeader v3 (PART 5 — compact mobile header) ============ */
'use client';
import { site } from '@/config/site';
import { useOnboarding } from '@/lib/onboarding/context';
import { CircleHelp, ChevronDown, Menu } from 'lucide-react';
import { HelpChooser } from './HelpChooser';

function initialsOf(name?: string) {
  if (!name) return 'CC';
  return name.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase() || 'CC';
}

export function ApplicationHeader({ onMenu }: { onMenu?: () => void }) {
  const { state } = useOnboarding();
  const lead = state.sessionData?.lead;
  const carrierId: string | undefined = state.sessionData?.carrier?.id;
  const appId = carrierId ? `AIK-${carrierId.slice(0, 4).toUpperCase()}-${carrierId.slice(4, 8).toUpperCase()}` : '—';

  return (
    <header data-header className="h-16 bg-ink-950 border-b border-steel-700/20 flex items-center px-4 md:px-6 gap-3 md:gap-5 shrink-0">
      {onMenu && (
        <button type="button" onClick={onMenu} aria-label="Open menu"
          className="lg:hidden grid h-9 w-9 shrink-0 place-items-center rounded-[6px] border border-steel-700/40 text-steel-300 hover:text-ivory-100 transition-colors">
          <Menu size={16} />
        </button>
      )}

      <div className="flex items-center gap-3 min-w-0">
        <svg width="34" height="26" viewBox="0 0 34 26" fill="none" aria-hidden="true" className="shrink-0">
          <path d="M2 24L10 2H16L8 24H2Z" fill="#C5AA76" />
          <path d="M14 24L22 2H28L20 24H14Z" fill="#F4F1EA" />
        </svg>
        <div className="leading-none min-w-0">
          <span className="font-display text-lg font-semibold tracking-[0.02em] text-ivory-50 block truncate">{site.wordmark}</span>
          <span className="font-tech text-[8px] tracking-[0.5em] text-steel-400 block mt-0.5">{site.wordmarkSub}</span>
        </div>
      </div>

      <div className="h-8 w-px bg-steel-700/40 hidden md:block" data-border />
      <div className="leading-tight hidden md:block" data-text>
        <span className="block text-[11px] tracking-[0.08em] text-steel-300 uppercase">{site.tagline[0]}</span>
        <span className="block text-[11px] tracking-[0.08em] text-steel-300 uppercase">{site.tagline[1]}</span>
      </div>

      <div className="ml-auto flex items-center gap-3 md:gap-5">
        <div className="hidden sm:block">
          <HelpChooser variant="header" />
        </div>
        <div className="h-8 w-px bg-steel-700/40 hidden sm:block" data-border />
        <button type="button" className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-ink-800 border border-steel-700/40 grid place-items-center font-tech text-[11px] text-ivory-100 shrink-0">
            {initialsOf(lead?.contactName)}
          </span>
          <span className="leading-tight text-left hidden sm:block">
            <span className="block text-[13px] font-semibold text-ivory-50">{site.candidate}</span>
            <span className="block text-[11px] font-tech text-steel-400">{appId}</span>
          </span>
          <ChevronDown size={14} className="text-steel-400 hidden sm:block" />
        </button>
      </div>
    </header>
  );
}