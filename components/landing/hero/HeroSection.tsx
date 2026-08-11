import HeroBackground from "@/components/landing/hero/HeroBackground";
import RouteMap from "@/components/landing/hero/RouteMap";
import HeroTruck from "@/components/landing/hero/HeroTruck";
import HeroContent from "@/components/landing/hero/HeroContent";
import HeroActions from "@/components/landing/hero/HeroActions";
import EquipmentDispatch from "@/components/landing/hero/EquipmentDispatch";
import LiveLoadBoard from "@/components/landing/hero/LiveLoadBoard";
import HeroStats from "@/components/landing/hero/HeroStats";
import RecentlyBooked from "@/components/landing/hero/RecentlyBooked";
import { assets } from "@/config/assets";

export default function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink-950">
      {/* Hero scene — background, map and content share one relative box,
          so the map's bottom edge = the photo's bottom edge. */}
      <div className="relative">
        <HeroBackground />
        <RouteMap />

        <div className="relative z-20 mx-auto max-w-[1440px] px-6 pb-16 pt-28 lg:px-10 lg:pb-24 lg:pt-40">
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10">
            {/* left column */}
            <div>
              <HeroContent />
              <HeroActions />
              <EquipmentDispatch />
            </div>

            {/* mobile truck — in-flow between equipment and load board */}
            {!assets.hero.background && (
              <div className="relative -mx-2 my-2 lg:hidden">
                <HeroTruck className="reveal-fade mx-auto w-[94%]" />
              </div>
            )}

            {/* right column — operational dashboard */}
            <div className="lg:justify-self-end lg:pt-2">
              <LiveLoadBoard />
            </div>
          </div>
        </div>
      </div>

      <HeroStats />
      <RecentlyBooked />
    </section>
  );
}