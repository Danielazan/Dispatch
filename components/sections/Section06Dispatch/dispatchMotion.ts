import { gsap } from "gsap";

/*
SECTION 06 — the TERMINAL BOOT timeline (Tier 1 · latched).

Plays ONCE when the section first enters the viewport, then strips its
own animation props (clearProps) so the form can never be hidden again.
It is fully decoupled from scroll position — scrolling up cannot
reverse it. Decorative/peripheral motion lives in CSS (.in-view system),
which is the only layer allowed to appear/disappear on scroll.
*/
export function buildBootTimeline(scope: ParentNode): gsap.core.Timeline {
  const q = (s: string) => scope.querySelector(s) as HTMLElement | null;
  const qa = (s: string) => Array.from(scope.querySelectorAll(s)) as HTMLElement[];

  const signalDot = q('[data-s6="signal-dot"]');
  const signalLine = q('[data-s6="signal-line"]');
  const terminalBg = q('[data-s6="terminal-bg"]');
  const depth = q('[data-s6="depth"]');
  const frameTop = q('[data-s6="frame-top"]');
  const frameRight = q('[data-s6="frame-right"]');
  const frameBottom = q('[data-s6="frame-bottom"]');
  const frameLeft = q('[data-s6="frame-left"]');
  const calib = q('[data-s6="calib"]');
  const headerDivider = q('[data-s6="header-divider"]');
  const statusLine = q('[data-s6="status-line"]');
  const statusCluster = q('[data-s6="status-cluster"]');
  const statusDot = q('[data-s6="status-dot"]');
  const fieldsA = qa('[data-s6-group="A"]');
  const fieldsB = qa('[data-s6-group="B"]');
  const consent = q('[data-s6="consent"]');
  const ctaRow = q('[data-s6="cta-row"]');

  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });

  /* SHOT 01 — signal acquisition */
  if (signalDot) tl.fromTo(signalDot, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.2 }, 0);
  if (signalLine) tl.fromTo(signalLine, { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: "power2.inOut" }, 0.1);

  /* SHOT 02 — terminal frame construction (top → right → bottom → left) */
  if (terminalBg) tl.fromTo(terminalBg, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.32);
  if (depth) tl.fromTo(depth, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.5); // depth settle
  if (frameTop) tl.fromTo(frameTop, { scaleX: 0 }, { scaleX: 1, duration: 0.16, ease: "power2.inOut" }, 0.4);
  if (frameRight) tl.fromTo(frameRight, { scaleY: 0 }, { scaleY: 1, duration: 0.16, ease: "power2.inOut" }, 0.52);
  if (frameBottom) tl.fromTo(frameBottom, { scaleX: 0 }, { scaleX: 1, duration: 0.16, ease: "power2.inOut" }, 0.64);
  if (frameLeft) tl.fromTo(frameLeft, { scaleY: 0 }, { scaleY: 1, duration: 0.16, ease: "power2.inOut" }, 0.76);

  /* calibration sweep — one restrained console self-check pass */
  if (calib) {
    tl.fromTo(calib, { xPercent: -140, autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 }, 0.85);
    tl.to(calib, { xPercent: 620, duration: 0.6, ease: "power1.inOut" }, 0.87);
    tl.to(calib, { autoAlpha: 0, duration: 0.15 }, 1.35);
  }

  /* SHOT 03 — header ignition (status dot ignites once, then settles) */
  if (headerDivider) tl.fromTo(headerDivider, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power2.inOut" }, 0.9);
  if (statusLine) tl.fromTo(statusLine, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 1.0);
  if (statusCluster) tl.fromTo(statusCluster, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 1.02);
  if (statusDot) {
    tl.fromTo(statusDot, { scale: 0 }, { scale: 1, duration: 0.25, ease: "back.out(2.5)" }, 1.05);
    tl.fromTo(statusDot, { filter: "brightness(2.4)" }, { filter: "brightness(1)", duration: 0.45 }, 1.1);
  }

  /* SHOT 04 — field boot: Group A, then Group B */
  fieldsA.forEach((field, i) => {
    tl.fromTo(
      field,
      { autoAlpha: 0, y: 10, clipPath: "inset(0 100% 0 0)" },
      { autoAlpha: 1, y: 0, clipPath: "inset(0 0% 0 0)", duration: 0.38 },
      1.05 + i * 0.09
    );
  });
  fieldsB.forEach((field, i) => {
    tl.fromTo(
      field,
      { autoAlpha: 0, y: 10, clipPath: "inset(0 100% 0 0)" },
      { autoAlpha: 1, y: 0, clipPath: "inset(0 0% 0 0)", duration: 0.38 },
      1.3 + i * 0.09
    );
  });

  /* consent + CTA */
  if (consent) tl.fromTo(consent, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 1.66);
  if (ctaRow) tl.fromTo(ctaRow, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.32 }, 1.76);

  /* LATCH — boot complete: strip animation props so nothing can hide the form again */
  tl.eventCallback("onComplete", () => {
    [...fieldsA, ...fieldsB, consent, ctaRow].forEach((el) => {
      if (el) gsap.set(el, { clearProps: "clipPath,transform,opacity,visibility" });
    });
    if (calib) gsap.set(calib, { autoAlpha: 0 });
  });

  return tl;
}