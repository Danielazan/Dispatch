import type { CSSProperties } from "react";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function DispatchIntro() {
  return (
    <div data-s6="intro">
      <p className="s6-reveal text-[12px] font-semibold tracking-[0.14em] text-[var(--s6-brass)]" style={d(0)}>
        DISPATCH INTAKE
      </p>

      <h2
        id="lead-form-heading"
        className="mt-4 font-display text-[clamp(34px,3.6vw,54px)] font-semibold uppercase leading-[0.95] tracking-[0.01em] text-[var(--s6-warm-white)]"
      >
        <span className="s6-line"><span style={d(120)}>Ready to Get</span></span>
        <span className="s6-line"><span style={d(220)}>Dispatched?</span></span>
      </h2>

      <p className="s6-reveal mt-5 max-w-[36ch] text-[14px] leading-relaxed text-[var(--s6-muted-text)]" style={d(340)}>
        Let's get your truck moving. Fill out the form and we'll be in touch within 20 minutes.
      </p>

      {/* human support module */}
      <div className="mt-8 border-t border-[var(--s6-border)] pt-6">
        <p className="s6-reveal font-tech text-[10px] tracking-[0.2em] text-[var(--s6-muted-text)]" style={d(440)}>DISPATCH EXPERTS</p>
        <p className="s6-reveal mt-1 font-tech text-[10px] tracking-[0.2em] text-[var(--s6-muted-text)]" style={d(500)}>STANDING BY</p>
        <p className="s6-reveal mt-4 text-[13px] font-semibold tracking-[0.06em] text-[var(--s6-warm-white)]" style={d(560)}>
          REAL PEOPLE. REAL SUPPORT.
        </p>
        <p className="s6-reveal mt-2 max-w-[30ch] text-[12px] leading-relaxed text-[var(--s6-muted-text)]" style={d(620)}>
          When you reach out, a human specialist picks up. No bots. No queues.
        </p>
      </div>
    </div>
  );
}