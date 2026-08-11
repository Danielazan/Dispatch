import type { ReactNode } from "react";
import { EQUIPMENT, type EquipmentId } from "@/data/hero";

/* Technical line drawings — stroke 1.5, square caps. No cartoon treatment. */
const ICONS: Record<EquipmentId, ReactNode> = {
  "dry-van": (
    <>
      <rect x="2" y="6.5" width="12.5" height="8.5" />
      <path d="M14.5 15V8.5h3.8l3.2 3.2V15h-1.7" />
      <circle cx="6.5" cy="17" r="1.8" />
      <circle cx="16.8" cy="17" r="1.8" />
    </>
  ),
  reefer: (
    <>
      <rect x="2" y="6.5" width="12.5" height="8.5" />
      <path d="M5.5 9v4M8.75 9v4M12 9v4" />
      <path d="M14.5 15V8.5h3.8l3.2 3.2V15h-1.7" />
      <circle cx="6.5" cy="17" r="1.8" />
      <circle cx="16.8" cy="17" r="1.8" />
    </>
  ),
  flatbed: (
    <>
      <path d="M2 14.5h12.5" />
      <rect x="4" y="10" width="6.5" height="4.5" />
      <path d="M14.5 15V8.5h3.8l3.2 3.2V15h-1.7" />
      <circle cx="6.5" cy="17" r="1.8" />
      <circle cx="16.8" cy="17" r="1.8" />
    </>
  ),
  "power-only": (
    <>
      <path d="M2.5 15V8h6.2l3.3 4.3h7.5V15h-1.8" />
      <circle cx="7" cy="17" r="1.8" />
      <circle cx="16.5" cy="17" r="1.8" />
    </>
  ),
  hotshot: (
    <>
      <path d="M2.5 14.5v-3h3.4l2-2.8h4.6v5.8" />
      <path d="M12.5 13.5c2.6 0 3.2-1.6 5.6-1.6h3.4v2.6" />
      <circle cx="6" cy="17" r="1.8" />
      <circle cx="17.5" cy="17" r="1.8" />
    </>
  ),
  "box-truck": (
    <>
      <rect x="2.5" y="5.5" width="10.5" height="9.5" />
      <path d="M13 15V9.5h4l3 3V15h-1.6" />
      <circle cx="6.5" cy="17" r="1.8" />
      <circle cx="16.6" cy="17" r="1.8" />
    </>
  ),
};

export default function EquipmentDispatch() {
  return (
    <div className="reveal mt-10" style={{ animationDelay: "630ms" }}>
      <p className="font-tech text-[10px] tracking-[0.22em] text-brass-400">EQUIPMENT WE DISPATCH</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {EQUIPMENT.map((item) => (
          <li key={item.id}>
            <span className="group flex cursor-default items-center gap-2 rounded-[2px] border border-white/10 bg-ink-900/60 px-3 py-2 text-[11px] tracking-[0.12em] text-ivory-100 transition-all duration-200 hover:-translate-y-[1px] hover:border-white/25">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 text-steel-300 transition-colors duration-200 group-hover:text-brass-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
                strokeLinejoin="miter"
              >
                {ICONS[item.id]}
              </svg>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}