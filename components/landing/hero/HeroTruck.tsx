/*
  Placeholder truck silhouette (dusk backlit treatment).
  Rendered ONLY while assets.hero.background is null.
  When the real photograph is connected, this component is skipped entirely.
*/
export default function HeroTruck({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 980 340"
      className={className}
      role="img"
      aria-label="Ironhaul Dispatch truck operating on a highway at dusk"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <radialGradient id="head-glow" cx="0%" cy="50%" r="80%">
          <stop offset="0%" stopColor="#d8b878" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#d8b878" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="body-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2027" />
          <stop offset="100%" stopColor="#0b0e11" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="520" cy="316" rx="470" ry="14" fill="#05070a" opacity="0.7" />

      {/* headlight cone */}
      <path d="M196 172 L40 208 L40 268 L196 194 Z" fill="url(#head-glow)" />

      {/* trailer */}
      <rect x="360" y="70" width="590" height="165" fill="url(#body-sheen)" />
      <line x1="360" y1="70.5" x2="950" y2="70.5" stroke="#2a3037" strokeWidth="1.5" />
      <line x1="360" y1="235" x2="950" y2="235" stroke="#05070a" strokeWidth="2" />

      {/* cab (conventional, facing left) */}
      <path
        d="M360 235 V95 H306 Q299 95 295 102 L273 148 H206 Q199 148 198 156 L194 235 Z"
        fill="url(#body-sheen)"
      />
      {/* rim light on roof / hood */}
      <path d="M306 95.5 H360 M273 148.5 H206" stroke="#c5aa76" strokeWidth="1.2" opacity="0.22" fill="none" />
      {/* windshield hint */}
      <path d="M297 104 L278 144 H296 Z" fill="#141a20" />
      {/* bumper + headlight */}
      <rect x="188" y="212" width="10" height="23" fill="#05070a" />
      <rect x="195" y="170" width="5" height="10" fill="#d8b878" opacity="0.9" />
      {/* exhaust stack */}
      <rect x="352" y="98" width="5" height="137" fill="#0d1116" />

      {/* wheels */}
      {[240, 396, 792, 852].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="290" r="26" fill="#05070a" />
          <circle cx={cx} cy="290" r="10" fill="none" stroke="#232a31" strokeWidth="2" />
        </g>
      ))}
    </svg>
  );
}