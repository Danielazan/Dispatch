/* ============ carrier-types v3 ============ */
export type CarrierStatus = 'draft' | 'submitted' | 'admin_review' | 'approved' | 'rejected' | 'active' | 'suspended';
export type VerificationStatus = 'pending' | 'verified' | 'not_found' | 'mismatch' | 'inconclusive' | 'manual_pending' | 'admin_confirmed' | 'rejected';
export type AgreementStatus = 'pending' | 'sent' | 'signed' | 'declined' | 'voided' | 'expired' | 'failed';
export type DocumentType = 'mc_authority_letter' | 'certificate_of_insurance' | 'w9_or_w8bene' | 'noa';
export type DocumentReview = 'pending' | 'accepted' | 'rejected';

export interface CarrierDocument {
  id: string; carrierId: string; documentType: DocumentType; filePath: string;
  fileName: string; fileSize: number; mimeType: string; reviewStatus: DocumentReview;
  reviewNotes?: string | null; createdAt: string; updatedAt: string;
}
export interface VerificationResult {
  id: string; method: string; inputNumber: string; inputCountry: string;
  resultStatus: string; reviewedByAdminId: string | null; createdAt: string;
}
export interface AgreementRecord {
  id: string; method: 'docusign' | 'custom_capture'; status: AgreementStatus;
  signerName: string | null; signedAt: string | null; consentTextShown: string; createdAt: string;
}
export interface CarrierFile {
  id: string; legalName: string; dbaName: string | null; authorityNumber: string | null;
  dotNumber: string | null; ein: string | null; address: string | null; phone: string | null;
  email: string | null; paymentPreference: string | null; factoringCompanyName: string | null;
  status: CarrierStatus; verificationStatus: VerificationStatus; agreementStatus: AgreementStatus;
  rejectReason: string | null; createdAt: string; updatedAt: string;
  documents: CarrierDocument[]; verificationResults: VerificationResult[]; agreements: AgreementRecord[];
  onboardingSession: { id: string; lead?: { id: string; email: string; status: string }; submittedAt?: string } | null;
  onboardingSessionId: string;
}
export interface CarrierSummary {
  id: string; legalName?: string | null; authorityNumber?: string | null; dotNumber?: string | null;
  status?: string; verificationStatus?: string; agreementStatus?: string; createdAt?: string | null;
}
export interface Page<T> { items: T[]; page: number; pageSize: number; totalItems: number; totalPages: number; }
export const DOC_LABEL: Record<string, string> = {
  mc_authority_letter: 'MC Authority Letter', certificate_of_insurance: 'Certificate of Insurance',
  w9_or_w8bene: 'W-9 / W-8BEN', noa: 'Notice of Assignment (NOA)',
};
