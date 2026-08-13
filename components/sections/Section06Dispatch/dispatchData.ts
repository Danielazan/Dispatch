export type DispatchFormStatus = "idle" | "submitting" | "success" | "error";

export interface DispatchFormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  countryOther: string;
  authorityType: string;
  authorityNumber: string;
  authorityOther: string;
  scacCode: string;
  canadianCarrierCode: string;
  companyTaxId: string;
  homeBase: string;
  message: string;
  consent: boolean;
}

export const initialFormData: DispatchFormData = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  countryOther: "",
  authorityType: "",
  authorityNumber: "",
  authorityOther: "",
  scacCode: "",
  canadianCarrierCode: "",
  companyTaxId: "",
  homeBase: "",
  message: "",
  consent: false,
};

export type FieldKey =
  | "fullName" | "email" | "phone" | "country" | "countryOther"
  | "authorityType" | "authorityNumber" | "authorityOther"
  | "scacCode" | "canadianCarrierCode" | "companyTaxId" | "homeBase";

export const AUTHORITY_TYPE_OPTIONS = [
  "MC / DOT Number",
  "National Safety Code (NSC) Number",
  "Other",
] as const;

export const COUNTRY_OPTIONS = ["USA", "Canada", "Others"] as const;

export interface FieldConfig {
  key: FieldKey;
  label: string;
  type: "text" | "email" | "tel" | "select";
  placeholder?: string;
  options?: readonly string[];
  required: boolean;
  optional?: boolean;
  group: "A" | "B";
  fullWidth?: boolean;
  showWhen?: (data: DispatchFormData) => boolean;
  dynamicPlaceholder?: (data: DispatchFormData) => string;
}

/* Render order = visual order in the 2-column grid. */
export const FIELD_CONFIGS: FieldConfig[] = [
  { key: "fullName", label: "FULL NAME", type: "text", placeholder: "Your full name", required: true, group: "A" },
  { key: "email", label: "EMAIL", type: "email", placeholder: "you@example.com", required: true, group: "A" },
  { key: "phone", label: "PHONE NUMBER", type: "tel", placeholder: "(555) 123-4567", required: true, group: "A" },
  { key: "country", label: "COUNTRY", type: "select", options: COUNTRY_OPTIONS, required: true, group: "A" },
  {
    key: "countryOther",
    label: "SPECIFY COUNTRY",
    type: "text",
    placeholder: "Enter your country",
    required: false,
    group: "A",
    fullWidth: true,
    showWhen: (d) => d.country === "Others",
  },
  { key: "authorityType", label: "AUTHORITY TYPE", type: "select", options: AUTHORITY_TYPE_OPTIONS, required: true, group: "A" },
  {
    key: "authorityNumber",
    label: "AUTHORITY NUMBER",
    type: "text",
    required: true,
    group: "B",
    dynamicPlaceholder: (d) =>
      d.authorityType === "National Safety Code (NSC) Number"
        ? "NSC Number"
        : d.authorityType === "Other"
          ? "Authority Number"
          : "MC / DOT Number",
  },
  {
    key: "authorityOther",
    label: "SPECIFY AUTHORITY TYPE",
    type: "text",
    placeholder: "e.g. PHA Number",
    required: false,
    group: "B",
    fullWidth: true,
    showWhen: (d) => d.authorityType === "Other",
  },
  { key: "scacCode", label: "SCAC CODE", type: "text", placeholder: "e.g. ABCD", required: false, optional: true, group: "B" },
  { key: "canadianCarrierCode", label: "CANADIAN CARRIER CODE", type: "text", placeholder: "e.g. 12345", required: false, optional: true, group: "B" },
  { key: "companyTaxId", label: "COMPANY TAX ID", type: "text", placeholder: "e.g. 12-3456789", required: false, optional: true, group: "B" },
  { key: "homeBase", label: "HOME BASE", type: "text", placeholder: "City, State", required: true, group: "B" },
];

/* A field is required if it is statically required, or conditionally required
   (the two "specify" fields, which only exist when their parent select = Other/Others). */
export function isFieldRequired(config: FieldConfig, data: DispatchFormData): boolean {
  if (config.required) return true;
  if (config.key === "authorityOther") return data.authorityType === "Other";
  if (config.key === "countryOther") return data.country === "Others";
  return false;
}

export function isFieldValueValid(config: FieldConfig, value: string | boolean, required: boolean): boolean {
  if (!required) return true; // optional fields are always valid
  const str = String(value).trim();
  if (!str) return false;
  if (config.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  if (config.type === "tel") return /^[\d\s()+\-.]{7,}$/.test(str);
  return true;
}

/* Required total is dynamic: base 8 (7 fields + consent), +1 per active specify-field. */
export function getRequiredCount(data: DispatchFormData): number {
  let count = 1; // consent
  for (const config of FIELD_CONFIGS) {
    if (isFieldRequired(config, data)) count++;
  }
  return count;
}

export function getValidCount(data: DispatchFormData): number {
  let count = 0;
  for (const config of FIELD_CONFIGS) {
    if (config.showWhen && !config.showWhen(data)) continue;
    const required = isFieldRequired(config, data);
    if (required && isFieldValueValid(config, data[config.key], required)) count++;
  }
  if (data.consent) count++;
  return count;
}

/* TODO: connect to CRM / API / email service */
export async function submitDispatchRequest(data: DispatchFormData): Promise<{ success: boolean }> {
  // Mock: simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1800));
  void data; // suppress unused warning in mock
  return { success: true };
}