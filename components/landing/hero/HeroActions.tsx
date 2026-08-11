import CtaLink from "@/components/landing/CtaLink";

export default function HeroActions() {
  return (
    <div className="reveal mt-8 flex flex-wrap items-center gap-4" style={{ animationDelay: "550ms" }}>
      <CtaLink href="#lead-form" variant="solid" withArrow>
        GET DISPATCHED
      </CtaLink>
      <CtaLink href="#how-it-works" variant="ghost">
        SEE HOW IT WORKS
      </CtaLink>
    </div>
  );
}