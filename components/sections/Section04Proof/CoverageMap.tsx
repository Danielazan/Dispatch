import Image from "next/image";
import { section04Assets } from "./proofAssets";

/* Purely geographic layer — no stats/text inside (rendered by ProofStats). */
export default function CoverageMap() {
  const src = section04Assets.coverageMap;

  return (
    <div data-s4="map" className="relative min-h-0 flex-1" aria-hidden="true">
      {src ? (
        <Image src={src} alt="" fill sizes="(min-width:1200px) 28vw, 60vw" className="object-contain" />
      ) : (
        /* Fallback: restrained network silhouette until the real asset arrives */
        <svg viewBox="0 0 640 400" className="h-full w-full" fill="none" preserveAspectRatio="xMidYMid meet">
          <path
            d="M78 96 L170 88 L268 84 L352 92 L400 118 L448 108 L500 128 L560 96 L576 128 L548 176 L560 210 L528 252 L520 300 L500 344 L472 300 L430 282 L382 292 L330 300 L300 344 L268 300 L210 288 L148 268 L96 240 L64 190 L58 140 Z"
            fill="rgba(24,32,39,0.9)"
            stroke="rgba(214,201,176,0.22)"
            strokeWidth="1"
          />
          <g stroke="rgba(185,138,78,0.35)" strokeWidth="1">
            <path d="M80 120 L250 200 L380 160 L450 240" />
            <path d="M70 240 L280 260 L380 160" />
            <path d="M450 240 L545 170 L515 320" />
          </g>
          <g fill="#d4b06a">
            <circle cx="80" cy="120" r="2.2" className="pulse-dot" />
            <circle cx="380" cy="160" r="2.2" />
            <circle cx="280" cy="260" r="2.2" className="pulse-dot" />
            <circle cx="450" cy="240" r="2.2" />
            <circle cx="545" cy="170" r="2.2" className="pulse-dot" />
          </g>
          <g fill="#9ca3a7">
            <circle cx="70" cy="240" r="1.6" />
            <circle cx="150" cy="250" r="1.6" />
            <circle cx="250" cy="200" r="1.6" />
            <circle cx="420" cy="220" r="1.6" />
            <circle cx="515" cy="320" r="1.6" />
          </g>
        </svg>
      )}
    </div>
  );
}