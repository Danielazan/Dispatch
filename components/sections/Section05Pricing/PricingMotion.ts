import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const pricingConfig = {
  trackHeight: "170vh",
  scrub: 1,
  /** dev-only overlay. never ship true. */
  debug: false,
} as const;

/*
  THREE MOTION SYSTEMS

  SYSTEM 1 — ENTRANCE (time-based, one-way) — "ink doesn't un-print"
  Plays once on entry; owns ALL visibility. Resets only on full upward exit.

  SYSTEM 2 — CAMERA (scrubbed, reversible) — "light is free to move"
  Camera drift, window-light travel, parallax planes, departure.

  SYSTEM 3 — INTENT (direction-aware, time-tweened) — "the sheet listens"
  Scroll DOWN  → directed mode: light pool on, side plates recede,
                 cool stone wash + deeper edges, paper highlight rests
                 over the featured column.
  Scroll UP    → comparison mode: emphasis recedes, warm champagne lift,
                 edges open, paper highlight drifts to center.
  The ivory base NEVER changes — only light layers crossfade, so the
  background responds as EXPOSURE, not as a color swap.
  Re-entry from below → one slow acknowledgment pass.
  Upward pass through the brass lock → one specular catch-light.
*/
export function setupPricingMotion(
  scope: HTMLElement,
  track: HTMLElement,
  onProgress?: (p: number) => void
): () => void {
  const q = (s: string) => scope.querySelector(s) as HTMLElement | null;
  const qa = (s: string) => Array.from(scope.querySelectorAll(s)) as HTMLElement[];

  const sliver = q('[data-s5="sliver"]');
  const exposure = q('[data-s5="exposure"]');
  const eyebrow = q('[data-s5="eyebrow"]');
  const lines = [q('[data-s5="line1"] > span'), q('[data-s5="line2"] > span'), q('[data-s5="line3"] > span')];
  const copy = q('[data-s5="copy"]');
  const ctaLine = q('[data-s5="cta-line"]');
  const ctaBtn = q('[data-s5="cta-btn"]');
  const camera = q('[data-s5="camera"]');
  const windowLight = q('[data-s5="windowlight"]');
  const paperHighlight = q('[data-s5="paperhighlight"]');
  const openTint = q('[data-s5="opentint"]');
  const directedTint = q('[data-s5="directedtint"]');
  const returnPass = q('[data-s5="returnpass"]');
  const catchlight = q('[data-s5="catchlight"]');
  const lightPool = q('[data-s5="lightpool"]');
  const depart = q('[data-s5="depart"]');
  const cards = qa("[data-plan]");
  const scans = qa("[data-scan]");
  const strip = q("[data-featured-strip]");
  const badge = q("[data-featured-badge]");
  const assureItems = qa("[data-assure]");
  const cardsPlane = q('[data-plane="cards"]');
  const detailPlanes = qa('[data-plane="details"]');

  /* loose (event-born) tweens, killed on unmount */
  const loose: (gsap.core.Tween | gsap.core.Timeline)[] = [];

  /* ================= SYSTEM 1 — ENTRANCE (~2.6s, one-way) ================= */
  const entrance = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

  if (sliver && exposure) {
    entrance
      .fromTo(sliver, { autoAlpha: 0, scaleX: 1 }, { autoAlpha: 1, duration: 0.25, ease: "power1.in" }, 0)
      .to(sliver, { scaleX: 6, duration: 0.2, ease: "power2.out" }, 0.2)
      .fromTo(exposure, { clipPath: "inset(0 50% 0 50%)" }, { clipPath: "inset(0 0% 0 0%)", duration: 0.7, ease: "power2.inOut" }, 0.3)
      .to(sliver, { autoAlpha: 0, duration: 0.35 }, 0.6);
  }

  if (eyebrow) entrance.fromTo(eyebrow, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.8);

  const lineAt = [0.95, 1.07, 1.19];
  lines.forEach((line, i) => {
    if (!line) return;
    entrance.fromTo(line, { yPercent: 105, opacity: 0.4 }, { yPercent: 0, opacity: 1, duration: 0.55 }, lineAt[i]);
    entrance.to(line, { keyframes: [{ opacity: 0.96, duration: 0.09 }, { opacity: 1, duration: 0.09 }] }, lineAt[i] + 0.55);
  });

  if (copy) entrance.fromTo(copy, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 1.35);
  if (ctaLine) entrance.fromTo(ctaLine, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "power2.inOut" }, 1.45);
  if (ctaBtn) entrance.fromTo(ctaBtn, { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.4 }, 1.55);

  const cardAt = [1.35, 1.55, 1.75];
  const startScale = [0.985, 0.97, 0.985];
  cards.forEach((card, i) => {
    const at = cardAt[i];
    entrance.fromTo(
      card,
      { autoAlpha: 0, clipPath: "inset(0 100% 0 0)", scale: startScale[i] },
      { autoAlpha: 1, clipPath: "inset(0 0% 0 0)", scale: 1, duration: 0.6, ease: "power2.inOut" },
      at
    );
    const scan = scans[i];
    if (scan) {
      entrance.fromTo(scan, { xPercent: -110, opacity: 0 }, { opacity: 0.6, duration: 0.12, ease: "power1.in" }, at + 0.08);
      entrance.to(scan, { xPercent: 320, opacity: 0, duration: 0.5, ease: "power1.inOut" }, at + 0.18);
    }
  });

  if (cards[1]) {
    entrance.fromTo(cards[1], { scale: 1 }, { scale: 1.015, duration: 0.25, ease: "power2.out" }, 2.0);
    entrance.to(cards[1], { scale: 1, duration: 0.3, ease: "power2.inOut" }, 2.3);
  }
  if (strip) entrance.fromTo(strip, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "power2.inOut" }, 2.0);
  if (badge) entrance.fromTo(badge, { autoAlpha: 0, y: -6 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 2.25);

  assureItems.forEach((item, i) => {
    const at = 2.1 + i * 0.14;
    const icon = item.querySelector("[data-assure-icon]") as HTMLElement | null;
    const circle = item.querySelector("[data-assure-circle]") as SVGElement | null;
    const text = item.querySelector("[data-assure-text]") as HTMLElement | null;
    const desc = item.querySelector("[data-assure-desc]") as HTMLElement | null;

    entrance.fromTo(item, { autoAlpha: 0, x: 18 }, { autoAlpha: 1, x: 0, duration: 0.4 }, at);
    if (icon) entrance.fromTo(icon, { scale: 0.9 }, { scale: 1, duration: 0.3, ease: "power2.out" }, at + 0.05);
    if (circle) entrance.fromTo(circle, { strokeDashoffset: 100, autoAlpha: 0 }, { autoAlpha: 1, strokeDashoffset: 0, duration: 0.45, ease: "power1.inOut" }, at + 0.1);
    if (text) entrance.fromTo(text, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, at + 0.15);
    if (desc) entrance.fromTo(desc, { y: 5 }, { y: 0, duration: 0.3 }, at + 0.2);
  });

  const play = () => {
    if (entrance.progress() < 1) entrance.play();
  };
  ScrollTrigger.create({
    trigger: track,
    start: "top 85%",
    onEnter: play,
    onEnterBack: play,
    onLeaveBack: () => entrance.pause(0),
  });

  /* ================= SYSTEM 3 — INTENT (direction-aware) ================= */
  const intent = { v: 0 }; // 0 = comparison/open · 1 = directed emphasis
  let prevP = 0;
  let catchArmed = true;

  const applyIntent = () => {
    const v = intent.v;
    /* emphasis */
    if (lightPool) lightPool.style.opacity = (0.55 * v).toFixed(3);
    const b = (1 - 0.04 * v).toFixed(3);
    if (cards[0]) cards[0].style.filter = `brightness(${b})`;
    if (cards[2]) cards[2].style.filter = `brightness(${b})`;
    /* paper exposure: warm open lift vs cool directed wash */
    if (openTint) openTint.style.opacity = (0.5 * (1 - v)).toFixed(3);
    if (directedTint) directedTint.style.opacity = (0.55 * v).toFixed(3);
    if (windowLight) windowLight.style.opacity = (0.4 + 0.12 * (1 - v)).toFixed(3);
    /* paper highlight drift: featured column (directed) ↔ center (open) */
    if (paperHighlight) paperHighlight.style.transform = `translateX(${((1 - v) * -6).toFixed(2)}%)`;
  };
  applyIntent();

  const setIntent = (target: number) => {
    if (Math.abs(target - intent.v) < 0.001) return;
    const tw = gsap.to(intent, { v: target, duration: 0.7, ease: "power2.out", onUpdate: applyIntent, overwrite: "auto" });
    loose.push(tw);
  };

  const playReturnPass = () => {
    if (!returnPass) return;
    const tl = gsap.timeline({ overwrite: "auto" });
    tl.fromTo(returnPass, { xPercent: -130, opacity: 0 }, { xPercent: 0, opacity: 0.32, duration: 0.5, ease: "power1.inOut" }).to(
      returnPass,
      { xPercent: 130, opacity: 0, duration: 0.7, ease: "power1.inOut" }
    );
    loose.push(tl);
  };

  const playCatchlight = () => {
    if (!catchlight) return;
    const tl = gsap.timeline({ overwrite: "auto" });
    tl.fromTo(catchlight, { xPercent: -160, opacity: 0 }, { xPercent: 0, opacity: 0.55, duration: 0.35, ease: "power2.out" }).to(
      catchlight,
      { xPercent: 180, opacity: 0, duration: 0.55, ease: "power2.in" }
    );
    loose.push(tl);
  };

  /* ================= SYSTEM 2 — CAMERA (scrubbed) ================= */
  gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: pricingConfig.scrub,
      invalidateOnRefresh: true,
      onEnterBack: playReturnPass,
      onUpdate: (self) => {
        const p = self.progress;
        onProgress?.(p);

        /* directed vs comparison */
        const target = self.direction === 1 && p > 0.28 ? 1 : 0;
        setIntent(target);

        /* brass catch-light: upward pass through the lock moment */
        if (self.direction === -1 && prevP > 0.5 && p <= 0.5 && catchArmed) {
          catchArmed = false;
          playCatchlight();
        }
        if (self.direction === 1 && p > 0.6) catchArmed = true;
        prevP = p;
      },
    },
  })
    .fromTo(camera, { scale: 1, x: 0 }, { scale: 1.012, x: -6, duration: 0.5, ease: "power1.inOut" }, 0)
    .to(camera, { scale: 1, x: 0, duration: 0.5, ease: "power1.inOut" }, 0.5)
    .fromTo(windowLight, { xPercent: -22 }, { xPercent: 22, duration: 1 }, 0)
    .fromTo(cardsPlane, { y: 4 }, { y: 0, duration: 1 }, 0)
    .fromTo(detailPlanes, { y: 7 }, { y: 0, duration: 1 }, 0)
    .fromTo(depart, { yPercent: 100 }, { yPercent: 0, duration: 0.1, ease: "power2.inOut" }, 0.9);

  /* dispose event-born tweens on unmount */
  return () => {
    loose.forEach((t) => t.kill());
  };
}