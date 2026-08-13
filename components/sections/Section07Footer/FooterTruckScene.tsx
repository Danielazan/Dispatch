"use client";

import { useState } from "react";
import Image from "next/image";
import { footerAssets } from "./footerData";

/* THE FINAL CINEMATIC SHOT:
   truck image (masked reveal + dissolve overlays) → route line → signal → phrase. */
export default function FooterTruckScene() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="relative mt-16 md:mt-20">
      {/* ---- final truck image — right visual zone ---- */}
      <div data-s7="truck-lum" className="relative ml-auto w-full md:w-[54%]">
        <div data-s7="truck-mask" className="relative aspect-[16/7] w-full overflow-hidden md:aspect-[160/62]">
          <div data-s7="truck-inner" className="absolute inset-0 will-change-transform">
            {imgFailed ? (
              /* Image failure fallback (§51) — stable dark graphite panel */
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[var(--s7-graphite)]">
                <span aria-hidden="true" className="h-px w-24 bg-[var(--s7-border-brass)]" />
                <p className="font-display text-[15px] tracking-[0.26em] text-[var(--s7-muted-text)]">IRONHAUL</p>
                <p className="font-tech text-[9px] tracking-[0.3em] text-[var(--s7-brass)]">THE ROAD CONTINUES.</p>
              </div>
            ) : (
              <Image
                src={footerAssets.truck}
                alt="Ironhaul freight truck traveling on a highway at night."
                fill
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="object-cover object-[70%_center]"
                onError={() => setImgFailed(true)}
              />
            )}
          </div>

          {/* ---- layered dissolve — the image embeds into the footer (§12) ---- */}
          {!imgFailed && (
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, #090D10 0%, rgba(9,13,16,0.78) 14%, rgba(9,13,16,0.22) 40%, rgba(9,13,16,0) 60%)",
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
                style={{
                  background:
                    "linear-gradient(to top, #090D10 0%, rgba(9,13,16,0.4) 34%, rgba(9,13,16,0) 100%)",
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-1/3"
                style={{ background: "linear-gradient(to bottom, rgba(9,13,16,0.55), rgba(9,13,16,0))" }}
              />
            </>
          )}
        </div>
      </div>

      {/* ---- route line — the central metaphor (§13). Uniform scale keeps nodes round. ---- */}
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 96"
        fill="none"
        className="relative z-10 -mt-7 block h-auto w-full md:-mt-10"
      >
        <path
          data-s7="route-path"
          d="M 0 72 C 250 72 390 50 570 41 C 730 33 810 28 886 24"
          pathLength={1}
          stroke="rgba(185,138,78,0.6)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
        {/* origin + waypoint nodes */}
        <circle cx="1" cy="72" r="2" fill="rgba(185,138,78,0.45)" />
        <circle cx="570" cy="41" r="1.6" fill="rgba(185,138,78,0.3)" />
        {/* destination ring — responds subtly on arrival */}
        <circle
          data-s7="route-end"
          cx="886"
          cy="24"
          r="5"
          stroke="rgba(212,176,106,0.55)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
        <circle cx="886" cy="24" r="1.5" fill="rgba(212,176,106,0.65)" />
        {/* dispatch signal — GSAP-owned, travels once */}
        <circle data-s7="signal-dot" cx="0" cy="0" r="2.4" fill="#D4B06A" opacity="0" />
      </svg>

      {/* ---- emotional epilogue (§17) ---- */}
      <p
        data-s7="phrase"
        className="mt-5 text-[11px] tracking-[0.3em] text-[var(--s7-muted-text)] md:mt-6 md:ml-auto md:w-[54%] md:pl-1 md:text-[12px]"
      >
        IRONHAUL KEEPS MOVING.
      </p>
    </div>
  );
}