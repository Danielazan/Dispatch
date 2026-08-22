/* ============ PrimarySidebar v3 (PART 5 — desktop rail + drawer reuse) ============ */
'use client';
import Link from 'next/link';
import { site, mediaLibrary } from '@/config/site';
import { useOnboarding } from '@/lib/onboarding/context';
import { ClipboardList, FolderOpen, Home } from 'lucide-react';
import { HelpChooser } from './HelpChooser';

export function PrimarySidebar({ mode = 'desktop' }: { mode?: 'desktop' | 'drawer' }) {
  const { state, goToStep } = useOnboarding();
  const truck = mediaLibrary.onboardingTruck;
  const items = [
    { key: 'onboarding', label: 'Onboarding', icon: ClipboardList, active: true, onClick: () => goToStep(state.currentStepIndex) },
    { key: 'application', label: 'My Application', icon: FolderOpen, onClick: () => goToStep(5) },
    { key: 'help', chooser: true },
    { key: 'home', label: 'Back to Home', icon: Home, href: '/' },
  ];

  const asideCls =
    mode === 'desktop'
      ? 'hidden lg:flex w-60 bg-ink-950 border-r border-steel-700/20 flex-col shrink-0'
      : 'flex w-full bg-ink-950 flex-col';

  return (
    <aside data-sidebar className={asideCls}>
      <div className="px-5 pt-8 pb-6">
        <h2 className="font-display text-[13px] tracking-[0.1em] text-ivory-50 uppercase" data-text>{site.sidebar.title}</h2>
        <p className="mt-2 text-[11px] text-steel-400">
          {site.sidebar.meta.map((m, i) => (
            <span key={m}>{i > 0 && <span className="text-brass-400 mx-1">•</span>}{m}</span>
          ))}
        </p>
      </div>
      <nav className="px-3 space-y-1 ob-scroll">
        {items.map((it) => {
          if ('chooser' in it && it.chooser) return <HelpChooser key={it.key} variant="sidebar" />;
          const item = it as { key: string; label: string; icon: any; active?: boolean; onClick?: () => void; href?: string };
          const inner = (
            <>
              {item.active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-brass-500" data-brass />}
              <item.icon size={17} strokeWidth={1.5} className={item.active ? 'text-brass-400' : 'text-steel-400'} />
              <span className="text-[13px]">{item.label}</span>
            </>
          );
          const cls = `relative w-full flex items-center gap-3 px-4 py-3 rounded-[6px] text-left transition-colors ${
            item.active ? 'bg-brass-500/10 text-ivory-50' : 'text-steel-300 hover:text-ivory-100 hover:bg-ink-900'}`;
          return item.href ? (
            <Link key={item.key} href={item.href} className={cls}>{inner}</Link>
          ) : (
            <button key={item.key} type="button" onClick={item.onClick} className={cls}>{inner}</button>
          );
        })}
      </nav>
      <div className="mt-auto p-4">
        <div className="relative rounded-[8px] overflow-hidden border border-steel-700/30 bg-ink-900 h-28">
          <img src={truck.src} alt={truck.alt} className="absolute inset-0 w-full h-full object-cover opacity-70"
            style={{ objectPosition: `${truck.focalPoint!.x * 100}% ${truck.focalPoint!.y * 100}%` }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent" />
          <p className="absolute left-3 bottom-4 font-display text-[11px] leading-snug tracking-[0.08em] text-ivory-100 uppercase">
            {site.promo[0]}<br />{site.promo[1]}<br />{site.promo[2]}
          </p>
        </div>
        <div className="mt-2 h-[2px] w-16 bg-brass-500" data-brass />
      </div>
    </aside>
  );
}