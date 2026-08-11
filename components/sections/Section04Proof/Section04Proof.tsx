"use client";

import { useEffect, useState } from "react";
import CinematicProof from "./CinematicProof";
import StaticProof from "./StaticProof";

/* Progressive enhancement: server renders the readable static scene;
   desktop + no-preference upgrades to the pinned cinematic sequence. */
export default function Section04Proof() {
  const [cinematic, setCinematic] = useState(false);

  useEffect(() => {
    const mqWide = window.matchMedia("(min-width: 768px)");
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
      id="reviews"
      aria-labelledby="proof-heading"
      className="relative border-t border-[rgba(185,138,78,0.25)] bg-[var(--s4-bg-1)]"
    >
      {cinematic ? <CinematicProof /> : <StaticProof />}
    </section>
  );
}