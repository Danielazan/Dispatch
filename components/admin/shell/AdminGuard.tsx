/* ============ AdminGuard v1 ============ */
'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin/admin-auth';
import { ADMIN_ROUTES } from '@/lib/admin/admin-constants';

function FullScreenBoot() {
  return (
    <div className="aik-admin flex min-h-screen items-center justify-center" style={{ background: 'var(--adm-bg)' }}>
      <div
        aria-label="Loading admin console"
        className="h-8 w-8 rounded-full border-2 border-[var(--adm-s4)] border-t-[var(--adm-a5)]"
        style={{ animation: 'spin 0.9s linear infinite' }}
      />
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  );
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { status } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname?.startsWith(ADMIN_ROUTES.login);

  useEffect(() => {
    if (!isLogin && status === 'anonymous') router.replace(ADMIN_ROUTES.login);
  }, [isLogin, status, router]);

  if (isLogin) return <>{children}</>;
  if (status === 'loading') return <FullScreenBoot />;
  if (status === 'anonymous') return <FullScreenBoot />;
  return <>{children}</>;
}