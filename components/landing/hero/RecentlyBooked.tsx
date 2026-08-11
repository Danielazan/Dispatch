import { RECENT_BOOKINGS } from "@/data/hero";

function TickerRun({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex items-center">
      {RECENT_BOOKINGS.map((b) => (
        <li key={b.route} className="flex items-center whitespace-nowrap px-6 font-tech text-[11px] tracking-[0.06em]">
          <span className="text-ivory-200">{b.route}</span>
          <span className="ml-3 text-brass-300">{b.rate}</span>
          <span aria-hidden="true" className="ml-6 h-3 w-px bg-white/10" />
        </li>
      ))}
    </ul>
  );
}

export default function RecentlyBooked() {
  return (
    <div className="ticker relative z-20 flex items-stretch border-t border-white/10 bg-ink-950">
      <p className="flex shrink-0 items-center border-r border-white/10 px-5 py-3 font-tech text-[10px] tracking-[0.22em] text-brass-400 lg:px-8">
        RECENTLY BOOKED
      </p>
      <div className="relative flex-1 overflow-hidden">
        {/* edge fades */}
        <div aria-hidden="true" className="absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-ink-950 to-transparent" />
        <div aria-hidden="true" className="absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-ink-950 to-transparent" />
        <div className="ticker-track flex w-max items-center py-0.5">
          <TickerRun />
          <TickerRun hidden />
        </div>
      </div>
    </div>
  );
}