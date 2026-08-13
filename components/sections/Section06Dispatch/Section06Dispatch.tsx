"use client";

import { useEffect, useState } from "react";
import CinematicDispatch from "./CinematicDispatch";
import StaticDispatch from "./StaticDispatch";

/* Progressive enhancement: SSR renders the readable static layout;
   desktop (≥1024) + no-preference upgrades to the pinned cinematic boot. */
export default function Section06Dispatch() {
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
      id="lead-form"
      aria-labelledby="lead-form-heading"
      className="relative overflow-x-clip bg-[var(--s6-ops-black)]"
    >
      {cinematic ? <CinematicDispatch /> : <StaticDispatch />}
    </section>
  );
}