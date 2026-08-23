/* ============ api-client v2 ============ */
export class ApiRequestError extends Error {
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

const BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

let accessToken: string | null = null; // in-memory ONLY
let refreshPromise: Promise<boolean> | null = null;

export function setAccessToken(t: string | null) { accessToken = t; }
export function getAccessToken() { return accessToken; }

function isRefreshableAdminPath(p: string) {
  return (
    p.startsWith('/api/') &&
    !p.startsWith('/api/admin/auth/') &&
    !p.startsWith('/api/onboarding-sessions') &&
    !p.startsWith('/api/leads') &&
    !p.startsWith('/api/health')
  );
}

async function rawFetch(path: string, init: RequestInit, isRetry = false): Promise<Response> {
  const headers = new Headers(init.headers);
  if (accessToken && !headers.has('Authorization')) headers.set('Authorization', 'Bearer ' + accessToken);
  const res = await fetch(BASE + path, { ...init, headers, credentials: 'include', cache: 'no-store' });
  if (res.status === 401 && isRefreshableAdminPath(path) && !isRetry) {
    const ok = await refreshAccessToken();
    if (ok) return rawFetch(path, init, true);
    throw new ApiRequestError(401, 'session_expired', 'Your session has expired. Please sign in again.');
  }
  return res;
}

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(BASE + '/api/admin/auth/refresh', { method: 'POST', credentials: 'include', cache: 'no-store' });
        const body = await res.json();
        if (body?.success && body.data?.accessToken) { accessToken = body.data.accessToken; return true; }
        accessToken = null; return false;
      } catch { accessToken = null; return false; }
      finally { setTimeout(() => { refreshPromise = null; }, 0); }
    })();
  }
  return refreshPromise;
}

export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await rawFetch(path, init);
  let body: any = null;
  try { body = await res.json(); } catch { /* non-JSON */ }
  if (!body || body.success === false) {
    throw new ApiRequestError(res.status, body?.error?.code ?? 'unknown_error', body?.error?.message ?? 'Request failed (' + res.status + ')', body?.error?.details);
  }
  return body.data as T;
}

export const apiGet = <T = unknown>(path: string) => api<T>(path);
export const apiPost = <T = unknown>(path: string, body?: unknown) =>
  api<T>(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
export const apiPatch = <T = unknown>(path: string, body?: unknown) =>
  api<T>(path, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
export const apiDelete = <T = unknown>(path: string) => api<T>(path, { method: 'DELETE' });
export const apiForm = <T = unknown>(path: string, formData: FormData) => api<T>(path, { method: 'POST', body: formData });

/* v2: authenticated blob fetch — powers in-browser preview AND download.
   Never constructs server file paths; blob object URLs are client-side only. */
export async function apiBlob(path: string): Promise<Blob> {
  const headers = new Headers();
  if (accessToken) headers.set('Authorization', 'Bearer ' + accessToken);
  const res = await fetch(BASE + path, { headers, credentials: 'include', cache: 'no-store' });
  if (!res.ok) {
    let body: any = null;
    try { body = await res.json(); } catch {}
    throw new ApiRequestError(res.status, body?.error?.code ?? 'download_failed', body?.error?.message ?? 'Download failed (' + res.status + ')', body?.error?.details);
  }
  return res.blob();
}

export async function downloadBlob(path: string, filename: string) {
  const blob = await apiBlob(path);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
