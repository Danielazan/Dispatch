/* Demonstration data only — replace later via typed API normalization. */

export type LoadStatus = "negotiating" | "available" | "booked";

export interface Load {
  id: string;
  status: LoadStatus;
  pickup: string;
  dropoff: string;
  rate: string;
  ratePerMile: string;
  distance: string;
  equipment: string;
}

export const LOADS: Load[] = [
  {
    id: "40291",
    status: "negotiating",
    pickup: "DALLAS, TX",
    dropoff: "ATLANTA, GA",
    rate: "$3,140",
    ratePerMile: "$2.87/MI",
    distance: "1,097 MI",
    equipment: "DRY VAN",
  },
  {
    id: "40292",
    status: "available",
    pickup: "CHICAGO, IL",
    dropoff: "MEMPHIS, TN",
    rate: "$2,650",
    ratePerMile: "$2.72/MI",
    distance: "974 MI",
    equipment: "REEFER",
  },
  {
    id: "40290",
    status: "booked",
    pickup: "LOS ANGELES, CA",
    dropoff: "PHOENIX, AZ",
    rate: "$1,920",
    ratePerMile: "$2.95/MI",
    distance: "651 MI",
    equipment: "POWER ONLY",
  },
];

export const LOAD_BOARD_UPDATED_AT = "UPDATED 10:42 AM";

export type EquipmentId =
  | "dry-van"
  | "reefer"
  | "flatbed"
  | "power-only"
  | "hotshot"
  | "box-truck";

export const EQUIPMENT: { id: EquipmentId; label: string }[] = [
  { id: "dry-van", label: "DRY VAN" },
  { id: "reefer", label: "REEFER" },
  { id: "flatbed", label: "FLATBED" },
  { id: "power-only", label: "POWER ONLY" },
  { id: "hotshot", label: "HOTSHOT" },
  { id: "box-truck", label: "BOX TRUCK" },
];

export type StatId = "carriers" | "rate" | "response" | "ontime";

export const HERO_STATS: { id: StatId; value: string; label: string }[] = [
  { id: "carriers", value: "340+", label: "ACTIVE CARRIERS" },
  { id: "rate", value: "$3.14", label: "AVG RATE PER MILE" },
  { id: "response", value: "<20 MIN", label: "AVERAGE RESPONSE" },
  { id: "ontime", value: "97%", label: "ON-TIME RATE" },
];

export const RECENT_BOOKINGS: { route: string; rate: string }[] = [
  { route: "DALLAS, TX → NASHVILLE, TN", rate: "$2,780" },
  { route: "HOUSTON, TX → ATLANTA, GA", rate: "$3,220" },
  { route: "CHICAGO, IL → ST. LOUIS, MO", rate: "$1,850" },
  { route: "DENVER, CO → SALT LAKE CITY, UT", rate: "$2,310" },
  { route: "ORLANDO, FL → MIAMI, FL", rate: "$1,140" },
];