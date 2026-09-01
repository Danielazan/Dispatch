/* ============ site v2 (PART 4 / GAP-013) ============ */
/*
SITE CONFIG â€” single source for all brand strings (Â§1.7/Â§24).
Brand decision: AIK Dispatch Solution Inc.
*/
export const siteConfig = {
  brand: "AIK",
  descriptor: "FREIGHT DISPATCH",
  phone: "(833) 476-4278",
  phoneHref: "tel:+18334764278",
  hours: "Mon â€“ Sat 7AM â€“ 7PM CST",
} as const;

export interface NavLink { label: string; href: string; external?: boolean; }
export const NAV_LINKS: NavLink[] = [
  { label: "SERVICES", href: "#what-we-do" },
  { label: "HOW IT WORKS", href: "#how-it-works" },
  { label: "PRICING", href: "#pricing" },
  { label: "REVIEWS", href: "#reviews" },
  { label: "RESOURCES", href: "#resources", external: true },
];

export const site = {
  brand: "AIK Dispatch Solution Inc",
  wordmark: "AIK Dispatch Solution Inc",
  wordmarkSub: "D I S P A T C H",
  tagline: ["DRIVING OPPORTUNITY.", "DELIVERING MORE."],
  portal: "Carrier Onboarding Portal",
  sidebar: { title: "CARRIER ONBOARDING", meta: ["Secure", "Verified", "Trusted"] },
  footer: {
    line1: "AIK Dispatch Solution Inc",
    line2: "Carrier Onboarding Portal",
    meta: ["All times in UTC", "Version 1.0.0", "Â© 2025 AIK Dispatch Solution Inc, LLC", "Secure Connection"],
  },
  support: {
    title: "Need Help?",
    body: "Our team is here to assist you at any point during onboarding.",
    cta: "Contact Support",
    href: "",
  },
  /* PART 4 / GAP-013 â€” Get Help channels (option a: direct links).
     Q3 FLAG: email is a PLACEHOLDER until the final domain is confirmed.
     WhatsApp defaults to the same line as phone â€” swap here only. */
  supportChannels: {
    phoneLabel: "(833) 476-4278",
    phoneHref: "tel:+18334764278",
    whatsapp: "18334764278", // international format, digits only, no +
    whatsappPrefill: "Hello AIK Dispatch Solution Inc â€” I need help with my carrier onboarding.",
    email: "onyijodan@gmail.com", // PLACEHOLDER â€” replace per Q3
    hours: "Mon â€“ Sat: 7AM â€“ 7PM CST",
  },
  saveReminder:
    "You can save and exit anytime. Return to continue where you left off. All progress is safely saved automatically.",
  welcomeEyebrow: "WELCOME TO AIK Dispatch Solution Inc",
  welcomeHeadline:
    "Complete your carrier profile to get access to our load board and start hauling with us.",
  candidate: "Carrier Candidate",
  promo: ["STRONG CARRIERS.", "A STRONGER", "TOMORROW."],
  infoWhy:
    "This information helps us verify your business, create your carrier profile, and ensure compliance with FMCSA requirements.",
  infoSecure:
    "All data is encrypted and handled in accordance with our privacy and security standards.",
} as const;

/* Mirror of backend src/config/legalText.js (provided verbatim). PLACEHOLDER â€” not for client-facing launch. */
export const LEGAL_TEXT = {
  agreementTitle: "Legal Representation Authorization",
  agreementBody: "PLACEHOLDER â€” final agreement text must be provided and approved before production launch.",
  consentCheckboxLabel: "PLACEHOLDER â€” final consent language must be provided before production launch.",
} as const;

export type MediaAsset = {
  id: string;
  src: string;
  alt: string;
  focalPoint?: { x: number; y: number };
  priority?: boolean;
  mobileSrc?: string;
};
export const mediaLibrary: Record<string, MediaAsset> = {
  onboardingTruck: {
    id: "onboarding-truck",
    src: "/images/onboarding/onboarding-truck.png",
    alt: "Freight truck traveling through a mountain corridor at night",
    focalPoint: { x: 0.62, y: 0.52 },
    priority: true,
  },
};