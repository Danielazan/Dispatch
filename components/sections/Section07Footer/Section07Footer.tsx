"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import SectionContainer from "@/components/landing/SectionContainer";
import { buildFooterTimeline } from "./footerMotion";
import FooterBrand from "./FooterBrand";
import FooterNavigation from "./FooterNavigation";
import FooterContact from "./FooterContact";
import FooterTruckScene from "./FooterTruckScene";
import FooterLegal from "./FooterLegal";

/* SECTION 07 — THE LAST MILE.
   Progressive enhancement: the server renders the complete, fully-visible footer.
   On the client (motion allowed), a one-shot cinematic timeline hides and
   re-reveals it in layers, then settles into permanent stillness.
   Reduced motion / no JS → the footer simply exists, finished and calm. */
export default function Section07Footer() {
  const footerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const scope = footerRef.current;
    if (!scope) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // §44 — stillness by preference

    const compact = window.matchMedia("(max-width: 1023px)").matches;
    const ctx = gsap.context(() => {
      buildFooterTimeline(scope, { compact });
    }, scope);
    return () => ctx.revert(); // Strict Mode safe — no orphaned triggers/timelines
  }, []);

  return (
    <footer
      ref={footerRef}
      aria-label="Site footer"
      className="relative overflow-hidden bg-[var(--s7-ops-black)]"
    >
      {/* darkness-settling veil — GSAP-owned; inert without JS (default opacity 0) */}
      <div
        data-s7="veil"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[4] bg-[#090D10] opacity-0"
      />

      {/* Section 06 → 07 handoff signal (§5): same brass, same 1px weight, downward travel */}
      <div aria-hidden="true" className="absolute left-[clamp(24px,4vw,64px)] top-0 z-[5] h-16 w-px">
        <span
          data-s7="handoff-line"
          className="absolute inset-0 origin-top bg-gradient-to-b from-[rgba(185,138,78,0.6)] to-[rgba(185,138,78,0.08)]"
        />
        <span
          data-s7="handoff-dot"
          className="absolute -left-[1.5px] top-0 h-1 w-1 rounded-full bg-[var(--s7-highlight)] opacity-0"
        />
      </div>

      {/* chapter marker (§31) */}
      <span
        aria-hidden="true"
        className="absolute right-[clamp(24px,4vw,64px)] top-6 z-10 font-tech text-[10px] tracking-[0.22em] text-[var(--s7-muted-text)] opacity-35"
      >
        FINAL MILE / 07
      </span>

      <SectionContainer className="relative z-10 pb-14 pt-20 md:pb-16 md:pt-24">
        {/* ---- information architecture: brand → nav groups → contact ---- */}
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-10 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1.2fr] lg:gap-x-10 lg:gap-y-0">
          <div className="md:col-span-2 lg:col-span-1">
            <FooterBrand />
          </div>

          <FooterNavigation />

          <div className="md:col-span-2 lg:col-span-1 lg:pl-2">
            <FooterContact />
          </div>
        </div>

        {/* ---- the final shot: truck → route → signal → phrase ---- */}
        <FooterTruckScene />
      </SectionContainer>

      <FooterLegal />
    </footer>
  );
}