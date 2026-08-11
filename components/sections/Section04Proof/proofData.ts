import { section04Assets } from "./proofAssets";

export interface Testimonial {
  id: string;
  rating: number;
  quote: string;
  name: string;
  role: string;
  equipment: string;
  image: string | null;
}

export const testimonials: Testimonial[] = [
  {
    id: "chris",
    rating: 5,
    quote: "Ironhaul Dispatch keeps me rolling. They find the right loads and I stay on the road where I need to be.",
    name: "Chris R.",
    role: "Owner-Operator",
    equipment: "Dry Van",
    image: section04Assets.testimonials.chris,
  },
  {
    id: "david",
    rating: 5,
    quote: "Best dispatch service I've worked with. Fast response, great rates, and zero headaches.",
    name: "David P.",
    role: "Fleet Owner",
    equipment: "Reefer",
    image: section04Assets.testimonials.david,
  },
  {
    id: "jason",
    rating: 5,
    quote: "Professional team that actually cares about your business. Highly recommended.",
    name: "Jason T.",
    role: "Owner-Operator",
    equipment: "Flatbed",
    image: section04Assets.testimonials.jason,
  },
];

export interface ProofStat {
  key: "states" | "loads" | "miles" | "rating";
  value: string;
  labelLines: string[];
  star?: boolean;
}

export const proofStats: ProofStat[] = [
  { key: "states", value: "48", labelLines: ["STATES", "COVERED"] },
  { key: "loads", value: "1,200+", labelLines: ["DAILY LOADS", "PROCESSED"] },
  { key: "miles", value: "12M+", labelLines: ["MILES", "DISPATCHED"] },
  { key: "rating", value: "4.9", labelLines: ["AVERAGE CARRIER", "RATING"], star: true },
];

/* Typographic placeholders — swap for approved logo assets when supplied. */
export const carriers = [
  { id: "freightliner", label: "FREIGHTLINER", className: "font-semibold tracking-[0.22em]" },
  { id: "peterbilt", label: "Peterbilt", className: "font-serif italic tracking-[0.04em]" },
  { id: "volvo", label: "VOLVO", className: "font-light tracking-[0.34em]" },
  { id: "kenworth", label: "KENWORTH", className: "border border-current px-2 py-0.5 tracking-[0.14em]" },
  { id: "mack", label: "MACK", className: "font-black tracking-[0.08em]" },
] as const;