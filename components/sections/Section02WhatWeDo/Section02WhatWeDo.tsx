"use client";

import { useEffect, useRef, useState } from "react";
import SectionContainer from "@/components/landing/SectionContainer";
import Section02Intro from "./Section02Intro";
import ServiceGrid from "./ServiceGrid";

export default function Section02WhatWeDo() {
  const ref = useRef<HTMLElement | null>(null);
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
          if (entry.intersectionRatio >= 0.15) setInView(true);
          else if (entry.intersectionRatio <= 0.02) setInView(false);
        }
      },
      { threshold: [0, 0.02, 0.15] }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="what-we-do"
      aria-labelledby="what-we-do-heading"
      ref={ref}
      // Section 35: Thin brass top border + Section 3: Primary Background
      className={`border-t border-[var(--ironhaul-brass-55)] bg-[var(--ironhaul-ivory)] ${inView ? "in-view" : ""}`}
    >
      <SectionContainer className="py-14 min-[1200px]:py-16">
        <div className="grid gap-12 min-[1200px]:grid-cols-[minmax(0,24fr)_minmax(0,76fr)] min-[1200px]:gap-10">
          <Section02Intro />
          <ServiceGrid />
        </div>
      </SectionContainer>
    </section>
  );
}