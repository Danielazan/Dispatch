import type { CSSProperties } from "react";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function DispatchResponse() {
  return (
    <div data-s6="response" className="rounded-[3px] border border-[var(--s6-border)] p-5 text-center">
      <p className="s6-reveal font-tech text-[9px] tracking-[0.2em] text-[var(--s6-muted-text)]" style={d(880)}>
        RESPONDING WITHIN
      </p>
      <span className="s6-clock mt-2">
        <span style={d(980)} className="font-display text-[42px] font-semibold leading-none text-[var(--s6-champagne)]">20</span>
      </span>
      <span className="s6-clock">
        <span style={d(1100)} className="font-display text-[14px] font-semibold tracking-[0.08em] text-[var(--s6-warm-white)]">MINUTES</span>
      </span>
      <p className="s6-reveal mt-1 font-tech text-[9px] tracking-[0.18em] text-[var(--s6-brass)]" style={d(1220)}>
        GUARANTEED
      </p>
      <span aria-hidden="true" className="s6-rule mx-auto mt-2 block h-px w-10 bg-[var(--s6-brass)]" style={d(1320)} />
    </div>
  );
}