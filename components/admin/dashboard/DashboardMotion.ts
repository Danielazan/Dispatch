/* ============ DashboardMotion v1 ============ */
'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { motion, stagger } from '@/lib/admin/admin-constants';

/** Master "control-room ignition" entrance timeline. Killed on unmount; reduced-motion aware. */
export function useDashboardEntranceTimeline(rootRef: React.RefObject<HTMLElement | null>, ready: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !ready) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: motion.easeFast } });

        // Phase 01–04: shell lock, command trace, header reveal, status resolve
        tl.from('[data-dash="shell"]', { opacity: 0.82, duration: motion.fast })
          .fromTo('[data-dash="command-trace"]', { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power2.inOut' }, 0.1)
          .from('[data-dash="title"]', { y: 12, opacity: 0, clipPath: 'inset(0 0 100% 0)', duration: 0.4, ease: motion.easeControl }, 0.4)
          .from('[data-dash="subtitle"]', { opacity: 0, y: 6, duration: 0.3 }, 0.5);

        // Phase 05: KPI "freight manifest lock-in"
        root.querySelectorAll<HTMLElement>('[data-dash="kpi"]').forEach((card, i) => {
          const t = 0.65 + i * stagger.standard;
          tl.from(card, { opacity: 0, y: 8, filter: 'brightness(0.35)', duration: 0.38 }, t)
            .from(card.querySelector('[data-kpi="label"]'), { opacity: 0, x: -5, duration: 0.18 }, t + 0.16)
            .from(card.querySelector('[data-kpi="icon"]'), { opacity: 0, scale: 0.94, duration: 0.25, ease: motion.easeControl }, t + 0.2)
            .from(card.querySelector('[data-kpi="trend"]'), { opacity: 0, y: 5, duration: 0.24 }, t + 0.22);
          const spark = card.querySelector('[data-kpi="spark"]');
          if (spark) tl.fromTo(spark, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.42 }, t + 0.26);
          const num = card.querySelector<HTMLElement>('[data-kpi="number"]');
          if (num) {
            const target = Number(num.dataset.value ?? 0);
            const proxy = { v: 0 };
            tl.to(proxy, {
              v: target, duration: 0.8, ease: motion.easeFast, snap: { v: 1 },
              onUpdate: () => { num.textContent = Math.round(proxy.v).toLocaleString('en-US'); },
            }, t + 0.2);
          }
        });

        // Panels, pipeline pressure, map wake, activity spine, table, quick actions
        tl.from('[data-dash="panel"]', { opacity: 0, y: 10, duration: 0.45, stagger: stagger.standard }, 1.25)
          .fromTo('[data-dash="pipeline-trace"]', { scaleY: 0, transformOrigin: 'top center' }, { scaleY: 1, duration: 0.9, ease: 'power2.inOut' }, 1.35)
          .from('[data-dash="pipeline-stage"]', { opacity: 0.25, duration: 0.3, stagger: 0.12 }, 1.35)
          .fromTo('[data-dash="map-scan"]', { x: '-100%', opacity: 0.6 }, { x: '100%', opacity: 0, duration: 1.3, ease: 'power2.inOut' }, 1.45)
          .from('[data-dash="hotspot"]', { opacity: 0, scale: 0.6, duration: 0.4, stagger: stagger.compact }, 1.65)
          .fromTo('[data-dash="spine"]', { scaleY: 0, transformOrigin: 'top center' }, { scaleY: 1, duration: 0.7 }, 1.7)
          .from('[data-dash="activity"]', { opacity: 0, y: 6, duration: 0.3, stagger: 0.08 }, 1.85)
          .from('[data-dash="vrow"]', { opacity: 0, y: 5, clipPath: 'inset(0 0 100% 0)', duration: 0.3, stagger: 0.05 }, 2.15)
          .from('[data-dash="qaction"]', { opacity: 0, y: 6, duration: 0.3, stagger: stagger.compact }, 2.35);
      }, root);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, [rootRef, ready]);
}