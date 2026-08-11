import type { Load, LoadStatus } from "@/data/hero";

const STATUS_META: Record<LoadStatus, { label: string; dot: string; text: string }> = {
  negotiating: { label: "NEGOTIATING", dot: "bg-brass-400", text: "text-brass-300" },
  available: { label: "AVAILABLE", dot: "bg-status-available", text: "text-status-available" },
  booked: { label: "BOOKED", dot: "bg-status-booked", text: "text-status-booked" },
};

export default function LoadRow({ load }: { load: Load }) {
  const meta = STATUS_META[load.status];

  return (
    <li className="border-b border-white/5 px-4 py-3.5 transition-colors duration-150 hover:bg-white/[0.03]">
      {/* status + id */}
      <div className="flex items-center justify-between">
        <span className={`flex items-center gap-2 font-tech text-[10px] tracking-[0.16em] ${meta.text}`}>
          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
          {meta.label}
        </span>
        <span className="font-tech text-[10px] tracking-[0.12em] text-steel-500">#{load.id}</span>
      </div>

      {/* connected route line */}
      <div className="mt-2.5 flex items-center gap-3">
        <span className="text-[12.5px] font-semibold tracking-[0.06em] text-ivory-100">{load.pickup}</span>
        <svg aria-hidden="true" viewBox="0 0 100 8" preserveAspectRatio="none" className="h-2 min-w-6 flex-1">
          <line x1="0" y1="4" x2="93" y2="4" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
          <path d="M93 1 L99 4 L93 7" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        </svg>
        <span className="text-[12.5px] font-semibold tracking-[0.06em] text-ivory-100">{load.dropoff}</span>
      </div>

      {/* metrics */}
      <dl className="mt-3 grid grid-cols-4 gap-2">
        {[
          { label: "RATE", value: load.rate, accent: true },
          { label: "RPM", value: load.ratePerMile },
          { label: "DIST", value: load.distance },
          { label: "EQPT", value: load.equipment },
        ].map((m) => (
          <div key={m.label} className="min-w-0">
            <dt className="font-tech text-[9px] tracking-[0.18em] text-steel-500">{m.label}</dt>
            <dd className={`mt-0.5 truncate font-tech text-[11.5px] ${m.accent ? "text-brass-300" : "text-steel-300"}`}>
              {m.value}
            </dd>
          </div>
        ))}
      </dl>
    </li>
  );
}