import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const COUNTERS: { key: string; end: number; fmt: (v: number) => string }[] = [
  { key: "states", end: 48, fmt: (v) => `${Math.round(v)}` },
  { key: "loads", end: 1200, fmt: (v) => `${Math.round(v).toLocaleString("en-US")}+` },
  { key: "miles", end: 12, fmt: (v) => `${Math.round(v)}M+` },
  { key: "rating", end: 4.9, fmt: (v) => v.toFixed(1) },
];

const CARD_AT = [0.2, 0.4, 0.55];

/* ONE master timeline: entry → human proof → camera pull-back → scale → trust. */
export function buildProofTimeline(scope: HTMLElement, track: HTMLElement): gsap.core.Timeline {
  const q = (s: string) => scope.querySelector(s) as HTMLElement | null;
  const qa = (s: string) => Array.from(scope.querySelectorAll(s)) as HTMLElement[];

  const eyebrow = q('[data-s4="eyebrow"]');
  const heading = q('[data-s4="heading"]');
  const line1 = q('[data-s4="line1"] > span');
  const line2 = q('[data-s4="line2"] > span');
  const editorial = q('[data-s4="editorial"]');
  const rail = q('[data-s4="rail"]');
  const cards = qa("[data-card]");
  const map = q('[data-s4="map"]');
  const stats = q('[data-s4="stats"]');
  const sweep = q('[data-s4="sweep"]');
  const trustLabel = q('[data-s4="trustlabel"]');
  const logos = qa("[data-logo]");

  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    scrollTrigger: {
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  /* ---- 0.00–0.20 dark arrival + heading establishes ---- */
  if (eyebrow) tl.fromTo(eyebrow, { autoAlpha: 0, letterSpacing: "0.2em" }, { autoAlpha: 1, letterSpacing: "0.14em", duration: 0.06 }, 0.02);
  if (heading) tl.fromTo(heading, { y: 30, filter: "blur(6px)" }, { y: 0, filter: "blur(0px)", duration: 0.08 }, 0.04);
  if (line1) tl.fromTo(line1, { yPercent: 105 }, { yPercent: 0, duration: 0.06 }, 0.05);
  if (line2) tl.fromTo(line2, { yPercent: 105 }, { yPercent: 0, duration: 0.06 }, 0.07);
  if (editorial) tl.fromTo(editorial, { y: 15 }, { y: -5, duration: 1, ease: "none" }, 0);

  /* ---- 0.20–0.68 testimonial inserts, sequential emphasis ---- */
  cards.forEach((card, i) => {
    const at = CARD_AT[i];
    tl.fromTo(
      card,
      { autoAlpha: 0, y: 45, scale: 0.96, clipPath: "inset(0 0 14% 0)" },
      { autoAlpha: 1, y: 0, scale: 1, clipPath: "inset(0 0 0% 0)", duration: 0.09 },
      at
    );
    const stars = Array.from(card.querySelectorAll("[data-star]")) as HTMLElement[];
    stars.forEach((star, s) => {
      tl.fromTo(star, { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.02 }, at + 0.02 + s * 0.006);
    });
    const quote = card.querySelector('[data-part="quote"]') as HTMLElement | null;
    const portrait = card.querySelector('[data-part="portrait"]') as HTMLElement | null;
    const person = card.querySelector('[data-part="person"]') as HTMLElement | null;
    if (quote) tl.fromTo(quote, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.05 }, at + 0.03);
    if (portrait) tl.fromTo(portrait, { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.05 }, at + 0.04);
    if (person) tl.fromTo(person, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.05 }, at + 0.05);

    if (i > 0) {
      tl.to(cards[i - 1], { autoAlpha: 0.72, scale: 0.985, duration: 0.06 }, at);
    }
  });
  if (rail) tl.fromTo(rail, { y: 20 }, { y: -10, duration: 0.5, ease: "none" }, 0.2);

  /* ---- 0.68–0.78 camera pull-back: people → network ---- */
  if (sweep) {
    tl.fromTo(sweep, { xPercent: -40, opacity: 0 }, { opacity: 0.08, duration: 0.03, ease: "power1.in" }, 0.68);
    tl.to(sweep, { xPercent: 40, opacity: 0, duration: 0.05, ease: "power1.out" }, 0.71);
  }
  tl.to(cards, { autoAlpha: 0.78, scale: 0.97, duration: 0.07 }, 0.68);
  if (map) tl.fromTo(map, { opacity: 0.12, scale: 0.94 }, { opacity: 1, scale: 1.02, duration: 0.16, ease: "power2.inOut" }, 0.68);

  /* ---- 0.78–0.92 statistics discovered ---- */
  if (stats) tl.fromTo(stats, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.78);
  COUNTERS.forEach((c, i) => {
    const el = q(`[data-stat="${c.key}"]`);
    if (!el) return;
    const proxy = { v: 0 };
    tl.fromTo(
      proxy,
      { v: 0 },
      {
        v: c.end,
        duration: 0.07,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = c.fmt(proxy.v);
        },
      },
      0.8 + i * 0.03
    );
  });

  /* ---- 0.90–1.00 industry trust closes the scene ---- */
  if (trustLabel) tl.fromTo(trustLabel, { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.05 }, 0.9);
  logos.forEach((logo, i) => {
    tl.fromTo(logo, { autoAlpha: 0, x: -12, scale: 0.97 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.04 }, 0.92 + i * 0.012);
  });
  tl.to(cards, { autoAlpha: 1, scale: 1, duration: 0.05 }, 0.94); // equilibrium

  return tl;
}