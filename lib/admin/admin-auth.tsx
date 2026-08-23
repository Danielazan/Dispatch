/* ============ AdminAuthProvider v5 ============ */
'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiGet, apiPost, setAccessToken } from '@/lib/api-client';
import type { AdminUser } from './admin-types';

type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

interface AdminAuthContextValue {
  status: AuthStatus;
  adminUser: AdminUser | null;
  permissions: string[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  can: (key: string) => boolean;
}

const Ctx = createContext<AdminAuthContextValue | null>(null);

/**
 * v5 — DOC-DIFF-4 RESOLVED (raw /me captured 2026-08-23):
 *   data.admin = { id, email, fullName, roleId, roleName, isSuperAdmin, permissions:['*'] }
 * Normalizer reads `data.admin` FIRST, maps flat roleName/isSuperAdmin into the
 * AdminUser.role contract, and keeps legacy candidates only as dead fallbacks.
 * Login body shape still unconfirmed → profile always (re)sourced from GET /me.
 */
function normalizeAdminUser(raw: unknown): AdminUser {
  const r = (raw ?? {}) as Record<string, any>;
  const candidates = [r.admin, r.adminUser, r.user, r.profile, r].filter(
    (c) => c && typeof c === 'object' && !Array.isArray(c),
  );
  const find = (keys: string[]): any => {
    for (const c of candidates) {
      for (const k of keys) {
        if (c[k] !== undefined && c[k] !== null) return c[k];
      }
    }
    return undefined;
  };

  const email = String(find(['email']) ?? '');
  const fullName = String(find(['fullName', 'name']) ?? (email ? email.split('@')[0] : 'Admin'));
  const isSuperAdmin = !!find(['isSuperAdmin']);
  const roleName = find(['roleName']);
  const roleId = String(find(['roleId']) ?? '');

  const roleRaw = find(['role']);
  const role =
    roleRaw && typeof roleRaw === 'object'
      ? {
          id: String(roleRaw.id ?? roleId),
          name: String(roleRaw.name ?? roleName ?? (roleRaw.isSuperAdmin ? 'Super Admin' : 'Staff')),
          isSuperAdmin: !!roleRaw.isSuperAdmin,
        }
      : {
          id: roleId,
          name: String(roleName ?? (isSuperAdmin ? 'Super Admin' : 'Staff')),
          isSuperAdmin,
        };

  let permissions = find(['permissions']);
  if (typeof permissions === 'string') permissions = [permissions];
  if (!Array.isArray(permissions)) permissions = isSuperAdmin ? ['*'] : [];

  return { id: String(find(['id']) ?? ''), fullName, email, role, permissions };
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // bootstrap(): silent refresh cookie → GET /me. Survives full page reloads (§3.1).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const refreshed = await apiPost<{ accessToken: string }>('/api/admin/auth/refresh');
        setAccessToken(refreshed.accessToken);
        const meRaw = await apiGet<unknown>('/api/admin/auth/me');
        if (cancelled) return;
        setAdminUser(normalizeAdminUser(meRaw));
        setStatus('authenticated');
      } catch {
        if (!cancelled) { setAccessToken(null); setAdminUser(null); setStatus('anonymous'); }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // login = token first; profile ALWAYS from /me (real login body shape unconfirmed).
  const login = useCallback(async (email: string, password: string) => {
    const data = await apiPost<{ accessToken: string }>('/api/admin/auth/login', { email, password });
    setAccessToken(data.accessToken);
    try {
      const meRaw = await apiGet<unknown>('/api/admin/auth/me');
      setAdminUser(normalizeAdminUser(meRaw));
    } catch {
      setAdminUser(normalizeAdminUser(data)); // degraded fallback; backend still enforces
    }
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    try { await apiPost('/api/admin/auth/logout'); } finally {
      setAccessToken(null);
      setAdminUser(null);
      setStatus('anonymous');
    }
  }, []);

  const permissions = useMemo(() => adminUser?.permissions ?? [], [adminUser]);
  const can = useCallback((key: string) => permissions.includes('*') || permissions.includes(key), [permissions]);

  const value = useMemo(
    () => ({ status, adminUser, permissions, login, logout, can }),
    [status, adminUser, permissions, login, logout, can],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdminAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return v;
}

/** UX-only gating. Backend enforces the real rule. */
export function usePermission(key: string) {
  return useAdminAuth().can(key);
}