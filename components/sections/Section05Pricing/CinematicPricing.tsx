"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { buildPricingTimeline, pricingConfig } from "./PricingMotion";
import PricingIntro from "./PricingIntro";
import PricingPlans from "./PricingPlans";
import PricingAssurances from "./PricingAssurances";

export default function CinematicPricing() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const debugRef = useRef<HTMLDivElement | null>(null);

  /* useEffect (not useLayoutEffect) → no SSR warning; the section mounts
     at page load below the fold, so initial states are set before it's seen. */
  useEffect(() => {
    const scope = viewportRef.current;
    const track = trackRef.current;
    if (!scope || !track) return;

    const ctx = gsap.context(() => {
      buildPricingTimeline(scope, track, (p) => {
        if (debugRef.current) debugRef.current.textContent = `S05 ${p.toFixed(2)}`;
      });
    }, scope);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={trackRef} className="relative" style={{ height: pricingConfig.trackHeight }}>
      <div ref={viewportRef} className="sticky top-0 h-[100svh] overflow-hidden bg-[var(--s5-black)]">
        <div data-s5="exposure" className="s5-paper absolute inset-0 z-10 bg-[var(--s5-ivory)] will-change-[clip-path]" />

        <div
          data-s5="sliver"
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 z-20 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--s5-champagne)] to-transparent opacity-0"
        />

        <div data-s5="camera" className="relative z-30 mx-auto flex h-full w-full max-w-[1440px] items-center px-[clamp(24px,4vw,64px)]">
          {/* minmax(0,·) tracks = tracks may shrink; content wraps instead of overflowing */}
          <div className="grid w-full min-w-0 gap-10 min-[1024px]:grid-cols-[minmax(0,1.05fr)_minmax(0,3fr)_minmax(0,0.9fr)] min-[1024px]:gap-6 min-[1280px]:gap-8">
            <PricingIntro />
            <PricingPlans />
            <div data-plane="details" className="min-w-0">
              <PricingAssurances />
            </div>
          </div>
        </div>

        <div data-s5="depart" aria-hidden="true" className="absolute inset-x-0 bottom-0 z-40 h-[18%] bg-[var(--s5-black)]" />
      </div>

      {pricingConfig.debug && (
        <div
          ref={debugRef}
          className="fixed bottom-4 right-4 z-[90] border border-[var(--s5-border)] bg-[rgba(11,16,20,0.85)] px-3 py-2 font-tech text-[10px] tracking-[0.14em] text-[var(--s5-cream)]"
        />
      )}
    </div>
  );
}