/* ============ CarriersListPage v1 ============ */
'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { ApiRequestError } from '@/lib/api-client';
import { useAdminAuth } from '@/lib/admin/admin-auth';
import { carrierApi } from '@/lib/admin/carrier-data';
import type { CarrierSummary, Page } from '@/lib/admin/carrier-types';
import { formatDateTime } from '@/lib/admin/format';
import { StatusBadge } from '@/components/admin/carrier/StatusBadge';

const STATUS_FILTERS = ['', 'submitted', 'admin_review', 'approved', 'rejected', 'active', 'suspended'];
const PAGE_SIZE = 10;

export function CarriersListPage() {
  const { can } = useAdminAuth();
  const router = useRouter();
  const [data, setData] = useState<Page<CarrierSummary> | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (p: number, s: string) => {
    setLoading(true); setError(null);
    try { setData(await carrierApi.list(p, PAGE_SIZE, s || undefined)); }
    catch (e) { setError(e instanceof ApiRequestError ? e.message : 'Connection problem — check your network.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(page, status); }, [page, status, load]);

  if (!can('carriers.view')) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <p className="rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)] px-8 py-6 text-[12px] text-[var(--adm-t3)]">
          Insufficient permissions — requires <code className="text-[var(--adm-a3)]">carriers.view</code>.
        </p>
      </div>
    );
  }

  const from = data && data.totalItems > 0 ? (data.page - 1) * data.pageSize + 1 : 0;
  const to = data ? Math.min(data.page * data.pageSize, data.totalItems) : 0;

  return (
    <div className="space-y-5 p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-extrabold leading-8 text-[var(--adm-t1)]">Carriers</h1>
          <p className="mt-1 text-[12px] text-[var(--adm-t3)]">Live carrier files submitted through onboarding — review, approve, activate.</p>
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          aria-label="Filter by status"
          className="h-10 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s1)] px-3 text-[12px] text-[var(--adm-t2)] focus:border-[rgba(245,158,11,0.42)] focus:outline-none"
        >
          {STATUS_FILTERS.map((s) => <option key={s} value={s}>{s === '' ? 'All statuses' : s.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      <section className="rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)]" aria-label="Carriers list">
        {error && <p role="alert" className="border-b border-[var(--adm-b1)] px-5 py-3 text-[12px] text-[var(--adm-danger)]">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12.5px]">
            <thead>
              <tr className="text-[10.5px] tracking-[0.14em] text-[var(--adm-t4)]">
                <th className="px-5 py-3 font-semibold">CARRIER</th>
                <th className="px-3 py-3 font-semibold">AUTHORITY</th>
                <th className="px-3 py-3 font-semibold">STATUS</th>
                <th className="px-3 py-3 font-semibold">VERIFICATION</th>
                <th className="px-3 py-3 font-semibold">AGREEMENT</th>
                <th className="px-3 py-3 font-semibold">SUBMITTED</th>
                <th className="px-5 py-3 text-right font-semibold">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t border-[var(--adm-b1)]"><td colSpan={7} className="px-5 py-3"><div className="adm-skeleton h-8" /></td></tr>
              ))}
              {!loading && data?.items.map((c) => (
                <tr key={c.id} className="border-t border-[var(--adm-b1)] transition-colors hover:bg-[var(--adm-s2)]">
                  <td className="px-5 py-3 font-medium text-[var(--adm-t1)]">{c.legalName ?? '—'}</td>
                  <td className="tnum px-3 py-3 text-[var(--adm-t2)]">{c.authorityNumber ?? '—'}</td>
                  <td className="px-3 py-3">{c.status ? <StatusBadge value={c.status} /> : '—'}</td>
                  <td className="px-3 py-3">{c.verificationStatus ? <StatusBadge value={c.verificationStatus} /> : '—'}</td>
                  <td className="px-3 py-3">{c.agreementStatus ? <StatusBadge value={c.agreementStatus} /> : '—'}</td>
                  <td className="tnum px-3 py-3 text-[var(--adm-t3)]">{formatDateTime(c.submittedAt ?? c.createdAt)}</td>
                  <td className="px-5 py-3">
                    <span className="flex justify-end">
                      <button
                        onClick={() => router.push('/admin/carriers/' + c.id)}
                        aria-label="Open carrier file"
                        className="rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] p-1.5 text-[var(--adm-t2)] hover:border-[rgba(245,158,11,0.42)] hover:text-[var(--adm-a4)]"
                      >
                        <Eye size={13} />
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--adm-b1)] px-5 py-4">
          <p className="tnum text-[11.5px] text-[var(--adm-t4)]">
            {data && data.totalItems > 0 ? 'Showing ' + from + ' to ' + to + ' of ' + data.totalItems + ' results' : data && data.totalItems === 0 ? (status ? 'No carriers match this filter.' : 'No carriers yet.') : '—'}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!data || page <= 1 || loading} aria-label="Previous page"
              className="rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] p-1.5 text-[var(--adm-t2)] hover:border-[rgba(245,158,11,0.42)] disabled:opacity-40">
              <ChevronLeft size={14} />
            </button>
            <span className="tnum text-[11px] text-[var(--adm-t3)]">{data ? data.page + ' / ' + Math.max(data.totalPages, 1) : '—'}</span>
            <button onClick={() => setPage((p) => p + 1)} disabled={!data || page >= (data?.totalPages ?? 1) || loading} aria-label="Next page"
              className="rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] p-1.5 text-[var(--adm-t2)] hover:border-[rgba(245,158,11,0.42)] disabled:opacity-40">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
