"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { buildMasterTimeline, getActiveScene } from "./animations";
import { cinematicConfig } from "./cinematicConfig";
import { processScenes } from "./sceneData";
import SceneBackground from "./SceneBackground";
import SceneContent from "./SceneContent";
import SceneTimeline from "./SceneTimeline";
import Atmosphere from "./Atmosphere";

export default function CinematicViewport() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const debugRef = useRef<HTMLDivElement | null>(null);
  const [activeScene, setActiveScene] = useState(0);

  useEffect(() => {
    const scope = viewportRef.current;
    const track = trackRef.current;
    if (!scope || !track) return;

    const onProgress = (p: number) => {
      if (debugRef.current) {
        debugRef.current.textContent = `SCROLL ${p.toFixed(2)} · SCENE 0${getActiveScene(p) + 1}`;
      }
      const next = getActiveScene(p);
      setActiveScene((prev) => (prev === next ? prev : next)); // discrete only
    };

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const tl = buildMasterTimeline(scope, track, 1, onProgress);
      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    });
    mm.add("(max-width: 767px)", () => {
      const tl = buildMasterTimeline(scope, track, 0.5, onProgress); // reduced camera travel
      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={trackRef} className="relative" style={{ height: cinematicConfig.trackHeight }}>
      <div
        ref={viewportRef}
        data-active-scene={activeScene + 1}
        className="sticky top-0 h-[100svh] overflow-hidden bg-[var(--s3-bg-0)]"
      >
        {/* z-10 scene layers (all four live simultaneously) */}
        {processScenes.map((scene, i) => (
          <SceneBackground key={scene.id} scene={scene} index={i} />
        ))}

        {/* z-20/30 atmosphere */}
        <Atmosphere />

        {/* z-40 anchored editorial block */}
        <div data-s3-ed="block" className="absolute left-[clamp(24px,4vw,64px)] top-[10svh] z-40 max-w-[440px]">
          <p data-s3-ed="eyebrow" className="text-[12px] font-semibold tracking-[0.14em] text-[var(--s3-brass)]" style={{ opacity: 0 }}>
            HOW IT WORKS
          </p>
          <h2
            id="how-it-works-heading"
            className="mt-4 font-display text-[clamp(34px,3.6vw,54px)] font-semibold uppercase leading-[0.95] tracking-[0.01em] text-[var(--s3-ivory)]"
          >
            <span data-s3-ed="line1" className="block overflow-hidden">
              <span className="block">Four Steps.</span>
            </span>
            <span data-s3-ed="line2" className="block overflow-hidden">
              <span className="block">Zero Stress.</span>
            </span>
          </h2>
          <p data-s3-ed="copy" className="mt-4 max-w-[36ch] text-[13px] leading-relaxed text-[var(--s3-text-2)] md:text-[14px]" style={{ opacity: 0 }}>
            Our proven process keeps you moving and your business growing.
          </p>
          <a
            data-s3-ed="cta"
            href="#pricing"
            className="group mt-6 inline-flex items-center gap-3 border border-[var(--s3-border-brass)] bg-[rgba(11,15,18,0.35)] px-5 py-3 text-[11px] font-semibold tracking-[0.16em] text-[var(--s3-ivory)] transition-colors duration-300 hover:border-[var(--s3-brass-3)] hover:bg-[var(--s3-brass)] hover:text-[#111518] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--s3-brass-2)]"
            style={{ opacity: 0 }}
          >
            LEARN MORE
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>

        {/* z-40 scene narration */}
        {processScenes.map((scene, i) => (
          <SceneContent key={scene.id} scene={scene} index={i} />
        ))}

        {/* z-60 process timeline */}
        <SceneTimeline />
      </div>

      {cinematicConfig.debug && (
        <div
          ref={debugRef}
          className="fixed bottom-4 right-4 z-[90] border border-[var(--s3-border)] bg-[rgba(11,15,18,0.85)] px-3 py-2 font-tech text-[10px] tracking-[0.14em] text-[var(--s3-text-2)]"
        />
      )}
    </div>
  );
}