import { Star } from "lucide-react";
import type { Testimonial } from "./proofData";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .replace(".", "");
}

export default function TestimonialCard({ t, index }: { t: Testimonial; index: number }) {
  return (
    <article
      data-card={index}
      className="group flex h-full flex-col rounded-[2px] border border-[var(--s4-border)] bg-[rgba(17,24,32,0.88)] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--s4-border-2)] hover:bg-[var(--s4-bg-2)]"
    >
      {/* stars */}
      <div data-part="stars" className="flex gap-1" aria-label={`${t.rating} star rating`}>
        {Array.from({ length: t.rating }).map((_, s) => (
          <Star
            key={s}
            data-star={s}
            aria-hidden="true"
            className="h-3 w-3 text-[var(--s4-champagne)]"
            fill="currentColor"
            strokeWidth={0}
          />
        ))}
      </div>

      {/* quote */}
      <blockquote data-part="quote" className="mt-4 flex-1 text-[11.5px] leading-[1.6] text-[var(--s4-muted)]">
        {t.quote}
      </blockquote>

      {/* person */}
      <footer data-part="person" className="mt-5 flex items-center gap-3">
        <span
          data-part="portrait"
          className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[var(--s4-border-2)] bg-[var(--s4-bg-3)] transition-transform duration-300 group-hover:scale-[1.025]"
        >
          {t.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={t.image} alt={`Portrait of ${t.name}`} className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center font-tech text-[11px] tracking-[0.08em] text-[var(--s4-muted)]">
              {initials(t.name)}
            </span>
          )}
        </span>
        <span>
          <span data-part="name" className="block text-[12px] font-semibold tracking-[0.06em] text-[var(--s4-white)]">
            {t.name}
          </span>
          <span data-part="role" className="mt-0.5 block text-[10.5px] leading-snug text-[var(--s4-muted)]">
            {t.role}
            <br />
            {t.equipment}
          </span>
        </span>
      </footer>
    </article>
  );
}