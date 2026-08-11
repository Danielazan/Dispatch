/* Single source for motion tuning — no magic numbers in components. */
export const cinematicConfig = {
  trackHeight: "280vh",
  scrub: 0.9,
  transitionDuration: 0.07,
  grainOpacity: 0.035,
  lightSweepOpacity: 0.08,
  /** Dev-only overlay (progress / active scene). Never ship true. */
  debug: false,
} as const;

export interface CameraPreset {
  startScale: number;
  endScale: number;
  startX: string;
  endX: string;
  startY: string;
  endY: string;
}

export const cameraPresets: Record<"details" | "negotiation" | "delivery" | "payment", CameraPreset> = {
  details:     { startScale: 1.0,   endScale: 1.055, startX: "0%",  endX: "-1%", startY: "0%", endY: "-1%" },
  negotiation: { startScale: 1.035, endScale: 1.075, startX: "-2%", endX: "2%",  startY: "0%", endY: "-1%" },
  delivery:    { startScale: 1.025, endScale: 1.12,  startX: "0%",  endX: "-2%", startY: "1%", endY: "-1%" },
  payment:     { startScale: 1.1,   endScale: 1.02,  startX: "-1%", endX: "0%",  startY: "0%", endY: "1%" },
};

export const getActiveScene = (p: number): 0 | 1 | 2 | 3 => {
  if (p < 0.25) return 0;
  if (p < 0.5) return 1;
  if (p < 0.75) return 2;
  return 3;
};