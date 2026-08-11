import SectionContainer from "@/components/landing/SectionContainer";
import ProofEditorial from "./ProofEditorial";
import TestimonialRail from "./TestimonialRail";
import CoverageMap from "./CoverageMap";
import ProofStats from "./ProofStats";
import CarrierTrustRow from "./CarrierTrustRow";

/* Normal-flow fallback: mobile + prefers-reduced-motion. Fully readable, no pin. */
export default function StaticProof() {
  return (
    <SectionContainer className="py-16 md:py-20">
      <ProofEditorial />
      <div className="mt-10">
        <TestimonialRail />
      </div>
      <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] md:items-end">
        <div className="aspect-[4/3] md:aspect-auto md:h-[320px]">
          <CoverageMap />
        </div>
        <ProofStats />
      </div>
      <div className="mt-12">
        <CarrierTrustRow />
      </div>
    </SectionContainer>
  );
}