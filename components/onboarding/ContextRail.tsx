/* ============ ContextRail v2 (PART 4 / GAP-013) ============ */
'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { site, mediaLibrary } from '@/config/site';
import { useOnboarding } from '@/lib/onboarding/context';
import { Headphones, ShieldCheck } from 'lucide-react';
import { HelpChooser } from './HelpChooser';

function ProgressRing({ percent }: { percent: number }) {
  const C = 2 * Math.PI * 34;
  const ringRef = useRef<SVGCircleElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const prev = useRef(0);

  useEffect(() => {
    const obj = { v: prev.current };
    const tl = gsap.to(obj, {
      v: percent,
      duration: 0.9,
      ease: 'power2.out',
      onUpdate: () => {
        if (ringRef.current) ringRef.current.style.strokeDashoffset = String(C * (1 - obj.v / 100));
        if (numRef.current) numRef.current.textContent = `${Math.round(obj.v)}%`;
      },
    });
    prev.current = percent;
    return () => { tl.kill(); };
  }, [percent, C]);

  return (
    <div className="relative w-[88px] h-[88px] my-4">
      <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
        <circle cx="44" cy="44" r="34" fill="none" stroke="rgba(57,65,73,0.4)" strokeWidth="5" />
        <circle ref={ringRef} cx="44" cy="44" r="34" fill="none" stroke="#B69A68" strokeWidth="5"
          strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C} />
      </svg>
      <span ref={numRef} className="absolute inset-0 grid place-items-center font-tech text-[15px] text-ivory-50">0%</span>
    </div>
  );
}

export function ContextRail() {
  const { state } = useOnboarding();
  const truck = mediaLibrary.onboardingTruck;
  const [imgState, setImgState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const imgRef = useRef<HTMLImageElement | null>(null);

  /* CACHED-IMAGE FIX: when the same asset was already painted elsewhere (sidebar),
  the browser can complete this <img> before React attaches onLoad — the event
  never fires and the frame would stay invisible. Check .complete on mount. */
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    if (el.complete) {
      setImgState(el.naturalWidth > 0 ? 'ready' : 'failed');
    }
  }, []);

  const completed = state.sessionData?.furthestCompletedSection ?? 0;
  const percent = Math.round((completed / 7) * 100);

  return (
    <aside data-context-rail className="hidden lg:block w-[280px] bg-ink-950 border-l border-steel-700/20 p-4 space-y-4 overflow-y-auto ob-scroll shrink-0">
      <div className="relative h-44 rounded-[10px] overflow-hidden border border-steel-700/30 bg-ink-900">
        {imgState !== 'failed' && (
          <img
            ref={imgRef}
            src={truck.src}
            alt={truck.alt}
            onLoad={() => setImgState('ready')}
            onError={() => setImgState('failed')}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${imgState === 'ready' ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-[1.025]'}`}
            style={{ objectPosition: `${truck.focalPoint!.x * 100}% ${truck.focalPoint!.y * 100}%` }}
          />
        )}
        {imgState === 'loading' && (
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.025), transparent)' }} />
        )}
        {imgState === 'failed' && (
          <div className="absolute inset-0 grid place-items-center">
            <span className="font-tech text-[10px] uppercase tracking-widest text-steel-600">[{truck.id}]</span>
          </div>
        )}
      </div>

      <div className="px-1" data-text>
        <p className="text-[13px] font-semibold text-ivory-50">Onboarding Progress</p>
        <ProgressRing percent={percent} />
        <p className="text-[11px] text-steel-400">{completed} of 7 sections completed</p>
      </div>

      <div className="rounded-[9px] border border-steel-700/25 bg-ink-900/40 p-5" data-text>
        <div className="flex items-center gap-2.5">
          <Headphones size={16} className="text-ivory-100" />
          <h3 className="text-[13px] font-semibold text-ivory-50">{site.support.title}</h3>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-steel-400">{site.support.body}</p>
        <HelpChooser variant="rail" />
      </div>

      <div className="rounded-[9px] border border-steel-700/25 bg-ink-900/40 p-5 flex gap-3" data-text>
        <ShieldCheck size={16} className="text-steel-300 shrink-0 mt-0.5" />
        <p className="text-[12px] leading-relaxed text-steel-400">{site.saveReminder}</p>
      </div>
    </aside>
  );
}