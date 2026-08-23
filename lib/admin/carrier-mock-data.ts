/* ============ carrier-mock-data v1 ============ */
/**
 * Demo-mode adapter. Integration pass: swap bodies for api-client calls —
 * GET /api/carriers/{id}, PATCH .../approve|activate|reject,
 * PATCH /api/carrier-documents/{id}/review, PATCH /api/verification-results/{id}/override.
 * Mock enforces the SAME rules the backend enforces (Decisions 10/11/14/16) so 409/400 UX is real.
 */
import type {
  AgreementRecord, CarrierDocument, CarrierFile, VerificationResult,
} from './carrier-types';

export class CarrierApiError extends Error {
  status: number;
  code: string;
  details?: { path: string; message: string }[];
  constructor(status: number, code: string, message: string, details?: { path: string; message: string }[]) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Append-only history is authoritative by latest createdAt — selector, not data[0]. */
export function getLatestAgreement(f: CarrierFile): AgreementRecord | null {
  if (f.agreements.length === 0) return null;
  return [...f.agreements].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
}

const TITAN: CarrierFile = {
  id: 'submitted-1',
  legalName: 'Titan Freight Systems',
  dbaName: 'Titan Freight Systems',
  authorityNumber: 'MC# 2345678',
  dotNumber: '1234567',
  ein: '12-3456789',
  address: '123 Industrial Pkwy, Chicago, IL 60601',
  phone: '(312) 555-0142',
  email: 'james@titanfreight.com',
  paymentPreference: 'Freight Factoring',
  factoringCompanyName: 'Titan Factoring Co.',
  status: 'admin_review',
  verificationStatus: 'manual_pending',
  agreementStatus: 'signed',
  rejectReason: null,
  submittedAt: 'May 20, 2025 • 2:14 PM',
  documents: [
    { id: 'doc-t1', documentType: 'mc_authority_letter', originalFilename: 'titan-mc-letter.pdf', reviewStatus: 'accepted', reviewNotes: null, uploadedAt: 'May 20, 2025 • 2:20 PM' },
    { id: 'doc-t2', documentType: 'certificate_of_insurance', originalFilename: 'titan-coi.pdf', reviewStatus: 'pending', reviewNotes: null, uploadedAt: 'May 20, 2025 • 2:24 PM' },
    { id: 'doc-t3', documentType: 'w9_or_w8bene', originalFilename: 'titan-w9.pdf', reviewStatus: 'rejected', reviewNotes: 'W-9 signature missing — re-upload a signed copy.', uploadedAt: 'May 20, 2025 • 2:27 PM' },
    { id: 'doc-t4', documentType: 'noa', originalFilename: 'titan-noa.pdf', reviewStatus: 'pending', reviewNotes: null, uploadedAt: 'May 20, 2025 • 2:30 PM' },
  ],
  verificationResults: [
    { id: 'vr-t1', method: 'format_check', inputNumber: 'MC# 2345678', inputCountry: 'USA', resultStatus: 'manual_pending', reviewedByAdminId: null, createdAt: 'May 20, 2025 • 2:15 PM' },
  ],
  agreements: [
    { id: 'ag-t1', method: 'custom_capture', status: 'signed', signerName: 'James Peterson', signedAt: 'May 20, 2025 • 3:02 PM', consentTextShown: 'PLACEHOLDER LEGAL TEXT — not final (Decision 32).', createdAt: 'May 20, 2025 • 3:02 PM' },
  ],
  onboardingSession: { lead: { id: 'LD-2025-05120', email: 'james@titanfreight.com', status: 'onboarding_submitted' } },
};

function fallbackFile(id: string): CarrierFile {
  const n = Number(id.replace(/\D/g, '')) || 7;
  const names = ['Road King Logistics', 'Summit Transport LLC', 'Velocity Carriers Inc.', 'Northern Star Freight', 'Swift Transport Group', 'Blue Line Freight', 'Prime Haulers Inc.'];
  const name = names[n % names.length];
  return {
    id,
    legalName: name, dbaName: name,
    authorityNumber: `MC# ${2000000 + n * 137}`, dotNumber: `${1000000 + n * 91}`, ein: `12-${3456780 + n}`,
    address: '400 Freight Way, Dallas, TX 75201', phone: `(312) 555-01${String(10 + n).slice(-2)}`,
    email: `dispatch@${name.toLowerCase().replace(/[^a-z]+/g, '').slice(0, 12)}.com`,
    paymentPreference: 'QuickPay', factoringCompanyName: null,
    status: 'admin_review',
    verificationStatus: 'manual_pending',
    agreementStatus: 'sent', // deliberately NOT signed → demos the second blocking precondition
    rejectReason: null,
    submittedAt: 'May 19, 2025 • 4:22 PM',
    documents: [
      { id: `doc-${id}-1`, documentType: 'mc_authority_letter', originalFilename: 'mc-letter.pdf', reviewStatus: 'pending', reviewNotes: null, uploadedAt: 'May 19, 2025 • 4:30 PM' },
      { id: `doc-${id}-2`, documentType: 'certificate_of_insurance', originalFilename: 'coi.pdf', reviewStatus: 'pending', reviewNotes: null, uploadedAt: 'May 19, 2025 • 4:33 PM' },
    ],
    verificationResults: [
      { id: `vr-${id}-1`, method: 'format_check', inputNumber: `MC# ${2000000 + n * 137}`, inputCountry: 'USA', resultStatus: 'manual_pending', reviewedByAdminId: null, createdAt: 'May 19, 2025 • 4:23 PM' },
    ],
    agreements: [
      { id: `ag-${id}-1`, method: 'custom_capture', status: 'sent', signerName: null, signedAt: null, consentTextShown: 'PLACEHOLDER LEGAL TEXT — not final (Decision 32).', createdAt: 'May 19, 2025 • 4:23 PM' },
    ],
    onboardingSession: { lead: { id: `LD-2025-051${20 + n}`, email: `dispatch@${name.toLowerCase().replace(/[^a-z]+/g, '').slice(0, 12)}.com`, status: 'onboarding_submitted' } },
  };
}

const STORE = new Map<string, CarrierFile>();

export async function getCarrierFile(id: string): Promise<CarrierFile> {
  await delay(320);
  if (id.includes('bogus')) throw new CarrierApiError(404, 'record_not_found', 'Carrier not found.');
  if (!STORE.has(id)) STORE.set(id, id === 'submitted-1' ? TITAN : fallbackFile(id));
  return STORE.get(id)!;
}

export const carrierActions = {
  /** PATCH /api/carrier-documents/{id}/review — documents.review */
  async reviewDocument(carrierId: string, documentId: string, body: { status: 'accepted' | 'rejected'; notes?: string }) {
    await delay(220);
    const f = STORE.get(carrierId);
    const doc = f?.documents.find((d) => d.id === documentId);
    if (!f || !doc) throw new CarrierApiError(404, 'record_not_found', 'Document not found.');
    if (body.status === 'rejected' && !body.notes?.trim()) {
      throw new CarrierApiError(400, 'validation_error', 'Please fix the highlighted fields.', [{ path: 'notes', message: 'Notes are required when rejecting a document.' }]);
    }
    doc.reviewStatus = body.status;
    doc.reviewNotes = body.status === 'rejected' ? (body.notes ?? null) : null;
    return { document: { ...doc } };
  },

  /** PATCH /api/verification-results/{id}/override — verification.override (Postman 06.03/06.04) */
  async overrideVerification(carrierId: string, resultId: string, body: { status: string; adminNotes?: string }) {
    await delay(220);
    const allowed = ['verified', 'not_found', 'mismatch', 'inconclusive', 'manual_pending', 'admin_confirmed', 'rejected'];
    if (!allowed.includes(body.status)) {
      throw new CarrierApiError(400, 'validation_error', 'Please fix the highlighted fields.', [{ path: 'status', message: 'Invalid verification status.' }]);
    }
    const f = STORE.get(carrierId);
    const vr = f?.verificationResults.find((v) => v.id === resultId);
    if (!f || !vr) throw new CarrierApiError(404, 'record_not_found', 'Verification result not found.');
    vr.resultStatus = body.status === 'admin_confirmed' ? 'verified' : vr.resultStatus;
    vr.reviewedByAdminId = 'adm-001';
    f.verificationStatus = body.status as CarrierFile['verificationStatus'];
    return { newVerificationStatus: f.verificationStatus };
  },

  /** PATCH /api/carriers/{id}/approve — carriers.approve (Decision 14 preconditions, 409 verbatim) */
  async approve(carrierId: string) {
    await delay(260);
    const f = STORE.get(carrierId);
    if (!f) throw new CarrierApiError(404, 'record_not_found', 'Carrier not found.');
    const blocks: string[] = [];
    if (f.status !== 'admin_review') blocks.push(`carrier status is ${f.status}, not admin_review`);
    if (f.verificationStatus !== 'admin_confirmed') blocks.push('verification not admin-confirmed');
    if (getLatestAgreement(f)?.status !== 'signed') blocks.push('latest agreement not signed');
    if (blocks.length) throw new CarrierApiError(409, 'approval_blocked', `Approval blocked: ${blocks.join('; ')}.`);
    f.status = 'approved'; // NOT active — Decision 10
    return { carrier: { ...f } };
  },

  /** PATCH /api/carriers/{id}/activate — carriers.approve (Decision 11) */
  async activate(carrierId: string) {
    await delay(260);
    const f = STORE.get(carrierId);
    if (!f) throw new CarrierApiError(404, 'record_not_found', 'Carrier not found.');
    if (f.status !== 'approved') throw new CarrierApiError(409, 'activation_blocked', `Activation blocked: carrier status is ${f.status}, not approved.`);
    f.status = 'active';
    if (f.onboardingSession) f.onboardingSession.lead.status = 'converted'; // Decision 16
    return { carrier: { ...f } };
  },

  /** PATCH /api/carriers/{id}/reject — carriers.approve (08.07 reason required) */
  async reject(carrierId: string, reason: string) {
    await delay(260);
    const f = STORE.get(carrierId);
    if (!f) throw new CarrierApiError(404, 'record_not_found', 'Carrier not found.');
    if (!reason?.trim()) {
      throw new CarrierApiError(400, 'validation_error', 'Please fix the highlighted fields.', [{ path: 'reason', message: 'A rejection reason is required.' }]);
    }
    f.status = 'rejected';
    f.rejectReason = reason.trim();
    // Lead stays onboarding_submitted — Decision 16: no automatic re-flip.
    return { carrier: { ...f } };
  },
};