/*
  ASSET CONFIG — Section 02.
  No custom service imagery exists yet, so every slot is undefined and the
  cards render the unified Lucide line-icon system (per master prompt §19/§48).

  TO ENABLE CUSTOM IMAGES LATER: drop webp/svg files into
  public/images/section-02/ and set the matching path below.
  The card component switches icon → image automatically. No JSX rewrite.
*/
export const section02Assets = {
  loadSourcing: undefined as string | undefined,        // "/images/section-02/load-sourcing.webp"
  rateNegotiation: undefined as string | undefined,     // "/images/section-02/rate-negotiation.webp"
  paperworkCompliance: undefined as string | undefined, // "/images/section-02/paperwork-compliance.webp"
  realTimeTracking: undefined as string | undefined,    // "/images/section-02/real-time-tracking.webp"
  invoicingFactoring: undefined as string | undefined,  // "/images/section-02/invoicing-factoring.webp"
  routePlanning: undefined as string | undefined,       // "/images/section-02/route-planning.webp"
} as const;