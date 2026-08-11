import type { CSSProperties } from "react";
import { S2_TIMINGS } from "./section02Animations";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function Section02Intro() {
  return (
    <div className="min-[1200px]:pr-6">
      <p
        className="s2-reveal text-[12px] font-semibold tracking-[0.14em] text-[var(--ironhaul-brass)]"
        style={d(S2_TIMINGS.eyebrow)}
      >
        WHAT WE DO
      </p>

      <h2
        id="what-we-do-heading"
        className="mt-4 font-display text-[clamp(32px,2.9vw,44px)] font-semibold uppercase leading-[0.95] tracking-[0.01em] text-[var(--ironhaul-charcoal)]"
      >
        <span className="s2-line">
          <span style={d(S2_TIMINGS.headingLine1)}>Dispatch That</span>
        </span>
        <span className="s2-line">
          <span style={d(S2_TIMINGS.headingLine2)}>Delivers Results.</span>
        </span>
      </h2>

      <span 
        aria-hidden="true" 
        className="s2-rule mt-6 block h-px w-16 bg-[var(--ironhaul-brass)]" 
        style={d(S2_TIMINGS.rule)} 
      />
    </div>
  );
}