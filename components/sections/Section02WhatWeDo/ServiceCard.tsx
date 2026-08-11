import type { CSSProperties } from "react";
import Image from "next/image";
import type { ServiceItem } from "./serviceData";
import { S2_TIMINGS } from "./section02Animations";

export default function ServiceCard({ service, index }: { service: ServiceItem; index: number }) {
  const Icon = service.icon;
  const active = index === 0; // First card subtly emphasized (Section 24)

  return (
    <li
      className="s2-reveal"
      style={{ "--d": `${S2_TIMINGS.cardBase + index * S2_TIMINGS.cardStep}ms` } as CSSProperties}
    >
      <div
        className={`service-card group relative flex h-full flex-col items-center px-5 py-7 text-center min-[1200px]:min-h-[200px] border-b border-r border-[var(--ironhaul-border)] transition-all duration-500 ease-out hover:-translate-y-1 ${
          active 
            ? "bg-[var(--ironhaul-ivory-light)] hover:bg-[var(--ironhaul-hover)]" 
            : "bg-[var(--ironhaul-ivory)] hover:bg-[var(--ironhaul-hover)]"
        }`}
      >
        {/* Editorial index cue (Section 55) */}
        <span
          aria-hidden="true"
          className="absolute right-3 top-2.5 font-tech text-[10px] tracking-[0.12em] text-[var(--ironhaul-border-muted)]"
        >
          {service.number}
        </span>

        <div className="flex flex-col items-center">
          {service.image ? (
            <span className="relative h-9 w-9">
              <Image src={service.image} alt="" fill sizes="36px" className="object-contain" />
            </span>
          ) : (
            <Icon
              aria-hidden="true"
              size={34}
              strokeWidth={1.5}
              className={`transition-colors duration-500 group-hover:text-[var(--ironhaul-brass)] ${
                active ? "text-[var(--ironhaul-charcoal)]" : "text-[var(--ironhaul-charcoal-3)]"
              }`}
            />
          )}

          <h3 className="mt-5 font-display text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--ironhaul-charcoal)] transition-colors duration-500 group-hover:text-[var(--ironhaul-brass-deep)]">
            {service.title}
          </h3>

          <p className="mt-3 max-w-[24ch] text-[12px] leading-[1.55] text-[var(--ironhaul-text-secondary-2)] transition-colors duration-500 group-hover:text-[var(--ironhaul-text-secondary)]">
            {service.description}
          </p>
        </div>

        {/* Thin brass indicator (Section 22 / 59) */}
        <span
          aria-hidden="true"
          className={`absolute -bottom-px left-0 h-[2px] w-full origin-left bg-[var(--ironhaul-brass)] transition-transform duration-[420ms] ease-out ${
            active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`}
        />
      </div>
    </li>
  );
}