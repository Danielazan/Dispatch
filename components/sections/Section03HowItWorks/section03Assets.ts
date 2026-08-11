/*
  ASSET MANIFEST — Section 03.
  No scene photography exists yet → all slots null → SceneBackground renders
  the controlled cinematic gradient fallback (never a broken image).

  TO CONNECT REAL IMAGES: drop webp/avif files into public/images/section-03/
  and set the paths below. Desktop + mobile crops supported. No JSX changes.
*/
export const section03Assets = {
  scene01: "/images/section-03/driver-intake.png" as string | null, // "/images/section-03/scene-01-driver-intake.webp"
  scene02: "/images/section-03/load-negotiation.png" as string | null, // "/images/section-03/scene-02-load-negotiation.webp"
  scene03: "/images/section-03/truck-delivery.png" as string | null, // "/images/section-03/scene-03-truck-delivery.webp"
  scene04: "/images/section-03/payment-resolution.png" as string | null, // "/images/section-03/scene-04-payment-resolution.webp"
  scene01Mobile: "/images/section-03/driver-intake-mobile.png" as string | null,
  scene02Mobile: "/images/section-03/load-negotiation-mobile.png" as string | null,
  scene03Mobile: "/images/section-03/truck-delivery-mobile.png" as string | null,
  scene04Mobile: "/images/section-03/payment-resolution-mobile.png" as string | null,
} as const;