import { assurances } from "./pricingData";

export default function PricingAssurances() {
  return (
    <ul
      role="list"
      className="grid min-w-0 grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-1 lg:content-center lg:gap-9 lg:pl-6 min-[1280px]:pl-8"
    >
      {assurances.map((a, i) => {
        const Icon = a.icon;
        return (
          <li key={a.id} data-assure={i} className="flex min-w-0 items-start gap-4">
            <span className="relative grid h-10 w-10 shrink-0 place-items-center">
              <svg aria-hidden="true" viewBox="0 0 40 40" className="absolute inset-0 h-full w-full -rotate-90">
                <circle
                  data-assure-circle={i}
                  cx="20"
                  cy="20"
                  r="19"
                  pathLength={100}
                  fill="none"
                  stroke="rgba(185,138,78,0.55)"
                  strokeWidth="1"
                  strokeDasharray="100"
                  strokeDashoffset="100"
                />
              </svg>
              <Icon data-assure-icon={i} aria-hidden="true" className="h-4 w-4 text-[var(--s5-brass)]" strokeWidth={1.5} />
            </span>
            <span className="min-w-0">
              <span data-assure-text={i} className="block text-[12px] font-semibold tracking-[0.1em] text-[var(--s5-charcoal)]">
                {a.title}
              </span>
              <span data-assure-desc={i} className="mt-1 block text-[11.5px] leading-relaxed text-[var(--s5-muted)]">
                {a.description}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}