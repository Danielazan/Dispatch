/* ============================================================
   SECTION 07 — DATA / ASSET MAP (v2)
   ============================================================ */

export const footerAssets = {
  truck: "/images/section-07/footer-truck.png",
} as const;

export const DEBUG_SECTION_07 = false;

export const footerBrand = {
  description:
    "Premium freight dispatch services for owner-operators and small fleets across North America.",
};

export interface FooterLink {
  label: string;
  href: string;
}

export const footerNavigation = {
  services: {
    title: "SERVICES",
    ariaLabel: "Services",
    links: [
      { label: "Load Sourcing", href: "#" },
      { label: "Rate Negotiation", href: "#" },
      { label: "Paperwork Handling", href: "#" },
      { label: "Tracking", href: "#" },
      { label: "Invoicing & Factoring", href: "#" },
      { label: "Route Planning", href: "#" },
    ],
  },
  company: {
    title: "COMPANY",
    ariaLabel: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "How It Works", href: "#" },
      { label: "Reviews", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Contact Us", href: "#lead-form" },
      { label: "Careers", href: "#" },
    ],
  },
  resources: {
    title: "RESOURCES",
    ariaLabel: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Tools & Calculators", href: "#" },
      { label: "Guides", href: "#" },
      { label: "Industry News", href: "#" },
      { label: "Service Areas", href: "#" },
    ],
  },
} as const;

export const footerContact = {
  phoneLabel: "(833) 476-4278",
  phoneHref: "tel:+18334764278",
  email: "dispatch@ironhaul.example",
  emailHref: "mailto:dispatch@ironhaul.example",
  location: "Dallas, TX",
  hours: "Mon – Sat: 7AM – 7PM CST",
};

export type SocialIconKey = "facebook" | "instagram" | "youtube" | "linkedin";

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIconKey;
}

export const footerSocial: SocialLink[] = [
  { label: "Facebook", href: "#", icon: "facebook" },
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "YouTube", href: "#", icon: "youtube" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
];

/* v2: Legal routes wired to /privacy and /terms (PART 7). */
export const footerLegalLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];
