import type { ReactNode } from "react";
import { HERO_STATS, type StatId } from "@/data/hero";

const ICONS: Record<StatId, ReactNode> = {
  carriers: (
    <>
      <rect x="2" y="7" width="11" height="8" />
      <path d="M13 15V9.5h3.6l3 3V15h-1.6" />
      <circle cx="6.5" cy="17" r="1.7" />
      <circle cx="16.4" cy="17" r="1.7" />
    </>
  ),
  rate: <path d="M12 3v18M16.5 6.5H9.75a3.25 3.25 0 0 0 0 6.5h4.5a3.25 3.25 0 0 1 0 6.5H7" />,
  response: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  ontime: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.2 11 14.7 15.5 9.5" />
    </>
  ),
};

/* One continuous strip — not four floating cards. */
export default function HeroStats() {
  const borders = [
    "",
    "border-l border-white/10",
    "border-t border-white/10 lg:border-t-0 lg:border-l",
    "border-l border-t border-white/10 lg:border-t-0",
  ];

  return (
    <div className="relative z-20 border-t border-white/10 bg-ink-950/95">
      <dl className="mx-auto grid max-w-[1440px] grid-cols-2 lg:grid-cols-4">
        {HERO_STATS.map((stat, i) => (
          <div key={stat.id} className={`reveal flex flex-col gap-2.5 px-6 py-5 lg:px-10 ${borders[i]}`} style={{ animationDelay: `${700 + i * 70}ms` }}>
            <dt className="flex items-center gap-2.5 font-tech text-[10px] tracking-[0.18em] text-steel-500">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 text-brass-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              >
                {ICONS[stat.id]}
              </svg>
              {stat.label}
            </dt>
            <dd className="font-display text-[26px] font-semibold leading-none text-ivory-50 lg:text-[30px]">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}