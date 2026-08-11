export const siteConfig = {
  brand: "IRONHAUL",
  descriptor: "DISPATCH",
  phone: "(833) 476-4278",
  phoneHref: "tel:+18334764278",
  hours: "Mon – Sat 7AM – 7PM CST",
} as const;

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  // { label: "SERVICES", href: "#services" },
  { label: "SERVICES", href: "#what-we-do" },
  { label: "HOW IT WORKS", href: "#how-it-works" },
  { label: "PRICING", href: "#pricing" },
  { label: "REVIEWS", href: "#reviews" },
  { label: "RESOURCES", href: "#resources", external: true },
];