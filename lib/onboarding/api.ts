/* ============ api v5 ============ */
const BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export class OnboardingApiError extends Error {
  status: number;
  code: string;
  details?: { path: string; message: string }[];
  
  constructor(status: number, code: string, message: string, details?: any[]) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api/onboarding-sessions/${token}${path}`, { ...init, cache: 'no-store' });
  let body: any = null;
  try { body = await res.json(); } catch {}
  
  if (res.status === 404 && body?.error?.code === 'session_not_found') throw new OnboardingApiError(404, 'session_not_found', 'Session not found');
  if (res.status === 410 || body?.error?.code === 'expired') throw new OnboardingApiError(410, 'expired', 'Link expired');
  if (res.status === 423 || body?.error?.code === 'session_locked') throw new OnboardingApiError(423, 'session_locked', body?.error?.message ?? 'Session locked');
  
  if (!body || body.success === false) {
    throw new OnboardingApiError(res.status, body?.error?.code ?? 'unknown_error', body?.error?.message ?? 'Request failed', body?.error?.details);
  }
  return body.data as T;
}

export const obApi = {
  getSession: (token: string) => request<any>(token, ''),
  saveSection: (token: string, section: number, data: any) =>
    request<any>(token, '/carrier', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section, data }) }),
  uploadDocument: async (token: string, file: File, documentType: string) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('documentType', documentType);
    const res = await fetch(`${BASE}/api/onboarding-sessions/${token}/documents`, { method: 'POST', body: fd, cache: 'no-store' });
    let body: any = null;
    try { body = await res.json(); } catch {}
    if (!body || body.success === false) {
      throw new OnboardingApiError(res.status, body?.error?.code ?? 'upload_failed', body?.error?.message ?? 'Upload failed', body?.error?.details);
    }
    return body.data;
  },
  deleteDocument: (token: string, documentId: string) => request<any>(token, `/documents/${documentId}`, { method: 'DELETE' }),
  submit: (token: string) =>
    request<any>(token, '/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ consentAccepted: true }) }),
  getAgreement: (token: string) => request<any>(token, '/agreement'),
  getSignatureUrl: (token: string) => request<any>(token, '/signature-url'),
  postCustomSignature: (token: string, b: { signerName: string; signatureImage: string; consentAccepted: boolean }) =>
    request<any>(token, '/custom-signature', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }),
  /* PART 3 / GAP-005 */
  resendLink: (token: string) => request<any>(token, '/resend', { method: 'POST' }),
  /* PART 4 / GAP-013 — direct send; backend delivers via emailService */
  sendSupportMessage: (token: string, b: { name: string; email: string; subject: string; message: string }) =>
    request<any>(token, '/support-message', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }),
};