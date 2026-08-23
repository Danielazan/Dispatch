/* ============ admin login v2 ============ */
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiRequestError } from '@/lib/api-client';
import { useAdminAuth } from '@/lib/admin/admin-auth';
import { ADMIN_ROUTES } from '@/lib/admin/admin-constants';

export default function AdminLoginPage() {
  const { status, login } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (status === 'authenticated') router.replace(ADMIN_ROUTES.dashboard); }, [status, router]);

  return (
    <div className="aik-admin flex min-h-screen items-center justify-center px-4" style={{ background: 'var(--adm-bg)' }}>
      <form
        className="w-full max-w-sm rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)] p-7"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true); setError(null);
          try {
            await login(email, password);
            router.replace(ADMIN_ROUTES.dashboard);
          } catch (err) {
            if (err instanceof ApiRequestError) {
              if (err.status === 401) setError('Invalid email or password.');
              else if (err.status === 429) setError('Too many attempts — please wait a few minutes and try again.');
              else setError(err.message);
            } else setError('Connection problem — check your network.');
          } finally { setBusy(false); }
        }}
      >
        <p className="text-[16px] font-extrabold tracking-wide text-[var(--adm-t1)]">AIK FREIGHT</p>
        <p className="pb-5 text-[10px] font-bold tracking-[0.22em] text-[var(--adm-a5)]">DISPATCH ADMIN</p>
        <label className="block text-[11.5px] text-[var(--adm-t3)]">Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 h-10 w-full rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] px-3 text-[13px] text-[var(--adm-t1)] focus:border-[rgba(245,158,11,0.42)] focus:outline-none" />
        </label>
        <label className="mt-4 block text-[11.5px] text-[var(--adm-t3)]">Password
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 h-10 w-full rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] px-3 text-[13px] text-[var(--adm-t1)] focus:border-[rgba(245,158,11,0.42)] focus:outline-none" />
        </label>
        {error && <p className="mt-3 text-[11.5px] text-[var(--adm-danger)]" role="alert">{error}</p>}
        <button disabled={busy}
          className="mt-5 h-10 w-full rounded-md bg-[var(--adm-a5)] text-[13px] font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50">
          {busy ? 'Signing in…' : 'Sign In'}
        </button>
        <p className="mt-3 text-center text-[10.5px] text-[var(--adm-t4)]">Session persists via secure refresh cookie. Tokens live in memory only.</p>
      </form>
    </div>
  );
}