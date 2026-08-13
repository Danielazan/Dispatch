"use client";

import { useEffect, useRef, useState } from "react";
import SectionContainer from "@/components/landing/SectionContainer";
import DispatchIntro from "./DispatchIntro";
import DispatchTerminal from "./DispatchTerminal";
import DispatchSecurity from "./DispatchSecurity";
import DispatchResponse from "./DispatchResponse";

/* Readable normal-flow composition. Same ambient enter/exit reveals, no GSAP. */
export default function StaticDispatch() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio >= 0.12) setInView(true);
          else if (entry.intersectionRatio <= 0.02) setInView(false);
        }
      },
      { threshold: [0, 0.02, 0.12] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative ${inView ? "in-view" : ""}`}>
      <div
        aria-hidden="true"
        className="s6-glow pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 72% 48%, rgba(180,140,70,0.055), transparent 44%)" }}
      />
      <SectionContainer className="relative py-16 md:py-20 min-[1024px]:py-24">
        <div className="grid gap-12 min-[1024px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] min-[1024px]:items-start min-[1024px]:gap-16">
          <div className="min-w-0">
            <DispatchIntro />
            <div className="mt-10 space-y-6">
              <DispatchSecurity />
              <DispatchResponse />
            </div>
          </div>
          <div className="min-w-0">
            <DispatchTerminal />
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}