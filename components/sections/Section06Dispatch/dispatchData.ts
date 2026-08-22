/* ============ dispatchData v2 ============ */
/*
v2 change: submitDispatchRequest now POSTs to /api/leads with the real
backend contract. Mapping:
  fullName      → contactName
  email         → email
  phone         → phone
  authorityNumber → authorityNumber
  consent       → consentAccepted: true
companyName is NOT sent (landing form doesn't collect it — Scene 1 captures
legalName later). Backend falls back to contactName for the Prisma column.

Enrichment fields (country, authorityType, scacCode, canadianCarrierCode,
companyTaxId, homeBase, message) are NOT sent — the backend's leads table
has no columns for them and Zod strips unknown keys silently. Flagged as
GAP-016 for a future enrichment phase.
*/

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export type DispatchFormStatus = 'idle' | 'submitting' | 'success' | 'error';

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
  fullName: '',
  email: '',
  phone: '',
  country: '',
  countryOther: '',
  authorityType: '',
  authorityNumber: '',
  authorityOther: '',
  scacCode: '',
  canadianCarrierCode: '',
  companyTaxId: '',
  homeBase: '',
  message: '',
  consent: false,
};

export type FieldKey =
  | 'fullName' | 'email' | 'phone' | 'country' | 'countryOther'
  | 'authorityType' | 'authorityNumber' | 'authorityOther'
  | 'scacCode' | 'canadianCarrierCode' | 'companyTaxId' | 'homeBase';

export const AUTHORITY_TYPE_OPTIONS = [
  'MC / DOT Number',
  'National Safety Code (NSC) Number',
  'Other',
] as const;

export const COUNTRY_OPTIONS = ['USA', 'Canada', 'Others'] as const;

export interface FieldConfig {
  key: FieldKey;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select';
  placeholder?: string;
  options?: readonly string[];
  required: boolean;
  optional?: boolean;
  group: 'A' | 'B';
  fullWidth?: boolean;
  showWhen?: (data: DispatchFormData) => boolean;
  dynamicPlaceholder?: (data: DispatchFormData) => string;
  /** Backend field path this config maps to (for error routing). */
  backendPath?: 'contactName' | 'email' | 'phone' | 'authorityNumber' | 'consentAccepted';
}

/* Render order = visual order in the 2-column grid. */
export const FIELD_CONFIGS: FieldConfig[] = [
  { key: 'fullName', label: 'FULL NAME', type: 'text', placeholder: 'Your full name', required: true, group: 'A', backendPath: 'contactName' },
  { key: 'email', label: 'EMAIL', type: 'email', placeholder: 'you@example.com', required: true, group: 'A', backendPath: 'email' },
  { key: 'phone', label: 'PHONE NUMBER', type: 'tel', placeholder: '(555) 123-4567', required: true, group: 'A', backendPath: 'phone' },
  { key: 'country', label: 'COUNTRY', type: 'select', options: COUNTRY_OPTIONS, required: true, group: 'A' },
  {
    key: 'countryOther',
    label: 'SPECIFY COUNTRY',
    type: 'text',
    placeholder: 'Enter your country',
    required: false,
    group: 'A',
    fullWidth: true,
    showWhen: (d) => d.country === 'Others',
  },
  { key: 'authorityType', label: 'AUTHORITY TYPE', type: 'select', options: AUTHORITY_TYPE_OPTIONS, required: true, group: 'A' },
  {
    key: 'authorityNumber',
    label: 'AUTHORITY NUMBER',
    type: 'text',
    required: true,
    group: 'B',
    backendPath: 'authorityNumber',
    dynamicPlaceholder: (d) =>
      d.authorityType === 'National Safety Code (NSC) Number'
        ? 'NSC Number'
        : d.authorityType === 'Other'
          ? 'Authority Number'
          : 'MC / DOT Number',
  },
  {
    key: 'authorityOther',
    label: 'SPECIFY AUTHORITY TYPE',
    type: 'text',
    placeholder: 'e.g. PHA Number',
    required: false,
    group: 'B',
    fullWidth: true,
    showWhen: (d) => d.authorityType === 'Other',
  },
  { key: 'scacCode', label: 'SCAC CODE', type: 'text', placeholder: 'e.g. ABCD', required: false, optional: true, group: 'B' },
  { key: 'canadianCarrierCode', label: 'CANADIAN CARRIER CODE', type: 'text', placeholder: 'e.g. 12345', required: false, optional: true, group: 'B' },
  { key: 'companyTaxId', label: 'COMPANY TAX ID', type: 'text', placeholder: 'e.g. 12-3456789', required: false, optional: true, group: 'B' },
  { key: 'homeBase', label: 'HOME BASE', type: 'text', placeholder: 'City, State', required: true, group: 'B' },
];

export function isFieldRequired(config: FieldConfig, data: DispatchFormData): boolean {
  if (config.required) return true;
  if (config.key === 'authorityOther') return data.authorityType === 'Other';
  if (config.key === 'countryOther') return data.country === 'Others';
  return false;
}

export function isFieldValueValid(config: FieldConfig, value: string | boolean, required: boolean): boolean {
  if (!required) return true;
  const str = String(value).trim();
  if (!str) return false;
  if (config.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  if (config.type === 'tel') return /^[\d\s()+\-.]{7,}$/.test(str);
  return true;
}

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

/* ---- v2: real submission result types ---- */
export interface SubmitSuccess {
  success: true;
  /** Echoed from the form — the email the onboarding link was sent to. */
  recipientEmail: string;
}

export interface SubmitValidationError {
  success: false;
  kind: 'validation';
  /** Map of backend path → human message. Keys are backend field paths
      (contactName, email, phone, authorityNumber, consentAccepted). */
  fieldErrors: Record<string, string>;
  message: string;
}

export interface SubmitRateLimited {
  success: false;
  kind: 'rate_limited';
  message: string;
}

export interface SubmitNetworkError {
  success: false;
  kind: 'network';
  message: string;
}

export interface SubmitServerError {
  success: false;
  kind: 'server';
  message: string;
}

export type SubmitResult =
  | SubmitSuccess
  | SubmitValidationError
  | SubmitRateLimited
  | SubmitNetworkError
  | SubmitServerError;

/**
 * v2: submit the lead form to the real backend.
 * Backend contract: POST {API_BASE}/api/leads
 *   { contactName, email, phone?, authorityNumber?, consentAccepted: true }
 *   → 201 { success: true, data: {} }    (token NEVER returned)
 *   → 400 { error: { code, message, details: [{ path, message }] } }
 *   → 429 { error: { code: 'rate_limited', message } }
 */
export async function submitDispatchRequest(data: DispatchFormData): Promise<SubmitResult> {
  const payload = {
    contactName: data.fullName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim() || undefined,
    authorityNumber: data.authorityNumber.trim() || undefined,
    consentAccepted: data.consent === true,
  };

  let response: Response;
  try {
    response = await fetch(`${API_BASE}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'omit', // public endpoint, no cookies involved
      cache: 'no-store',
    });
  } catch (err) {
    return {
      success: false,
      kind: 'network',
      message: 'Connection problem — please check your network and try again.',
    };
  }

  let body: any = null;
  try { body = await response.json(); } catch { /* non-JSON response */ }

  if (response.status === 201 && body?.success === true) {
    return { success: true, recipientEmail: data.email.trim() };
  }

  if (response.status === 429) {
    return {
      success: false,
      kind: 'rate_limited',
      message: body?.error?.message ?? 'Too many submissions — please wait a few minutes and try again.',
    };
  }

  if (response.status === 400 && body?.error?.code === 'validation_error') {
    const fieldErrors: Record<string, string> = {};
    for (const d of body.error.details ?? []) {
      if (d?.path) fieldErrors[String(d.path)] = d.message ?? 'Invalid';
    }
    return {
      success: false,
      kind: 'validation',
      fieldErrors,
      message: body.error.message ?? 'Please fix the highlighted fields.',
    };
  }

  return {
    success: false,
    kind: 'server',
    message: body?.error?.message ?? "We couldn't complete that request. Please try again.",
  };
}