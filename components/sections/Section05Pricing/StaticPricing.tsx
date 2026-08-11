import SectionContainer from "@/components/landing/SectionContainer";
import PricingIntro from "./PricingIntro";
import PricingPlans from "./PricingPlans";
import PricingAssurances from "./PricingAssurances";

export default function StaticPricing() {
  return (
    <div className="s5-paper bg-[var(--s5-ivory)]">
      <SectionContainer className="py-16 md:py-20 min-[1024px]:py-24">
        <div className="grid min-w-0 gap-12 min-[1024px]:grid-cols-[minmax(0,1.05fr)_minmax(0,3fr)_minmax(0,0.9fr)] min-[1024px]:gap-6 min-[1280px]:gap-8">
          <PricingIntro />
          <PricingPlans />
          <div className="min-w-0 border-t border-[var(--s5-border)] pt-8 min-[1024px]:border-t-0 min-[1024px]:pt-0">
            <PricingAssurances />
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}