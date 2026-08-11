"use client";

import { useEffect, useState } from "react";
import CinematicPricing from "./CinematicPricing";
import StaticPricing from "./StaticPricing";

/* Progressive enhancement: SSR renders the readable static spread;
   desktop (≥1024) + no-preference upgrades to the pinned exposure scene. */
export default function Section05Pricing() {
  const [cinematic, setCinematic] = useState(false);

  useEffect(() => {
    const mqWide = window.matchMedia("(min-width: 1024px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setCinematic(mqWide.matches && !mqReduce.matches);
    update();
    mqWide.addEventListener("change", update);
    mqReduce.addEventListener("change", update);
    return () => {
      mqWide.removeEventListener("change", update);
      mqReduce.removeEventListener("change", update);
    };
  }, []);

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative overflow-x-clip border-t border-[rgba(185,138,78,0.45)]"
    >
      {cinematic ? <CinematicPricing /> : <StaticPricing />}
    </section>
  );
}