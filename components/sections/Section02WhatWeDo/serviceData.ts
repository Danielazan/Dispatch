import {
  PackageSearch,
  ClipboardList,
  FileCheck2,
  MapPin,
  ReceiptText,
  Route,
  type LucideIcon,
} from "lucide-react";
import { section02Assets } from "./section02Assets";

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  image?: string;
}

export const SERVICES: ServiceItem[] = [
  {
    id: "load-sourcing",
    number: "01",
    title: "LOAD SOURCING",
    description: "We find high-paying loads that fit your equipment and preferences.",
    icon: PackageSearch,
    image: section02Assets.loadSourcing,
  },
  {
    id: "rate-negotiation",
    number: "02",
    title: "RATE NEGOTIATION",
    description: "We negotiate the best possible rate so you get every mile you deserve.",
    icon: ClipboardList,
    image: section02Assets.rateNegotiation,
  },
  {
    id: "paperwork-compliance",
    number: "03",
    title: "PAPERWORK & COMPLIANCE",
    description: "We handle rate confirmations, BOLs, and all the important paperwork.",
    icon: FileCheck2,
    image: section02Assets.paperworkCompliance,
  },
  {
    id: "real-time-tracking",
    number: "04",
    title: "REAL-TIME TRACKING",
    description: "We track your loads from pickup to delivery and keep you updated.",
    icon: MapPin,
    image: section02Assets.realTimeTracking,
  },
  {
    id: "invoicing-factoring",
    number: "05",
    title: "INVOICING & FACTORING",
    description: "Get paid faster with accurate invoicing and trusted factoring partners.",
    icon: ReceiptText,
    image: section02Assets.invoicingFactoring,
  },
  {
    id: "route-planning",
    number: "06",
    title: "ROUTE PLANNING",
    description: "We plan efficient routes to maximize your miles and minimize downtime.",
    icon: Route,
    image: section02Assets.routePlanning,
  },
];