import { LOADS, LOAD_BOARD_UPDATED_AT } from "@/data/hero";
import LoadRow from "@/components/landing/hero/LoadRow";

/*
  LAYER 6 — operational terminal panel.
  Demo data today; later fed by: API → typed response → normalization → LOADS.
*/
export default function LiveLoadBoard() {
  return (
    <aside
      aria-label="Live load board"
      className="reveal w-full rounded-[3px] border border-white/10 bg-ink-900/85 shadow-[0_12px_35px_rgba(0,0,0,0.22)] lg:w-[clamp(360px,28vw,470px)]"
      style={{ animationDelay: "500ms" }}
    >
      {/* header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="font-tech text-[11px] tracking-[0.18em] text-ivory-100">LIVE LOAD BOARD</span>
          <span className="flex items-center gap-1.5 font-tech text-[10px] tracking-[0.14em] text-status-live">
            <span aria-hidden="true" className="pulse-dot h-1.5 w-1.5 rounded-full bg-status-live" />
            LIVE
          </span>
        </div>
        <span className="font-tech text-[10px] tracking-[0.1em] text-steel-500">{LOAD_BOARD_UPDATED_AT}</span>
      </div>

      {/* rows */}
      <ul>
        {LOADS.map((load) => (
          <LoadRow key={load.id} load={load} />
        ))}
      </ul>

      {/* footer action */}
      <a
        href="#loads"
        className="group flex items-center justify-center gap-2 rounded-b-[3px] px-4 py-3 font-tech text-[11px] tracking-[0.18em] text-brass-300 transition-colors duration-150 hover:bg-white/[0.04] hover:text-brass-300"
      >
        VIEW ALL LOADS
        <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </a>
    </aside>
  );
}