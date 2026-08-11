import { Star } from "lucide-react";
import { proofStats } from "./proofData";

export default function ProofStats() {
  return (
    <div data-s4="stats" className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-3">
      {proofStats.map((s) => (
        <div key={s.key}>
          <p className="flex items-center gap-1.5 font-display text-[24px] font-semibold leading-none text-[var(--s4-white)] min-[1200px]:text-[22px]">
            <span data-stat={s.key}>{s.value}</span>
            {s.star && (
              <Star aria-hidden="true" className="h-3.5 w-3.5 text-[var(--s4-champagne)]" fill="currentColor" strokeWidth={0} />
            )}
          </p>
          <p className="mt-1.5 font-tech text-[9px] leading-[1.5] tracking-[0.16em] text-[var(--s4-muted)]">
            {s.labelLines[0]}
            <br />
            {s.labelLines[1]}
          </p>
        </div>
      ))}
    </div>
  );
}