/* ============ PipelineHeader v1 ============ */
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Download, Settings, SlidersHorizontal } from 'lucide-react';
import { ADMIN_ROUTES } from '@/lib/admin/admin-constants';
import { STAGE_META, STAGE_ORDER } from '@/lib/admin/pipeline-mock-data';
import type { PipelineColumnData, PipelineStageId } from '@/lib/admin/pipeline-types';

interface Props {
  columns: PipelineColumnData[];
  hiddenStages: PipelineStageId[];
  onToggleStage: (s: PipelineStageId) => void;
  density: 'comfortable' | 'compact';
  onToggleDensity: () => void;
  showPct: boolean;
  onToggleShowPct: () => void;
}

export function PipelineHeader({ columns, hiddenStages, onToggleStage, density, onToggleDensity, showPct, onToggleShowPct }: Props) {
  const [open, setOpen] = useState<null | 'settings' | 'filters' | 'export'>(null);
  const close = () => setOpen(null);

  const exportCsv = () => {
    const rows = [['Stage', 'Carrier', 'MC Number', 'Submitted']];
    columns.forEach((col) => [...col.cards, ...col.extraCards].forEach((c) => rows.push([STAGE_META[col.stage].label, c.carrierName, c.mcNumber, c.submittedAt])));
    const csv = rows.map((r) => r.map((v) => `"${v.replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'onboarding-pipeline.csv'; a.click();
    URL.revokeObjectURL(url);
    close();
  };

  const btn = 'flex h-10 items-center gap-2.5 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s1)] px-4 text-[12.5px] text-[var(--adm-t2)] transition-colors hover:border-[rgba(245,158,11,0.42)]';

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11.5px] text-[var(--adm-t4)]">
          <Link href={ADMIN_ROUTES.dashboard} className="hover:text-[var(--adm-t2)]">Dashboard</Link>
          <span aria-hidden="true">›</span>
          <span className="text-[var(--adm-t2)]">Onboarding Pipeline</span>
        </nav>
        <h1 data-pipe="title" className="mt-1 text-[30px] font-extrabold leading-9 text-[var(--adm-t1)]">Onboarding Pipeline</h1>
        <p data-pipe="subtitle" className="mt-1 text-[13px] text-[var(--adm-t3)]">Monitor and manage carrier onboarding from application to activation.</p>
      </div>

      <div className="relative flex flex-wrap items-center gap-3">
        {/* Pipeline Settings */}
        <button className={btn} onClick={() => setOpen(open === 'settings' ? null : 'settings')} aria-expanded={open === 'settings'}>
          <Settings size={14} /> Pipeline Settings
        </button>
        {/* Filters */}
        <button className={btn} onClick={() => setOpen(open === 'filters' ? null : 'filters')} aria-expanded={open === 'filters'}>
          <SlidersHorizontal size={14} /> Filters <ChevronDown size={13} className="text-[var(--adm-t3)]" />
        </button>
        {/* Export (split) */}
        <div className="flex">
          <button
            onClick={exportCsv}
            className="flex h-10 items-center gap-2.5 rounded-l-md bg-[var(--adm-a5)] px-4 text-[12.5px] font-semibold text-black transition-opacity hover:opacity-90"
          >
            <Download size={14} /> Export
          </button>
          <button
            onClick={() => setOpen(open === 'export' ? null : 'export')}
            aria-label="Export options" aria-expanded={open === 'export'}
            className="h-10 rounded-r-md border-l border-black/25 bg-[var(--adm-a5)] px-2 text-black hover:opacity-90"
          >
            <ChevronDown size={14} />
          </button>
        </div>

        {open && <div className="fixed inset-0 z-40" onClick={close} aria-hidden="true" />}

        {open === 'settings' && (
          <div className="pipe-pop absolute right-0 top-12 z-50 w-64 rounded-lg border border-[var(--adm-b2)] bg-[var(--adm-s2)] p-4 shadow-2xl">
            <p className="pb-2 text-[10px] font-semibold tracking-[0.18em] text-[var(--adm-t4)]">BOARD SETTINGS</p>
            <label className="flex items-center justify-between py-1.5 text-[12px] text-[var(--adm-t2)]">
              Compact density
              <input type="checkbox" checked={density === 'compact'} onChange={onToggleDensity} className="accent-[var(--adm-a5)]" />
            </label>
            <label className="flex items-center justify-between py-1.5 text-[12px] text-[var(--adm-t2)]">
              Show percentages
              <input type="checkbox" checked={showPct} onChange={onToggleShowPct} className="accent-[var(--adm-a5)]" />
            </label>
          </div>
        )}

        {open === 'filters' && (
          <div className="pipe-pop absolute right-0 top-12 z-50 w-64 rounded-lg border border-[var(--adm-b2)] bg-[var(--adm-s2)] p-4 shadow-2xl">
            <p className="pb-2 text-[10px] font-semibold tracking-[0.18em] text-[var(--adm-t4)]">VISIBLE STAGES</p>
            {STAGE_ORDER.map((s) => (
              <label key={s} className="flex items-center justify-between py-1.5 text-[12px] text-[var(--adm-t2)]">
                {STAGE_META[s].label}
                <input type="checkbox" checked={!hiddenStages.includes(s)} onChange={() => onToggleStage(s)} className="accent-[var(--adm-a5)]" />
              </label>
            ))}
          </div>
        )}

        {open === 'export' && (
          <div className="pipe-pop absolute right-0 top-12 z-50 w-56 rounded-lg border border-[var(--adm-b2)] bg-[var(--adm-s2)] p-2 shadow-2xl">
            <button onClick={exportCsv} className="w-full rounded px-3 py-2 text-left text-[12px] text-[var(--adm-t2)] hover:bg-[var(--adm-s3)]">Export visible queues (CSV)</button>
            <p className="px-3 py-2 text-[10.5px] text-[var(--adm-t4)]">PDF export arms with backend integration.</p>
          </div>
        )}
      </div>
    </div>
  );
}