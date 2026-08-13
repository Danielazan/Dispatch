/* ============================================================
   SECTION 07 — DATA / ASSET MAP
   Single source of truth for footer content. If the supplied
   truck image filename differs, update `footerAssets` ONLY.
   ============================================================ */

export const footerAssets = {
  truck: "/images/section-07/footer-truck.png",
} as const;

/** Debug toggle — may expose ScrollTrigger markers + stage logs. Never ship enabled. */
export const DEBUG_SECTION_07 = false;

export const footerBrand = {
  description:
    "Premium freight dispatch services for owner-operators and small fleets across North America.",
};

export interface FooterLink {
  label: string;
  href: string;
}

/* TODO(integration): replace "#" placeholders with production routes as they exist.
   "#" is used here strictly as a temporary development placeholder (§52). */
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
      { label: "Contact Us", href: "#lead-form" }, // resolves to Section 06 intake
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

/* Authoritative project contact values (reference spec §25).
   If real values exist elsewhere in the project, replace here only. */
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

/* TODO(integration): replace "#" with production social URLs when available. */
export const footerSocial: SocialLink[] = [
  { label: "Facebook", href: "#", icon: "facebook" },
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "YouTube", href: "#", icon: "youtube" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
];

/* TODO(integration): wire legal routes when the pages exist. */
export const footerLegalLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];