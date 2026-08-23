/* ============ carrier-data v2 ============ */
import { apiGet, apiPatch, downloadBlob, apiBlob } from '@/lib/api-client';
import type { CarrierFile, CarrierSummary, Page } from './carrier-types';

export const carrierApi = {
  list: (page: number, pageSize: number, status?: string) =>
    apiGet<Page<CarrierSummary>>('/api/carriers?page=' + page + '&pageSize=' + pageSize + (status ? '&status=' + status : '')),

  file: (id: string) => apiGet<CarrierFile>('/api/carriers/' + id),

  reviewDocument: (docId: string, body: { status: 'accepted' | 'rejected'; notes?: string }) =>
    apiPatch('/api/carrier-documents/' + docId + '/review', body),

  downloadDocument: (docId: string, filename: string) =>
    downloadBlob('/api/carrier-documents/' + docId + '/download', filename),

  /* v2: in-browser preview via authenticated blob (§6.6) */
  previewDocument: (docId: string) =>
    apiBlob('/api/carrier-documents/' + docId + '/download'),

  overrideVerification: (resultId: string, body: { status: string; adminNotes?: string }) =>
    apiPatch<{ newVerificationStatus: string }>('/api/verification-results/' + resultId + '/override', body),

  approve: (id: string) => apiPatch('/api/carriers/' + id + '/approve'),
  activate: (id: string) => apiPatch('/api/carriers/' + id + '/activate'),
  reject: (id: string, reason: string) => apiPatch('/api/carriers/' + id + '/reject', { reason }),
};
