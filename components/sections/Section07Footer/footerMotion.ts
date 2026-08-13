import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { DEBUG_SECTION_07 } from "./footerData";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/* ============================================================
   SECTION 07 — "THE ROAD CONTINUES" timeline.
   Plays ONCE (ScrollTrigger `once: true`), then settles into
   permanent stillness. It is never scrubbed and never reverses.

   Layer order (§34):
   darkness → handoff signal → brand → navigation → contact
   → truck mask reveal → route draw → signal travel → arrival
   → final phrase → legal strip → STOP.
   ============================================================ */
export function buildFooterTimeline(
  scope: HTMLElement,
  opts?: { compact?: boolean }
): gsap.core.Timeline {
  const compact = opts?.compact ?? false;

  const q = (s: string) => scope.querySelector(s) as HTMLElement | SVGElement | null;
  const qa = (s: string) => Array.from(scope.querySelectorAll(s)) as HTMLElement[];

  const veil = q('[data-s7="veil"]');
  const handoffLine = q('[data-s7="handoff-line"]');
  const handoffDot = q('[data-s7="handoff-dot"]');
  const brand = q('[data-s7="brand"]');
  const brandMark = q('[data-s7="brand-mark"]');
  const brandAccent = q('[data-s7="brand-accent"]');
  const navGroups = qa('[data-s7="nav-group"]');
  const contact = q('[data-s7="contact"]');
  const truckMask = q('[data-s7="truck-mask"]');
  const truckInner = q('[data-s7="truck-inner"]');
  const truckLum = q('[data-s7="truck-lum"]');
  const routePath = q('[data-s7="route-path"]') as SVGPathElement | null;
  const routeEnd = q('[data-s7="route-end"]');
  const signalDot = q('[data-s7="signal-dot"]');
  const phrase = q('[data-s7="phrase"]');
  const legal = q('[data-s7="legal"]');

  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
    scrollTrigger: {
      trigger: scope,
      start: "top 82%",
      once: true, // one pass, then the trigger kills itself → stillness
      invalidateOnRefresh: true,
      ...(DEBUG_SECTION_07 ? { markers: true } : {}),
    },
  });

  /* ---- SHOT 01 · HANDOFF — the Section 06 signal descends ---- */
  if (handoffLine) {
    tl.fromTo(handoffLine, { scaleY: 0, autoAlpha: 1 }, { scaleY: 1, duration: 0.55, ease: "power2.inOut" }, 0);
  }
  if (handoffDot) {
    tl.fromTo(handoffDot, { y: 0, autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 }, 0.02);
    tl.to(handoffDot, { y: 58, duration: 0.6, ease: "power2.inOut" }, 0.05);
    tl.to(handoffDot, { autoAlpha: 0, duration: 0.3 }, 0.68);
  }
  if (handoffLine) tl.to(handoffLine, { autoAlpha: 0.35, duration: 0.5 }, 0.8);

  /* footer darkness settles */
  if (veil) tl.fromTo(veil, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.8, ease: "power1.out" }, 0.1);

  /* ---- SHOT 02 · BRAND resolves (assembled, not scaled) ---- */
  if (brand) tl.fromTo(brand, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.65 }, 0.5);
  if (brandMark) {
    tl.fromTo(
      brandMark,
      { clipPath: "inset(0% 100% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power2.inOut" },
      0.55
    );
  }
  /* accent arrives slightly after the wordmark */
  if (brandAccent) tl.fromTo(brandAccent, { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.45 }, 0.95);

  /* ---- SHOT 03 · NAVIGATION architecture resolves (groups only, §36) ---- */
  if (navGroups.length) {
    tl.fromTo(navGroups, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.12 }, 1.05);
  }

  /* ---- SHOT 04 · CONTACT resolves ---- */
  if (contact) tl.fromTo(contact, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.55 }, compact ? 1.35 : 1.45);

  /* ---- SHOT 05 · HORIZON — truck emerges via horizontal mask + camera settle ---- */
  const tTruck = compact ? 1.6 : 1.85;
  const maskDur = compact ? 0.7 : 0.95;
  if (truckMask) {
    tl.fromTo(
      truckMask,
      { clipPath: "inset(0% 0% 0% 100%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: maskDur, ease: "power2.inOut" },
      tTruck
    );
  }
  if (truckInner) {
    tl.fromTo(
      truckInner,
      { scale: compact ? 1.03 : 1.06, x: compact ? 0 : -10 },
      { scale: 1, x: 0, duration: compact ? 0.8 : 1.1, ease: "power2.out" },
      tTruck
    );
  }

  /* ---- SHOT 06 · LAST MILE — route draws toward the truck (single pass) ---- */
  const tRoute = tTruck + Math.max(maskDur, compact ? 0.8 : 1.1) + 0.05;
  const drawDur = compact ? 0.7 : 0.95;
  if (routePath) {
    gsap.set(routePath, { strokeDasharray: 1 }); // pathLength={1} in markup
    tl.fromTo(routePath, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: drawDur, ease: "power1.inOut" }, tRoute);
  }

  /* ---- SHOT 07 · SIGNAL — a tiny dispatch point travels once ---- */
  const tTravel = tRoute + drawDur + 0.02;
  const travelDur = compact ? 0.6 : 0.9;
  if (signalDot && routePath) {
    tl.fromTo(signalDot, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, tTravel);
    tl.to(
      signalDot,
      {
        motionPath: { path: routePath, align: routePath, alignOrigin: [0.5, 0.5] },
        duration: travelDur,
        ease: "power1.inOut",
      },
      tTravel
    );
  }

  /* ---- SHOT 08 · ARRIVAL — endpoint responds, truck brightens, signal dims ---- */
  const tArrive = tTravel + travelDur;
  if (signalDot) tl.to(signalDot, { autoAlpha: 0.28, duration: 0.35 }, tArrive); // reduced intensity, stays
  if (routeEnd) {
    tl.fromTo(routeEnd, { autoAlpha: 0.5 }, { autoAlpha: 1, duration: 0.35 }, tArrive);
    tl.to(routeEnd, { autoAlpha: 0.7, duration: 0.4 }, tArrive + 0.4);
  }
  if (truckLum) tl.to(truckLum, { filter: "brightness(1.045)", duration: 0.6, ease: "power1.out" }, tArrive);
  if (routePath) tl.to(routePath, { autoAlpha: 0.38, duration: 0.5 }, tArrive + 0.15); // route remains faint

  /* ---- SHOT 09 · FINAL WORD ---- */
  if (phrase) tl.fromTo(phrase, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5 }, tArrive + 0.35);

  /* ---- SHOT 10 · CLOSING CREDITS — legal strip, then stillness ---- */
  if (legal) tl.fromTo(legal, { autoAlpha: 0, y: 4 }, { autoAlpha: 1, y: 0, duration: 0.5 }, tArrive + 0.7);

  /* STILLNESS — release inline props so CSS hover language stays clean */
  tl.eventCallback("onComplete", () => {
    [brand, contact, legal, phrase, ...navGroups].forEach((el) => {
      if (el) gsap.set(el, { clearProps: "transform,opacity,visibility" });
    });
    if (brandMark) gsap.set(brandMark, { clearProps: "clipPath" });
    if (truckMask) gsap.set(truckMask, { clearProps: "clipPath" });
    if (truckInner) gsap.set(truckInner, { clearProps: "transform" });
    if (DEBUG_SECTION_07) console.info("[Section07] timeline settled — stillness.");
  });

  return tl;
}