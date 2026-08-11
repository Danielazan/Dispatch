import { cameraPresets, type CameraPreset } from "./cinematicConfig";
import { section03Assets } from "./section03Assets";

export interface ProcessScene {
  id: string;
  number: string;
  titleLines: string[];
  description: string;
  desktopImage?: string | null;
  mobileImage?: string | null;
  desktopPosition: string;
  mobilePosition: string;
  grade: string;
  fallback: { glowX: string; glowY: string; glowAlpha: number };
  camera: CameraPreset;
}

export const processScenes: ProcessScene[] = [
  {
    id: "details",
    number: "01",
    titleLines: ["YOU SHARE", "YOUR DETAILS"],
    description: "Tell us your equipment, preferred lanes, and availability.",
    desktopImage: section03Assets.scene01,
    mobileImage: section03Assets.scene01Mobile,
    desktopPosition: "center center",
    mobilePosition: "60% center",
    grade: "var(--s3-grade-1)",
    fallback: { glowX: "30%", glowY: "36%", glowAlpha: 0.1 },
    camera: cameraPresets.details,
  },
  {
    id: "negotiation",
    number: "02",
    titleLines: ["WE FIND & NEGOTIATE", "TOP LOADS"],
    description: "We search our network and negotiate the best rates for you.",
    desktopImage: section03Assets.scene02,
    mobileImage: section03Assets.scene02Mobile,
    desktopPosition: "center center",
    mobilePosition: "50% center",
    grade: "var(--s3-grade-2)",
    fallback: { glowX: "66%", glowY: "40%", glowAlpha: 0.08 },
    camera: cameraPresets.negotiation,
  },
  {
    id: "delivery",
    number: "03",
    titleLines: ["YOU PICK UP", "& DELIVER"],
    description: "We handle the paperwork and track your load every step of the way.",
    desktopImage: section03Assets.scene03,
    mobileImage: section03Assets.scene03Mobile,
    desktopPosition: "55% center",
    mobilePosition: "68% center",
    grade: "var(--s3-grade-3)",
    fallback: { glowX: "62%", glowY: "62%", glowAlpha: 0.16 },
    camera: cameraPresets.delivery,
  },
  {
    id: "payment",
    number: "04",
    titleLines: ["YOU GET PAID", "FASTER"],
    description: "We handle invoicing and accelerate your cash flow.",
    desktopImage: section03Assets.scene04,
    mobileImage: section03Assets.scene04Mobile,
    desktopPosition: "center center",
    mobilePosition: "center center",
    grade: "var(--s3-grade-4)",
    fallback: { glowX: "50%", glowY: "30%", glowAlpha: 0.14 },
    camera: cameraPresets.payment,
  },
];