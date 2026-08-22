/* ============ AdminAuthProvider v1 ============ */
'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ADMIN_DEMO_MODE } from './admin-constants';
import { MOCK_ADMIN_USER } from './admin-mock-data';
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

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // bootstrap(): demo mode simulates the refresh-cookie → GET /me round trip.
  useEffect(() => {
    const t = setTimeout(() => {
      if (ADMIN_DEMO_MODE) { setAdminUser(MOCK_ADMIN_USER); setStatus('authenticated'); }
      else setStatus('anonymous'); // real pass: POST /api/admin/auth/refresh → GET /api/admin/auth/me
    }, 250);
    return () => clearTimeout(t);
  }, []);

  const login = useCallback(async (_email: string, _password: string) => {
    // Real pass: POST /api/admin/auth/login → setAccessToken(data.accessToken)
    setAdminUser(MOCK_ADMIN_USER);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    // Real pass: POST /api/admin/auth/logout (revokes refresh token server-side)
    setAdminUser(null);
    setStatus('anonymous');
  }, []);

  const permissions = useMemo(() => adminUser?.permissions ?? [], [adminUser]);
  const can = useCallback(
    (key: string) => permissions.includes('*') || permissions.includes(key),
    [permissions],
  );

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