import { carriers } from "./proofData";

export default function CarrierTrustRow() {
  return (
    <div className="border-t border-[var(--s4-border)] pt-5">
      <p data-s4="trustlabel" className="font-tech text-[10px] tracking-[0.22em] text-[var(--s4-muted)]">
        TRUSTED BY CARRIERS ACROSS NORTH AMERICA
      </p>
      <ul className="mt-4 flex flex-wrap items-center gap-x-10 gap-y-3" role="list">
        {carriers.map((c, i) => (
          <li key={c.id}>
            <span
              data-logo={i}
              className={`block text-[15px] text-[#b7b8b5] transition-colors duration-300 hover:text-[var(--s4-white)] ${c.className}`}
            >
              {c.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}