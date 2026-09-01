export default function HeroContent() {
  return (
    <div>
      <p
        className="reveal flex items-center gap-3 font-tech text-[11px] tracking-[0.24em] text-brass-400"
        style={{ animationDelay: "150ms" }}
      >
        <span aria-hidden="true" className="h-px w-6 bg-brass-500/60" />
        FREIGHT DISPATCH SERVICES
      </p>

      <h1 className="hero-headline mt-6 font-display font-semibold uppercase text-ivory-50">
        <span className="block reveal" style={{ animationDelay: "230ms" }}>Strategic Dispatch,</span>
        <span className="block reveal" style={{ animationDelay: "310ms" }}>stronger miles.</span>
      </h1>

      <p
        className="reveal mt-6 max-w-[46ch] text-[15px] leading-relaxed text-steel-300"
        style={{ animationDelay: "470ms" }}
      >
        We handle the calls, negotiation, and paperwork so you can focus on
        what mattersÃ¢â‚¬â€driving and growing your business.
      </p>
    </div>
  );
}