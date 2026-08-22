/* ============ DashboardHeader v1 ============ */
'use client';
import { useState } from 'react';
import { CalendarDays, SlidersHorizontal } from 'lucide-react';
import { useAdminAuth } from '@/lib/admin/admin-auth';
import { DEMO_SNAPSHOT_DATE } from '@/lib/admin/admin-constants';

const FILTER_GROUPS = ['Region', 'Carrier Status', 'Verification Status', 'Load Status', 'Date Range', 'Priority'];

export function DashboardHeader() {
  const { adminUser } = useAdminAuth();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const firstName = (adminUser?.fullName ?? 'Operator').split(' ')[0];

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 data-dash="title" className="text-[30px] font-extrabold leading-9 text-[var(--adm-t1)] md:text-[34px]">
          Welcome back, {firstName}
        </h1>
        <p data-dash="subtitle" className="mt-1 text-[13px] text-[var(--adm-t3)]">
          Here&apos;s what&apos;s happening across your freight operations today.
        </p>
      </div>

      <div className="relative flex items-center gap-3">
        <button
          className="flex h-10 items-center gap-2.5 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s1)] px-3.5 text-[12.5px] text-[var(--adm-t2)] transition-colors hover:border-[rgba(245,158,11,0.42)]"
          aria-label="Select snapshot date"
        >
          {DEMO_SNAPSHOT_DATE}
          <CalendarDays size={15} className="text-[var(--adm-t3)]" />
        </button>

        <button
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          className="flex h-10 items-center gap-2.5 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s1)] px-4 text-[12.5px] text-[var(--adm-t2)] transition-colors hover:border-[rgba(245,158,11,0.42)]"
        >
          <SlidersHorizontal size={14} /> Filters
        </button>

        {filtersOpen && (
          <div
            role="menu"
            className="absolute right-0 top-12 z-50 w-64 rounded-lg border border-[var(--adm-b2)] bg-[var(--adm-s2)] p-4 shadow-2xl"
            style={{ boxShadow: '0 12px 32px rgba(0,0,0,0.4)' }}
          >
            <p className="pb-2 text-[10px] font-semibold tracking-[0.18em] text-[var(--adm-t4)]">FILTER SNAPSHOT</p>
            <ul className="space-y-2.5">
              {FILTER_GROUPS.map((g) => (
                <li key={g} className="flex items-center justify-between text-[12px] text-[var(--adm-t2)]">
                  {g}
                  <span className="rounded border border-[var(--adm-b1)] bg-[var(--adm-s3)] px-2 py-0.5 text-[10.5px] text-[var(--adm-t3)]">Any</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}