/* ============ PipelineMotion v1 ============ */
'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { motion, stagger } from '@/lib/admin/admin-constants';

/** Pipeline page entrance choreography — reduced-motion aware, killed on unmount. */
export function usePipelineEntranceTimeline(rootRef: React.RefObject<HTMLElement | null>, ready: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !ready) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: motion.easeFast } });

        tl.from('[data-pipe="shell"]', { opacity: 0.82, duration: motion.fast })
          .from('[data-pipe="title"]', { y: 12, opacity: 0, clipPath: 'inset(0 0 100% 0)', duration: 0.4, ease: motion.easeControl }, 0.1)
          .from('[data-pipe="subtitle"]', { opacity: 0, y: 6, duration: 0.3 }, 0.2);

        // Stage summary strip: manifest lock-in
        root.querySelectorAll<HTMLElement>('[data-pipe="stage-sum"]').forEach((el, i) => {
          const t = 0.3 + i * stagger.standard;
          tl.from(el, { opacity: 0, y: 8, filter: 'brightness(0.35)', duration: 0.38 }, t)
            .from(el.querySelector('[data-sum="label"]'), { opacity: 0, x: -5, duration: 0.18 }, t + 0.14);
          const spark = el.querySelector('[data-sum="spark"]');
          if (spark) tl.fromTo(spark, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.42 }, t + 0.2);
          const num = el.querySelector<HTMLElement>('[data-sum="number"]');
          if (num) {
            const target = Number(num.dataset.value ?? 0);
            const proxy = { v: 0 };
            tl.to(proxy, { v: target, duration: 0.7, snap: { v: 1 }, onUpdate: () => { num.textContent = String(Math.round(proxy.v)); } }, t + 0.16);
          }
        });

        // Board columns then cards
        tl.from('[data-pipe="col"]', { opacity: 0, y: 10, duration: 0.4, stagger: stagger.compact }, 0.95)
          .from('[data-pipe="card"]', { opacity: 0, y: 5, clipPath: 'inset(0 0 100% 0)', duration: 0.28, stagger: stagger.micro }, 1.15)
          .from('[data-pipe="panel"]', { opacity: 0, y: 10, duration: 0.45, stagger: stagger.standard }, 1.5);
      }, root);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, [rootRef, ready]);
}