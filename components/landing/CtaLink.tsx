import type { ReactNode } from "react";

interface CtaLinkProps {
  href: string;
  variant: "solid" | "ghost";
  size?: "md" | "sm";
  withArrow?: boolean;
  children: ReactNode;
}

export default function CtaLink({ href, variant, size = "md", withArrow = false, children }: CtaLinkProps) {
  const base =
    "group inline-flex items-center rounded-[2px] text-[12px] font-semibold tracking-[0.16em] transition-colors duration-200";
  const sizing = size === "md" ? "px-6 py-3.5" : "px-4 py-2";
  const skin =
    variant === "solid"
      ? "bg-ivory-50 text-ink-950 hover:bg-ivory-200"
      : "border border-white/15 bg-ink-950/40 text-ivory-100 hover:border-white/30 hover:bg-ink-900/60";

  return (
    <a href={href} className={`${base} ${sizing} ${skin}`}>
      <span>{children}</span>
      {withArrow && (
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="ml-3 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
        </svg>
      )}
      {variant === "ghost" && (
        <span
          aria-hidden="true"
          className="ml-4 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/20 text-steel-300 transition-colors duration-200 group-hover:border-brass-400 group-hover:text-brass-300"
        >
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 6h8M6 2.5 9.5 6 6 9.5" />
          </svg>
        </span>
      )}
    </a>
  );
}