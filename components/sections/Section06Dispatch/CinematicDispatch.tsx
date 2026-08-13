"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { gsap } from "gsap";
import { buildBootTimeline } from "./dispatchMotion";
import SectionContainer from "@/components/landing/SectionContainer";
import DispatchIntro from "./DispatchIntro";
import DispatchTerminal from "./DispatchTerminal";
import DispatchSecurity from "./DispatchSecurity";
import DispatchResponse from "./DispatchResponse";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function CinematicDispatch() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const bootedRef = useRef(false);
  const [inView, setInView] = useState(false);

  /* Build the paused boot timeline pre-paint (fromTo sets the initial hidden states). */
  useLayoutEffect(() => {
    const scope = rootRef.current;
    if (!scope) return;
    bootedRef.current = false;
    const ctx = gsap.context(() => {
      tlRef.current = buildBootTimeline(scope);
    }, scope);
    return () => {
      ctx.revert();
      tlRef.current = null;
    };
  }, []);

  /* Ambient visibility — peripherals enter/exit on every pass; boot plays exactly once. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio >= 0.12) {
            setInView(true);
            if (!bootedRef.current && tlRef.current) {
              bootedRef.current = true;
              tlRef.current.play();
            }
          } else if (entry.intersectionRatio <= 0.02) {
            setInView(false); // scroll away → peripherals retract (terminal stays)
          }
        }
      },
      { threshold: [0, 0.02, 0.12] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* INTERACTION LATCH — if the user touches the form mid-boot, snap to the finished state. */
  const handleInteracted = useCallback(() => {
    const tl = tlRef.current;
    if (tl && tl.progress() < 1) tl.progress(1); // fires onComplete → clearProps latch
  }, []);

  return (
    <div ref={rootRef} className={`relative ${inView ? "in-view" : ""}`}>
      {/* ambient atmosphere (reversible tier) */}
      <div
        aria-hidden="true"
        className="s6-glow pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 72% 48%, rgba(180,140,70,0.055), transparent 44%)" }}
      />
      <div aria-hidden="true" className="s6-path s6-signal-path pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2" />

      {/* signal acquisition — GSAP-boot owned, CSS-wrapped so it can dim on exit */}
      <div aria-hidden="true" className="s6-signal-wrap pointer-events-none absolute inset-y-0 left-0 z-20 w-[46%]">
        <span
          data-s6="signal-dot"
          className="absolute left-[5%] h-2 w-2 rounded-full bg-[var(--s6-champagne)]"
          style={{ top: "calc(50% - 4px)" }}
        />
        <span
          data-s6="signal-line"
          className="absolute left-[5%] h-px w-[38%] origin-left bg-[var(--s6-border-brass)]"
          style={{ top: "calc(50% - 0.5px)" }}
        />
      </div>

      <SectionContainer className="relative py-20 min-[1024px]:py-24">
        <div className="grid gap-12 min-[1024px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] min-[1024px]:items-start min-[1024px]:gap-16">
          <div className="min-w-0">
            <DispatchIntro />
            <div className="mt-10 space-y-6">
              <DispatchSecurity />
              <DispatchResponse />
            </div>
          </div>
          <div className="min-w-0">
            <DispatchTerminal onInteracted={handleInteracted} />
          </div>
        </div>
      </SectionContainer>

      {/* departure band into the footer */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--s6-ops-black)] to-transparent" />

      {/* chapter marker */}
      <span
        aria-hidden="true"
        className="s6-reveal absolute bottom-6 right-[clamp(24px,4vw,64px)] font-tech text-[10px] tracking-[0.2em] text-[var(--s6-muted-text)]/40"
        style={d(1200)}
      >
        06
      </span>
    </div>
  );
}