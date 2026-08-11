/*
  ASSET MANIFEST — Section 04.
  No portraits/map exist yet → null → safe fallbacks render
  (initials disc for people, SVG network silhouette for the map).
  Drop real files into /public/images/section-04/ and set paths here only.
*/
export const section04Assets = {
  testimonials: {
    chris: "/images/section-04/testimonials/chris-r.png" as string | null, // "/images/section-04/testimonials/chris-r.png"
    david: "/images/section-04/testimonials/david-p.png" as string | null, // "/images/section-04/testimonials/david-p.png"
    jason: "/images/section-04/testimonials/jason-t.png" as string | null, // "/images/section-04/testimonials/jason-t.png"
  },
  coverageMap: "/images/section-04/north-america-coverage-map.png" as string | null, // "/images/section-04/north-america-coverage-map.png"
} as const;