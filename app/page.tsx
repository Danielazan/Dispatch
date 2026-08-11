import HeroSection from "@/components/landing/hero/HeroSection";
import Section02WhatWeDo from "@/components/sections/Section02WhatWeDo";
import Section03HowItWorks from "@/components/sections/Section03HowItWorks";
import Section04Proof from "@/components/sections/Section04Proof";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Section02WhatWeDo />
      <Section03HowItWorks />
      <Section04Proof />
      {/* Section 05+ later */}
    </main>
  );
}