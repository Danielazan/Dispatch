import Image from "next/image";
import { assets } from "@/config/assets";
import HeroTruck from "@/components/landing/hero/HeroTruck";

/*
  LAYER 0–1: photographic environment + readability overlays.
  If a real hero asset exists it is used as-is (truck assumed embedded —
  no second truck is added). Otherwise a placeholder dusk environment renders.
*/
export default function HeroBackground() {
  const src = assets.hero.background;

  return (
    <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden">
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center]"
        />
      ) : (
        <>
          {/* dusk sky */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#171c22_0%,#12161b_45%,#0d1116_100%)]" />
          {/* photographic amber horizon glow */}
          <div className="absolute inset-0 bg-[radial-gradient(58%_42%_at_68%_36%,rgba(198,150,90,0.14),transparent_70%)]" />
          {/* distant ridgelines */}
          <svg className="absolute inset-x-0 bottom-[24%] h-[30%] w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path d="M0 220 L240 140 L470 210 L720 110 L980 200 L1210 130 L1440 200 V320 H0 Z" fill="#141920" opacity="0.85" />
            <path d="M0 260 L320 190 L620 250 L900 180 L1180 250 L1440 210 V320 H0 Z" fill="#10151b" />
          </svg>
          {/* road plane */}
          <div className="absolute inset-x-0 bottom-0 h-[26%] bg-[linear-gradient(180deg,#0d1116_0%,#0b0e11_60%,#101419_100%)]" />
          {/* truck — desktop placement (cab clear of the load board) */}
          <HeroTruck className="reveal-fade absolute bottom-[150px] right-[-4%] hidden w-[min(72vw,980px)] lg:block" />
        </>
      )}

      {/* LAYER 1 — readability overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/35 to-ink-950/10" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink-950 to-transparent" />
    </div>
  );
}