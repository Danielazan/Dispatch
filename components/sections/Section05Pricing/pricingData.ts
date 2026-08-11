import { ShieldCheck, Wallet, Headphones, RotateCcw, type LucideIcon } from "lucide-react";

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  price: string;
  unit: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "solo-driver",
    name: "SOLO DRIVER",
    price: "6%",
    unit: "OF GROSS RATE",
    description: "Best for new authority and solo drivers",
    features: ["Load sourcing", "Rate negotiation", "Paperwork handling", "Basic tracking"],
    cta: "GET STARTED",
  },
  {
    id: "owner-operator",
    name: "OWNER OPERATOR",
    badge: "MOST POPULAR",
    price: "9%",
    unit: "OF GROSS RATE",
    description: "Our most popular plan for growing carriers",
    features: ["Everything in Solo", "Advanced tracking", "Detention assistance", "Priority support"],
    cta: "GET STARTED",
    featured: true,
  },
  {
    id: "fleet",
    name: "FLEET",
    price: "CUSTOM",
    unit: "PRICING",
    description: "For fleets and multiple trucks",
    features: ["Dedicated dispatcher", "Custom solutions", "Performance reporting", "24/7 priority support"],
    cta: "CONTACT SALES",
  },
];

export interface Assurance {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const assurances: Assurance[] = [
  { id: "no-setup", title: "NO SETUP FEES", description: "Get started for free", icon: ShieldCheck },
  { id: "no-monthly", title: "NO MONTHLY FEES", description: "Pay only when we book", icon: Wallet },
  { id: "human-support", title: "ACTUAL HUMAN SUPPORT", description: "Real people, real help", icon: Headphones },
  { id: "cancel-anytime", title: "CANCEL ANYTIME", description: "No contracts, no problems", icon: RotateCcw },
];