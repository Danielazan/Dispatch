import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cinematicConfig, getActiveScene } from "./cinematicConfig";
import { processScenes } from "./sceneData";

gsap.registerPlugin(ScrollTrigger);

const sp = (v: string, m: number) => `${parseFloat(v) * m}%`;

/*
  ONE master scroll timeline. Every layer — images, cameras, text,
  timeline, sweep — derives from the same scrubbed progress.
  Fully reversible (scroll up plays everything backwards).
*/
export function buildMasterTimeline(
  scope: HTMLElement,
  track: HTMLElement,
  travel: number,
  onProgress?: (p: number) => void
): gsap.core.Timeline {
  const q = (sel: string) => scope.querySelector(sel) as HTMLElement | null;

  const layers = processScenes.map((_, i) => q(`[data-scene-layer="${i}"]`));
  const cams = processScenes.map((_, i) => q(`[data-scene-cam="${i}"]`));
  const texts = processScenes.map((_, i) => q(`[data-scene-text="${i}"]`));
  const numInners = processScenes.map((_, i) => q(`[data-scene-num="${i}"]`));
  const titles = processScenes.map((_, i) => q(`[data-scene-title="${i}"]`));
  const descs = processScenes.map((_, i) => q(`[data-scene-desc="${i}"]`));
  const dots = [0, 1, 2, 3].map((i) => q(`[data-s3-dot="${i}"]`));
  const rings = [0, 1, 2, 3].map((i) => q(`[data-s3-ring="${i}"]`));
  const nums = [0, 1, 2, 3].map((i) => q(`[data-s3-num="${i}"]`));
  const progress = q('[data-s3="progress"]');
  const sweep = q('[data-s3="sweep"]');
  const ed = {
    block: q('[data-s3-ed="block"]'),
    eyebrow: q('[data-s3-ed="eyebrow"]'),
    line1: q('[data-s3-ed="line1"] > span'),
    line2: q('[data-s3-ed="line2"] > span'),
    copy: q('[data-s3-ed="copy"]'),
    cta: q('[data-s3-ed="cta"]'),
    timeline: q('[data-s3-ed="timeline"]'),
  };

  if (layers.some((l) => !l) || cams.some((c) => !c)) return gsap.timeline();

  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    scrollTrigger: {
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: cinematicConfig.scrub,
      invalidateOnRefresh: true,
      onUpdate: (self) => onProgress?.(self.progress),
    },
  });

  /* ---- establishing shot: editorial enters, scene 01 image arrives ---- */
  if (ed.eyebrow) tl.fromTo(ed.eyebrow, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.01);
  if (ed.line1) tl.fromTo(ed.line1, { yPercent: 105 }, { yPercent: 0, duration: 0.06 }, 0.02);
  if (ed.line2) tl.fromTo(ed.line2, { yPercent: 105 }, { yPercent: 0, duration: 0.06 }, 0.03);
  if (ed.copy) tl.fromTo(ed.copy, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.045);
  if (ed.cta) tl.fromTo(ed.cta, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.055);
  if (ed.timeline) tl.fromTo(ed.timeline, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 0.06);
  if (ed.block) tl.fromTo(ed.block, { y: 0 }, { y: -6, duration: 1, ease: "none" }, 0); // micro-parallax

  const T = cinematicConfig.transitionDuration;

  processScenes.forEach((scene, i) => {
    const layer = layers[i]!;
    const cam = cams[i]!;

    /* image arrival / departure (overlapping crossfades) */
    const enter = i === 0 ? 0.02 : 0.25 * i - T / 2;
    const exit = i === 3 ? null : 0.25 * (i + 1) - T / 2;
    tl.fromTo(layer, { autoAlpha: 0, filter: "brightness(0.75)" }, { autoAlpha: 1, filter: "brightness(1)", duration: T, ease: "power2.inOut" }, enter);
    if (exit !== null) tl.to(layer, { autoAlpha: 0, filter: "brightness(0.85)", duration: T, ease: "power2.inOut" }, exit);

    /* virtual camera shot */
    tl.fromTo(
      cam,
      { scale: scene.camera.startScale, x: sp(scene.camera.startX, travel), y: sp(scene.camera.startY, travel) },
      { scale: scene.camera.endScale, x: sp(scene.camera.endX, travel), y: sp(scene.camera.endY, travel), duration: 0.25, ease: "none" },
      0.25 * i
    );

    /* narration follows the visual event */
    const tIn = i === 0 ? 0.06 : 0.25 * i + 0.02;
    const text = texts[i];
    const numIn = numInners[i];
    if (text) tl.fromTo(text, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, tIn);
    if (numIn) tl.fromTo(numIn, { yPercent: 100 }, { yPercent: 0, duration: 0.05 }, tIn);
    if (titles[i]) tl.fromTo(titles[i], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.05 }, tIn + 0.015);
    if (descs[i]) tl.fromTo(descs[i], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.05 }, tIn + 0.03);
    if (i < 3) {
      const tOut = 0.25 * (i + 1) - 0.04;
      if (text) tl.to(text, { autoAlpha: 0, duration: 0.04 }, tOut);
      if (numIn) tl.to(numIn, { yPercent: -100, duration: 0.04, ease: "power3.in" }, tOut);
      if (titles[i]) tl.to(titles[i], { y: -18, duration: 0.04 }, tOut);
      if (descs[i]) tl.to(descs[i], { y: -18, duration: 0.04 }, tOut);
    }

    /* timeline node activation */
    const at = i === 0 ? 0.06 : 0.25 * i;
    if (dots[i]) tl.fromTo(dots[i], { scale: 0 }, { scale: 1, duration: 0.03, ease: "power2.out" }, at);
    if (rings[i]) tl.fromTo(rings[i], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.03 }, at);
    if (nums[i]) tl.to(nums[i], { color: "#e7e2d9", duration: 0.03 }, at);
  });

  /* continuous progress line */
  if (progress) tl.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "none" }, 0);

  /* warm exposure sweep at each scene boundary */
  if (sweep) {
    [0.25, 0.5, 0.75].forEach((b) => {
      tl.fromTo(sweep, { xPercent: -35, opacity: 0 }, { opacity: cinematicConfig.lightSweepOpacity, duration: 0.03, ease: "power1.in" }, b - 0.02);
      tl.to(sweep, { xPercent: 35, opacity: 0, duration: 0.05, ease: "power1.out" }, b + 0.01);
    });
  }

  return tl;
}

export { getActiveScene };