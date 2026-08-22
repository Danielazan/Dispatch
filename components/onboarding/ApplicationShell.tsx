/* ============ ApplicationShell v4 (PART 5 — responsive shell + drawer) ============ */
'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { X } from 'lucide-react';
import { ApplicationHeader } from './ApplicationHeader';
import { PrimarySidebar } from './PrimarySidebar';
import { ContextRail } from './ContextRail';
import { ApplicationFooter } from './ApplicationFooter';
import { SceneController } from './SceneController';
import { useOnboarding } from '@/lib/onboarding/context';
import { createSystemWakeTimeline } from '@/motion/onboardingMotion';

export function ApplicationShell() {
  const shellRef = useRef<HTMLDivElement>(null);
  const { state } = useOnboarding();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const completed = state.sessionData?.furthestCompletedSection ?? 0;
  const percent = Math.round((completed / 7) * 100);

  useEffect(() => {
    const scope = shellRef.current;
    if (!scope) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const { timeline, revert } = createSystemWakeTimeline(scope);
      if (timeline) timeline.play();
      return () => { revert(); };
    });
    return () => { mm.revert(); };
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawerOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  return (
    <div ref={shellRef} className="flex h-screen bg-ink-950 text-ivory-50 overflow-hidden">
      <PrimarySidebar mode="desktop" />

      <div className="flex flex-col flex-1 min-w-0">
        <ApplicationHeader onMenu={() => setDrawerOpen(true)} />

        {/* Mobile progress strip — replaces the rail below lg */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-2 border-b border-steel-700/20 bg-ink-950">
          <span className="font-tech text-[11px] text-brass-400">{percent}%</span>
          <div className="flex-1 h-1 rounded-full bg-steel-700/40 overflow-hidden">
            <div className="h-full bg-brass-500 transition-all duration-500" style={{ width: `${percent}%` }} />
          </div>
          <span className="text-[10px] text-steel-400">{completed} of 7</span>
        </div>

        <div className="flex flex-1 min-h-0">
          <main data-main className="flex-1 overflow-y-auto ob-scroll">
            <SceneController />
          </main>
          <ContextRail />
        </div>

        <ApplicationFooter />
      </div>

      {/* Mobile navigation drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-ink-950/70" onMouseDown={() => setDrawerOpen(false)} />
          <div
            className="absolute left-0 top-0 h-full w-[260px] overflow-y-auto ob-scroll bg-ink-950 border-r border-steel-700/20"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-2">
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close menu"
                className="grid h-8 w-8 place-items-center rounded-[6px] border border-steel-700/40 text-steel-400 hover:text-ivory-100 transition-colors">
                <X size={14} />
              </button>
            </div>
            <PrimarySidebar mode="drawer" />
          </div>
        </div>
      )}
    </div>
  );
}