import Image from "next/image";
import { assets } from "@/config/assets";

/*
  LAYER 2 — atmospheric North-American route visualization.
  Anchored to the BOTTOM-RIGHT of the hero scene, tucked under the
  load board exactly as in the reference.
  Inline SVG fallback; swap in a raster via assets.hero.routeMap
  without touching the hero layout.
*/
export default function RouteMap() {
  const src = assets.hero.routeMap;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 right-0 z-10 hidden h-[150px] w-[58%] max-w-[760px] opacity-50 mix-blend-screen md:block lg:h-[190px]"
    >
      {src ? (
        <Image src={src} alt="" fill className="object-cover object-right-bottom" />
      ) : (
        <svg viewBox="0 0 960 260" preserveAspectRatio="none" className="h-full w-full" fill="none">
          {/* thin network */}
          <g stroke="#394149" strokeWidth="1" opacity="0.55">
            <path d="M60 150 L200 90 L340 160 L480 70 L640 140 L800 80 L920 150" />
            <path d="M60 150 L260 210 L340 160" />
            <path d="M260 210 L560 220 L640 140" />
            <path d="M560 220 L760 210 L920 150" />
            <path d="M760 210 L800 80" />
          </g>
          {/* hubs */}
          <g fill="#73787a">
            <circle cx="200" cy="90" r="2" />
            <circle cx="480" cy="70" r="2" />
            <circle cx="800" cy="80" r="2" />
            <circle cx="260" cy="210" r="2" />
            <circle cx="560" cy="220" r="2" />
            <circle cx="760" cy="210" r="2" />
          </g>
          {/* highlighted lane */}
          <path
            d="M60 150 L340 160 L640 140 L920 150"
            stroke="#b69a68"
            strokeWidth="1.5"
            opacity="0.8"
            className="route-dash"
          />
          <circle cx="60" cy="150" r="2.5" fill="#c5aa76" />
          <circle cx="920" cy="150" r="2.5" fill="#c5aa76" />
        </svg>
      )}
    </div>
  );
}