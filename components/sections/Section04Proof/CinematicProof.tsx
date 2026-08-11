"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { buildProofTimeline } from "./animations04";
import ProofEditorial from "./ProofEditorial";
import TestimonialRail from "./TestimonialRail";
import CoverageMap from "./CoverageMap";
import ProofStats from "./ProofStats";
import CarrierTrustRow from "./CarrierTrustRow";

const DEBUG_SECTION_04 = false;

export default function CinematicProof() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scope = viewportRef.current;
    const track = trackRef.current;
    if (!scope || !track) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const tl = buildProofTimeline(scope, track);
      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={trackRef} className="relative min-[768px]:h-[260vh]">
      <div
        ref={viewportRef}
        className="relative overflow-hidden bg-[var(--s4-bg-1)] min-[768px]:sticky min-[768px]:top-0 min-[768px]:h-[100svh]"
      >
        {/* depth background */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 75% 50%, rgba(185,138,78,0.07), transparent 40%), linear-gradient(180deg, #111820 0%, #0B1014 100%)",
          }}
        />
        <div aria-hidden="true" className="s4-vignette pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="s4-grain pointer-events-none absolute inset-0" />
        <div aria-hidden="true" data-s4="sweep" className="s4-sweep pointer-events-none absolute inset-0" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col px-[clamp(24px,4vw,64px)] pb-8 pt-24">
          <div className="grid min-h-0 flex-1 gap-8 min-[768px]:grid-cols-[minmax(0,30fr)_minmax(0,70fr)] min-[1200px]:grid-cols-[minmax(0,26fr)_minmax(0,46fr)_minmax(0,28fr)]">
            <ProofEditorial />

            <TestimonialRail />

            <div className="flex min-h-0 flex-col gap-6 min-[768px]:col-start-2 min-[768px]:flex-row min-[1200px]:col-start-3 min-[1200px]:flex-col">
              <CoverageMap />
              <ProofStats />
            </div>
          </div>

          <div className="mt-8">
            <CarrierTrustRow />
          </div>
        </div>
      </div>

      {DEBUG_SECTION_04 && (
        <div className="fixed bottom-4 right-4 z-[90] border border-[var(--s4-border)] bg-[rgba(11,16,20,0.85)] px-3 py-2 font-tech text-[10px] tracking-[0.14em] text-[var(--s4-muted)]">
          S04 CINEMATIC
        </div>
      )}
    </div>
  );
}