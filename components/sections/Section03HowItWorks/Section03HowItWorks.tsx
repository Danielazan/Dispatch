"use client";

import { useEffect, useState } from "react";
import CinematicViewport from "./CinematicViewport";
import SceneTimelineStatic from "./SceneTimelineStatic";
import { processScenes } from "./sceneData";
import { sceneFallbackStyle } from "./SceneBackground";
import SectionContainer from "@/components/landing/SectionContainer";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cb = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  }, []);
  return reduced;
}

/* Readable normal-flow fallback: the four steps stay fully accessible. */
function StaticStory() {
  return (
    <SectionContainer className="py-16 md:py-20">
      <p className="text-[12px] font-semibold tracking-[0.14em] text-[var(--s3-brass)]">HOW IT WORKS</p>
      <h2 id="how-it-works-heading" className="mt-4 font-display text-[clamp(32px,3.2vw,48px)] font-semibold uppercase leading-[0.95] text-[var(--s3-ivory)]">
        Four Steps.
        <br />
        Zero Stress.
      </h2>
      <p className="mt-4 max-w-[46ch] text-[13px] leading-relaxed text-[var(--s3-text-2)] md:text-[14px]">
        Our proven process keeps you moving and your business growing.
      </p>

      <ol className="mt-12 grid gap-6 md:grid-cols-2" role="list">
        {processScenes.map((scene) => (
          <li key={scene.id} className="border border-[var(--s3-border)] bg-[var(--s3-bg-1)] p-6">
            <div aria-hidden="true" className="h-40 w-full" style={sceneFallbackStyle(scene)} />
            <p className="mt-5 font-display text-[32px] font-semibold leading-none text-[var(--s3-brass-2)]">{scene.number}</p>
            <h3 className="mt-2 font-display text-[18px] font-semibold uppercase leading-[1.1] text-[var(--s3-ivory)]">
              {scene.titleLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--s3-text-2)]">{scene.description}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12">
        <SceneTimelineStatic />
      </div>
    </SectionContainer>
  );
}

export default function Section03HowItWorks() {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="relative border-t border-[var(--s3-border-brass)] bg-[var(--s3-bg-0)]"
    >
      {reduced ? <StaticStory /> : <CinematicViewport />}
    </section>
  );
}