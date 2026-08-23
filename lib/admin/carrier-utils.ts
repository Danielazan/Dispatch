/* ============ carrier-utils v1 ============ */
import type { CarrierFile, AgreementRecord } from './carrier-types';
export function getLatestAgreement(f: CarrierFile | null | undefined): AgreementRecord | null {
  if (!f || !Array.isArray(f.agreements) || f.agreements.length === 0) return null;
  return [...f.agreements].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
}
