import type { CSSProperties } from "react";
import { ShieldCheck } from "lucide-react";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function DispatchSecurity() {
  return (
    <div data-s6="security" className="flex items-start gap-4">
      <span className="s6-reveal grid h-9 w-9 shrink-0 place-items-center rounded-[2px] border border-[var(--s6-border)]" style={d(700)}>
        <ShieldCheck aria-hidden="true" className="h-4 w-4 text-[var(--s6-brass)]" strokeWidth={1.5} />
      </span>
      <div>
        <p className="s6-reveal text-[11px] font-semibold tracking-[0.1em] text-[var(--s6-warm-white)]" style={d(760)}>
          YOUR INFORMATION IS SAFE.
        </p>
        <p className="s6-reveal mt-1 text-[11px] leading-relaxed text-[var(--s6-muted-text)]" style={d(820)}>
          We never share your information. Your data is used only to serve you and get you moving.
        </p>
      </div>
    </div>
  );
}