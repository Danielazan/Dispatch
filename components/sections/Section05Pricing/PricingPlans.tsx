import PricingCard from "./PricingCard";
import { pricingPlans } from "./pricingData";

export default function PricingPlans() {
  return (
    <div
      data-plane="cards"
      id="pricing-plans"
      className="grid min-w-0 scroll-mt-24 gap-5 md:grid-cols-3 min-[1024px]:items-stretch min-[1024px]:gap-4 min-[1280px]:gap-5"
    >
      {pricingPlans.map((plan, i) => (
        <PricingCard key={plan.id} plan={plan} index={i} />
      ))}
    </div>
  );
}