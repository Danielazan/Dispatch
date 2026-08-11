export default function PricingIntro() {
  return (
    <div data-plane="details" className="min-w-0 min-[1024px]:pr-6 min-[1280px]:pr-10">
      <p data-s5="eyebrow" className="text-[12px] font-semibold tracking-[0.14em] text-[var(--s5-brass)]">
        PRICING
      </p>

      <h2
        id="pricing-heading"
        className="s5-heading mt-4 font-display font-semibold uppercase tracking-[0.01em] text-[var(--s5-charcoal)]"
      >
        <span data-s5="line1" className="block overflow-hidden">
          <span className="block">Simple.</span>
        </span>
        <span data-s5="line2" className="block overflow-hidden">
          <span className="block">Fair.</span>
        </span>
        <span data-s5="line3" className="block overflow-hidden">
          <span className="block">Transparent.</span>
        </span>
      </h2>

      <p data-s5="copy" className="mt-5 max-w-[26ch] text-[13px] leading-relaxed text-[var(--s5-muted)]">
        No hidden fees. No surprises.
        <br />
        Just results.
      </p>

      <div className="mt-7">
        <span data-s5="cta-line" className="block h-px w-full origin-left bg-[var(--s5-brass-muted)]" />
        <a
          data-s5="cta-btn"
          href="#pricing-plans"
          className="group mt-4 inline-flex items-center gap-3 border border-[var(--s5-border-2)] px-5 py-3 text-[11px] font-semibold tracking-[0.16em] text-[var(--s5-charcoal)] transition-colors duration-300 hover:border-[var(--s5-brass)] hover:text-[var(--s5-brass-muted)]"
        >
          COMPARE PLANS
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      </div>
    </div>
  );
}