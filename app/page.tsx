import HeroSection from "@/components/landing/hero/HeroSection";
import Section02WhatWeDo from "@/components/sections/Section02WhatWeDo";
import Section03HowItWorks from "@/components/sections/Section03HowItWorks";
import Section04Proof from "@/components/sections/Section04Proof";
import Section05Pricing from "@/components/sections/Section05Pricing";
import Section06Dispatch from "@/components/sections/Section06Dispatch";
import Section07Footer from "@/components/sections/Section07Footer";
import Navigation from "@/components/landing/Navigation";

export default function Home() {
  return (
    <>
      <main>
        <Navigation />
        <HeroSection />
        <Section02WhatWeDo />
        <Section03HowItWorks />
        <Section04Proof />
        <Section05Pricing />
        <Section06Dispatch />
      </main>

      {/* Footer lives OUTSIDE <main> — correct landmark semantics */}
      <Section07Footer />
    </>
  );
}