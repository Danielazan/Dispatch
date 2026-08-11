/*
  ASSET LAYER — single source of truth for imagery.

  Audit result today: no image assets exist in /public yet.
  Therefore `background` is null and HeroBackground renders a clearly-marked
  placeholder environment (gradient dusk + silhouette truck) so the composition
  can be reviewed now.

  TO CONNECT THE REAL PHOTO:
    1. Drop the file at  public/images/hero/hero-background.webp
    2. Set background: "/images/hero/hero-background.webp"
  The placeholder scene is then skipped automatically. No JSX/layout changes.
  If the truck is a SEPARATE transparent asset later, add its path under `truck`
  and render it in the HeroTruck slot (see HeroSection layer stack).
*/
export const assets = {
  hero: {
    background: "/images/hero/hero-background.png" as string | null, // e.g. "/images/hero/hero-background.webp"
    truck: null as string | null,      // separate transparent truck, if ever supplied
    routeMap: "/images/hero/raster_map.png" as string | null,   // raster map, if ever supplied (else inline SVG)
    logo: null as string | null,       // svg logo, if ever supplied (else type lockup)
  },
} as const;