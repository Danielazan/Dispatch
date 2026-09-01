import { DOCUMENT_TYPE } from '../config/constants.js';

const REQUIRED_CARRIER_FIELDS = [
  'legalName', 'authorityNumber', 'dotNumber', 'ein', 'address', 'phone', 'email',
  'paymentPreference',
  'activeTrucksCount',
  'preferredOrigins', 'preferredDestinations',
  'dispatchContactName', 'dispatchPhone', 'dispatchEmail',
];

const BASE_REQUIRED_DOCUMENTS = [
  DOCUMENT_TYPE.MC_AUTHORITY_LETTER,
  DOCUMENT_TYPE.CERTIFICATE_OF_INSURANCE,
  DOCUMENT_TYPE.W9_OR_W8BENE,
];

export function evaluateSubmission(session) {
  const carrier = session.carrier || {};
  const documents = session.carrier?.documents || [];

  const missingCarrierFields = [];
  for (const field of REQUIRED_CARRIER_FIELDS) {
    const val = carrier[field];
    if (val === null || val === undefined || val === '') {
      missingCarrierFields.push(field);
    } else if (typeof val === 'string' && val.trim() === '') {
      missingCarrierFields.push(field);
    }
  }

  // Decision 7: NOA is required if factoring applies
  const requiresNoa =
    carrier.paymentPreference === 'Freight Factoring' ||
    (carrier.factoringCompanyName && carrier.factoringCompanyName.trim() !== '');

  const requiredDocTypes = requiresNoa
    ? [...BASE_REQUIRED_DOCUMENTS, DOCUMENT_TYPE.NOA]
    : [...BASE_REQUIRED_DOCUMENTS];

  const uploadedDocTypes = new Set(documents.map((d) => d.documentType));
  const missingDocuments = requiredDocTypes.filter((type) => !uploadedDocTypes.has(type));

  return {
    complete: missingCarrierFields.length === 0 && missingDocuments.length === 0,
    missingCarrierFields,
    missingDocuments,
  };
}