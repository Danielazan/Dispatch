'use client';
import { Fragment, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ONBOARDING_STEPS } from '@/lib/onboarding/steps';
import { useOnboarding } from '@/lib/onboarding/context';

export function OnboardingStepper() {
  const { state, goToStep } = useOnboarding();
  const active = state.currentStepIndex;
  const completed = state.sessionData?.furthestCompletedSection ?? 0;
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    linesRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, { backgroundColor: i + 1 <= active + 1 ? '#B69A68' : 'rgba(57,65,73,0.45)', duration: 0.5, ease: 'power2.inOut' });
    });
  }, [active]);

  return (
    <div className="px-8 pt-5 pb-4" data-text>
      <div className="flex items-start">
        {ONBOARDING_STEPS.map((s, i) => {
          const isActive = i === active;
          const isDone = completed >= s.index && !isActive;
          return (
            <Fragment key={s.id}>
              {i > 0 && (
                <div ref={(el) => { linesRef.current[i - 1] = el; }}
                  className="flex-1 h-px min-w-4 mt-[15px]"
                  style={{ backgroundColor: i <= active + 1 ? '#B69A68' : 'rgba(57,65,73,0.45)' }} />
              )}
              <button type="button" onClick={() => goToStep(i)} className="w-[84px] shrink-0 flex flex-col items-center gap-1.5 group">
                <span className={`w-8 h-8 rounded-full grid place-items-center border font-tech text-[13px] transition-colors duration-300 ${
                  isActive ? 'bg-brass-500 border-brass-500 text-ink-950 font-semibold'
                  : isDone ? 'bg-ink-950 border-brass-500/50 text-brass-400'
                  : 'bg-ink-900 border-steel-700/50 text-steel-400'}`}>
                  {s.index}
                </span>
                <span className={`text-[12px] leading-[1.2] text-center transition-colors ${
                  isActive ? 'text-ivory-50 font-medium' : 'text-steel-400 group-hover:text-steel-300'}`}>
                  {s.label}
                </span>
              </button>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}