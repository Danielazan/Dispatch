/* ============ onboardingMotion v3 ============ */
import { gsap } from 'gsap';

export const motionTokens = {
  distance: { sm: 2, md: 4, lg: 8, xl: 14, xxl: 18 },
  duration: { micro: 0.12, short: 0.22, med: 0.42, long: 0.72, xl: 0.98, wake: 1.6 },
  easing: {
    precision: [0.22, 1, 0.36, 1] as readonly number[],
    transfer: [0.65, 0, 0.35, 1] as readonly number[],
  },
};

export function createSystemWakeTimeline(scope: HTMLElement) {
  let wakeTl: gsap.core.Timeline | undefined;

  const ctx = gsap.context(() => {
    wakeTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const header = scope.querySelector('[data-header]');
    const sidebar = scope.querySelector('[data-sidebar]');
    const rail = scope.querySelector('[data-context-rail]');
    const main = scope.querySelector('[data-main]');
    
    if (header) wakeTl.fromTo(header, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: motionTokens.duration.med }, 0);
    if (sidebar) wakeTl.fromTo(sidebar, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: motionTokens.duration.med }, 0.1);
    if (rail) wakeTl.fromTo(rail, { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: motionTokens.duration.med }, 0.2);
    if (main) wakeTl.fromTo(main, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: motionTokens.duration.long }, 0.3);
  }, scope);
  
  return { 
    timeline: wakeTl, 
    revert: () => ctx.revert() 
  };
}

export function createRouteSignalTimeline(scope: HTMLElement, fromIndex: number, toIndex: number) {
  let routeTl: gsap.core.Timeline | undefined;

  const ctx = gsap.context(() => {
    routeTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    
    const statusStrip = scope.querySelector('[data-status-strip]');
    const currentScene = scope.querySelector(`[data-scene="${fromIndex}"]`);
    const nextScene = scope.querySelector(`[data-scene="${toIndex}"]`);
    const cta = scope.querySelector('[data-cta-continue]');
    const stepper = scope.querySelector('[data-stepper]');
    
    // 140 transfer → 180 autosave confirm
    if (statusStrip) {
      routeTl.to(statusStrip, { scale: 1.02, duration: 0.1 }, 0.14)
             .to(statusStrip, { scale: 1, duration: 0.2 }, 0.24);
    }
    
    // 240 current releases
    if (currentScene) {
      routeTl.to(currentScene, { y: -14, opacity: 0, duration: 0.26, ease: 'power2.in' }, 0.24);
    }
    
    // 320 brass travels connector (stepper pulse)
    if (stepper) {
      routeTl.fromTo(stepper, { filter: 'brightness(1)' }, { filter: 'brightness(1.2)', duration: 0.2, yoyo: true, repeat: 1 }, 0.32);
    }
    
    // 580 enter
    if (nextScene) {
      routeTl.fromTo(nextScene, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42 }, 0.58);
    }
    
    // 950 CTA available
    if (cta) {
      routeTl.fromTo(cta, { opacity: 0.5, pointerEvents: 'none' }, { opacity: 1, pointerEvents: 'auto', duration: 0.15 }, 0.95);
    }
  }, scope);
  
  return { 
    timeline: routeTl, 
    revert: () => ctx.revert() 
  };
}