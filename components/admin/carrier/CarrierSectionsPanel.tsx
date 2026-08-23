/* ============ CarrierSectionsPanel v1 ============ */
'use client';
import type { CarrierFile } from '@/lib/admin/carrier-types';

/** Mirrors onboarding Sections 1–5 so staff cross-reference trivially (§6.5). */
export function CarrierSectionsPanel({ file }: { file: CarrierFile }) {
  const rows: [string, string | null][] = [
    ['Legal Name', file.legalName], ['DBA Name', file.dbaName], ['Authority Number', file.authorityNumber],
    ['DOT Number', file.dotNumber], ['EIN', file.ein], ['Address', file.address],
    ['Phone', file.phone], ['Email', file.email],
    ['Payment Preference', file.paymentPreference], ['Factoring Company', file.factoringCompanyName],
  ];
  return (
    <section aria-label="Carrier submitted data, sections 1 to 5" className="rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)] p-5">
      <h2 className="text-[13px] font-semibold tracking-[0.14em] text-[var(--adm-t2)]">CARRIER FILE — SECTIONS 1–5</h2>
      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="min-w-0">
            <dt className="text-[10.5px] text-[var(--adm-t4)]">{k}</dt>
            <dd className="tnum mt-0.5 truncate text-[12.5px] text-[var(--adm-t1)]" title={v ?? undefined}>{v ?? '—'}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}