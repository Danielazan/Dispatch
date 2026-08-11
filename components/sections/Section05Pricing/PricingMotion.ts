import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const pricingConfig = {
  trackHeight: "240vh",
  scrub: 1,
  /** dev-only overlay. never ship true. */
  debug: false,
} as const;

/*
  ONE master timeline — the pricing scene:
  0.00–0.12 exposure shift (dark → sliver → horizontal shutter → ivory)
  0.12–0.25 printed typography (cadenced mask reveal + ink settling)
  0.25–0.50 pricing plates (geometric left→right masks + scanner beam)
  0.48–0.68 recommendation (brass lock, camera push, side cards recede)
  0.66–0.82 assurance annotations (verification stamps)
  0.82–1.00 settle + departure band into Section 06
*/
export function buildPricingTimeline(
  scope: HTMLElement,
  track: HTMLElement,
  onProgress?: (p: number) => void
): gsap.core.Timeline {
  const q = (s: string) => scope.querySelector(s) as HTMLElement | null;
  const qa = (s: string) => Array.from(scope.querySelectorAll(s)) as HTMLElement[];

  const sliver = q('[data-s5="sliver"]');
  const exposure = q('[data-s5="exposure"]');
  const camera = q('[data-s5="camera"]');
  const eyebrow = q('[data-s5="eyebrow"]');
  const lines = [q('[data-s5="line1"] > span'), q('[data-s5="line2"] > span'), q('[data-s5="line3"] > span')];
  const copy = q('[data-s5="copy"]');
  const ctaLine = q('[data-s5="cta-line"]');
  const ctaBtn = q('[data-s5="cta-btn"]');
  const cards = qa("[data-plan]");
  const scans = qa("[data-scan]");
  const strip = q("[data-featured-strip]");
  const badge = q("[data-featured-badge]");
  const assureItems = qa("[data-assure]");
  const depart = q('[data-s5="depart"]');
  const cardsPlane = q('[data-plane="cards"]');
  const detailPlanes = qa('[data-plane="details"]');

  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    scrollTrigger: {
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: pricingConfig.scrub,
      invalidateOnRefresh: true,
      onUpdate: (self) => onProgress?.(self.progress),
    },
  });

  /* ---- SHOT 01 — exposure shift ---- */
  if (sliver) {
    tl.fromTo(sliver, { autoAlpha: 0, scaleX: 1 }, { autoAlpha: 1, duration: 0.03, ease: "power1.in" }, 0);
    tl.to(sliver, { scaleX: 7, duration: 0.02, ease: "power2.out" }, 0.03);
    tl.to(sliver, { autoAlpha: 0, duration: 0.04 }, 0.07);
  }
  if (exposure) {
    tl.fromTo(exposure, { clipPath: "inset(0 50% 0 50%)" }, { clipPath: "inset(0 0% 0 0%)", duration: 0.08, ease: "power2.inOut" }, 0.04);
  }

  /* ---- SHOT 02 — printed typography ---- */
  if (eyebrow) tl.fromTo(eyebrow, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.04 }, 0.13);
  const lineAt = [0.15, 0.175, 0.2];
  lines.forEach((line, i) => {
    if (!line) return;
    tl.fromTo(line, { yPercent: 105, opacity: 0.4 }, { yPercent: 0, opacity: 1, duration: 0.05 }, lineAt[i]);
    /* ink settling — barely perceptible */
    tl.to(line, { keyframes: [{ opacity: 0.96, duration: 0.012 }, { opacity: 1, duration: 0.012 }] }, lineAt[i] + 0.05);
  });
  if (copy) tl.fromTo(copy, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.04 }, 0.23);
  if (ctaLine) tl.fromTo(ctaLine, { scaleX: 0 }, { scaleX: 1, duration: 0.04, ease: "power2.inOut" }, 0.245);
  if (ctaBtn) tl.fromTo(ctaBtn, { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.04 }, 0.25);

  /* ---- SHOT 03 — pricing plates, precision-masked left→right ---- */
  const cardAt = [0.27, 0.36, 0.45];
  const startScale = [0.985, 0.97, 0.985];
  cards.forEach((card, i) => {
    const at = cardAt[i];
    tl.fromTo(
      card,
      { autoAlpha: 0, clipPath: "inset(0 100% 0 0)", scale: startScale[i] },
      { autoAlpha: 1, clipPath: "inset(0 0% 0 0)", scale: i === 1 ? 1 : 1, duration: 0.08, ease: "power2.inOut" },
      at
    );
    const scan = scans[i];
    if (scan) {
      tl.fromTo(scan, { xPercent: -110, opacity: 0 }, { opacity: 0.6, duration: 0.02, ease: "power1.in" }, at + 0.01);
      tl.to(scan, { xPercent: 320, opacity: 0, duration: 0.08, ease: "power1.inOut" }, at + 0.02);
    }
  });

  /* ---- SHOT 05 — recommendation: brass lock + camera push ---- */
  if (camera) {
    tl.fromTo(camera, { scale: 1 }, { scale: 1.015, duration: 0.08, ease: "power1.inOut" }, 0.5);
    tl.to(camera, { scale: 1, duration: 0.08, ease: "power1.inOut" }, 0.68);
  }
  if (cards[1]) {
    tl.to(cards[1], { scale: 1.015, duration: 0.04, ease: "power2.out" }, 0.5);
    tl.to(cards[1], { scale: 1, duration: 0.05, ease: "power2.inOut" }, 0.62);
  }
  if (strip) tl.fromTo(strip, { scaleX: 0 }, { scaleX: 1, duration: 0.05, ease: "power2.inOut" }, 0.51);
  if (badge) tl.fromTo(badge, { autoAlpha: 0, y: -6 }, { autoAlpha: 1, y: 0, duration: 0.04 }, 0.54);
  if (cards[0] && cards[2]) {
    tl.to([cards[0], cards[2]], { autoAlpha: 0.92, duration: 0.04 }, 0.54);
    tl.to([cards[0], cards[2]], { autoAlpha: 1, duration: 0.05 }, 0.78);
  }

  /* ---- SHOT 06 — assurance annotations with verification stamps ---- */
  const assureAt = [0.66, 0.7, 0.74, 0.78];
  assureItems.forEach((item, i) => {
    const at = assureAt[i];
    const icon = item.querySelector("[data-assure-icon]") as HTMLElement | null;
    const circle = item.querySelector("[data-assure-circle]") as SVGElement | null;
    const text = item.querySelector("[data-assure-text]") as HTMLElement | null;
    const desc = item.querySelector("[data-assure-desc]") as HTMLElement | null;

    tl.fromTo(item, { autoAlpha: 0, x: 18 }, { autoAlpha: 1, x: 0, duration: 0.04 }, at);
    if (icon) tl.fromTo(icon, { scale: 0.9 }, { scale: 1, duration: 0.03, ease: "power2.out" }, at + 0.004);
    if (circle) tl.fromTo(circle, { strokeDashoffset: 100, autoAlpha: 0 }, { autoAlpha: 1, strokeDashoffset: 0, duration: 0.05, ease: "power1.inOut" }, at + 0.008);
    if (text) tl.fromTo(text, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.03 }, at + 0.012);
    if (desc) tl.fromTo(desc, { y: 5 }, { y: 0, duration: 0.03 }, at + 0.016);
  });

  /* ---- micro parallax planes (perceptual, not obvious) ---- */
  if (cardsPlane) tl.fromTo(cardsPlane, { y: 4 }, { y: 0, duration: 1, ease: "none" }, 0);
  detailPlanes.forEach((plane) => tl.fromTo(plane, { y: 7 }, { y: 0, duration: 1, ease: "none" }, 0));

  /* ---- SHOT 08 — departure into Section 06 ---- */
  if (depart) tl.fromTo(depart, { yPercent: 100 }, { yPercent: 0, duration: 0.08, ease: "power2.inOut" }, 0.92);

  return tl;
}