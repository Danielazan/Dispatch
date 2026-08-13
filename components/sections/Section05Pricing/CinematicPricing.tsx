"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { setupPricingMotion, pricingConfig } from "./PricingMotion";
import PricingIntro from "./PricingIntro";
import PricingPlans from "./PricingPlans";
import PricingAssurances from "./PricingAssurances";

export default function CinematicPricing() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const debugRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scope = viewportRef.current;
    const track = trackRef.current;
    if (!scope || !track) return;

    let dispose: (() => void) | undefined;
    const ctx = gsap.context(() => {
      dispose = setupPricingMotion(scope, track, (p) => {
        if (debugRef.current) debugRef.current.textContent = `S05 CAM ${p.toFixed(2)}`;
      });
    }, scope);

    return () => {
      ctx.revert();
      dispose?.();
    };
  }, []);

  return (
    <div ref={trackRef} className="relative" style={{ height: pricingConfig.trackHeight }}>
      <div ref={viewportRef} className="sticky top-0 h-[100svh] overflow-hidden bg-[var(--s5-black)]">
        {/* ivory editorial surface — horizontal shutter (entrance-owned) */}
        <div data-s5="exposure" className="s5-paper absolute inset-0 z-10 bg-[var(--s5-ivory)]" />

        {/* warm aperture sliver */}
        <div
          data-s5="sliver"
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 z-20 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--s5-champagne)] to-transparent opacity-0"
        />

        {/* traveling window light — camera-owned */}
        <div
          data-s5="windowlight"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[35] opacity-40 mix-blend-soft-light"
          style={{
            background:
              "linear-gradient(100deg, transparent 18%, rgba(212,176,106,0.5) 44%, rgba(240,236,228,0.4) 52%, transparent 78%)",
          }}
        />

        {/* drifting paper highlight — rests on featured column, drifts to center when open */}
        <div
          data-s5="paperhighlight"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[35] opacity-50 mix-blend-soft-light will-change-transform"
          style={{ background: "radial-gradient(46% 60% at 55% 42%, rgba(240,236,228,0.5), transparent 72%)" }}
        />

        {/* OPEN tint — warm champagne lift, rises when the user scrolls up to compare */}
        <div
          data-s5="opentint"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[35] opacity-0 mix-blend-soft-light"
          style={{
            background:
              "radial-gradient(85% 65% at 50% 40%, rgba(212,176,106,0.16), transparent 70%), linear-gradient(180deg, rgba(240,236,228,0.5) 0%, rgba(240,236,228,0.15) 60%, transparent 100%)",
          }}
        />

        {/* DIRECTED tint — cool stone wash + deeper edges, narrows the room on the way down */}
        <div
          data-s5="directedtint"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[35] opacity-0 mix-blend-multiply"
          style={{ background: "radial-gradient(120% 90% at 50% 45%, transparent 52%, rgba(32,40,46,0.16) 100%)" }}
        />

        {/* acknowledgment pass — one slow warm sweep on re-entry from below */}
        <div
          data-s5="returnpass"
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-[35] w-1/2 opacity-0 mix-blend-soft-light"
          style={{
            background:
              "linear-gradient(100deg, transparent 0%, rgba(212,176,106,0.5) 45%, rgba(240,236,228,0.4) 55%, transparent 100%)",
          }}
        />

        {/* the camera table */}
        <div data-s5="camera" className="relative z-30 mx-auto flex h-full w-full max-w-[1440px] items-center px-[clamp(24px,4vw,64px)]">
          <div className="grid w-full min-w-0 gap-10 min-[1024px]:grid-cols-[minmax(0,1.05fr)_minmax(0,3fr)_minmax(0,0.9fr)] min-[1024px]:gap-6 min-[1280px]:gap-8">
            <PricingIntro />
            <PricingPlans />
            <div data-plane="details" className="min-w-0">
              <PricingAssurances />
            </div>
          </div>
        </div>

        {/* departure band into Section 06 */}
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