import { Check } from "lucide-react";
import type { PricingPlan } from "./pricingData";

const handlePlanCta = (planId: string) => {
  // TODO: connect to onboarding / contact flow (lead form / CRM)
  void planId;
};

export default function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
  return (
    <article
      data-plan={index}
      
      className={`relative flex h-full min-w-0 flex-col overflow-hidden rounded-[2px] border p-6 transition-transform duration-300 ${
        plan.featured
          ? "border-[var(--s5-brass-muted)] bg-[var(--s5-cream)] shadow-[0_10px_28px_rgba(11,16,20,0.08)] hover:-translate-y-[3px] min-[1024px]:-mt-4 min-[1024px]:h-[calc(100%+1rem)]"
          : "border-[var(--s5-border)] bg-[var(--s5-cream)] shadow-[0_6px_18px_rgba(11,16,20,0.05)] hover:-translate-y-[2px] hover:border-[var(--s5-border-2)]"
      }`}
    >
      {/* brass label strip (featured) — draws itself during the brass lock */}
      {plan.featured && (
        <div data-featured-strip className="absolute inset-x-0 top-0 origin-left bg-[var(--s5-brass)]">
          <span
            data-featured-badge
            className="flex h-7 items-center justify-center text-[10px] font-semibold tracking-[0.22em] text-[#111820]"
          >
            {plan.badge}
          </span>
        </div>
      )}

      {/* precision scanner beam */}
      <span aria-hidden="true" data-scan={index} className="s5-scan pointer-events-none absolute inset-y-0 left-0 w-1/3 opacity-0" />

      <div className={plan.featured ? "pt-8" : ""}>
        <h3 className="text-[12px] font-semibold tracking-[0.14em] text-[var(--s5-graphite)]">{plan.name}</h3>

        <p className="mt-5 font-display text-[46px] font-semibold leading-none text-[var(--s5-charcoal)]">{plan.price}</p>
        <p className="mt-1.5 text-[11px] tracking-[0.14em] text-[var(--s5-muted)]">{plan.unit}</p>

        <div className="mt-5 border-t border-[var(--s5-border)]" />

        <p className="mt-4 text-[12px] leading-relaxed text-[var(--s5-muted)]">{plan.description}</p>

        <ul className="mt-4 space-y-2.5" role="list">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[12px] leading-snug text-[var(--s5-deep)]">
              <Check aria-hidden="true" className="mt-0.5 h-3 w-3 shrink-0 text-[var(--s5-brass)]" strokeWidth={2} />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={() => handlePlanCta(plan.id)}
          className={`group flex w-full items-center justify-center gap-2 px-4 py-3 text-[11px] font-semibold tracking-[0.16em] transition-colors duration-300 ${
            plan.featured
              ? "bg-[var(--s5-brass)] text-[#111820] hover:bg-[var(--s5-champagne)]"
              : "border border-[var(--s5-border-2)] text-[var(--s5-charcoal)] hover:border-[var(--s5-brass)] hover:text-[var(--s5-brass-muted)]"
          }`}
        >
          {plan.cta}
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </article>
  );
}