/* ============ CarrierDetailDrawer v1 ============ */
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, CheckCircle2, ChevronDown, MessageSquare, Pencil, StickyNote, X } from 'lucide-react';
import { ADMIN_ROUTES } from '@/lib/admin/admin-constants';
import type { CarrierPipelineDetail } from '@/lib/admin/pipeline-types';

const TABS = ['Overview', 'Documents', 'Activity', 'Notes', 'History'] as const;
type Tab = (typeof TABS)[number];

export function CarrierDetailDrawer({ detail, onClose }: { detail: CarrierPipelineDetail; onClose: () => void }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('Overview');
  const [notes, setNotes] = useState<string[]>([]);
  const [noteOpen, setNoteOpen] = useState(false);
  const [draft, setDraft] = useState('');

  const C = 2 * Math.PI * 26;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/55 min-[1760px]:hidden" onClick={onClose} aria-hidden="true" />
      <aside
        className="pipe-drawer fixed right-0 top-0 z-50 flex h-full w-[min(400px,94vw)] flex-col border-l border-[var(--adm-b1)] bg-[var(--adm-sidebar)] min-[1760px]:static min-[1760px]:z-auto min-[1760px]:h-auto min-[1760px]:w-[400px] min-[1760px]:shrink-0"
        aria-label={`Carrier detail: ${detail.carrierName}`}
      >
        {/* Header */}
        <div className="border-b border-[var(--adm-b1)] p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-[16px] font-bold text-[var(--adm-t1)]">{detail.carrierName}</h2>
            <button onClick={onClose} aria-label="Close carrier detail" className="rounded p-1 text-[var(--adm-t3)] hover:text-[var(--adm-t1)]"><X size={16} /></button>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="rounded px-2 py-0.5 text-[10px] font-bold" style={{ border: '1px solid rgba(245,158,11,0.5)', background: 'rgba(245,158,11,0.1)', color: 'var(--adm-a3)' }}>
              {detail.stageLabel}
            </span>
            <span className="tnum text-[10.5px] text-[var(--adm-t4)]">Lead ID: {detail.leadId}</span>
          </div>
          <p className="tnum mt-2 text-[11px] text-[var(--adm-t3)]">{detail.mcNumber}</p>
          <p className="tnum text-[11px] text-[var(--adm-t4)]">Submitted: {detail.submittedAt}</p>

          {/* Stepper */}
          <ol className="mt-4 flex items-center" aria-label="Onboarding progress">
            {detail.steps.map((s, i) => (
              <li key={s.label} className="flex flex-1 flex-col items-center">
                <span className="flex w-full items-center">
                  <span className={`h-px flex-1 ${i === 0 ? 'opacity-0' : ''}`} style={{ background: i <= detail.stageIndex ? 'var(--adm-a5)' : 'var(--adm-b1)' }} />
                  <span
                    className="tnum flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                    style={i <= detail.stageIndex ? { background: 'var(--adm-a5)', color: '#05080b' } : { border: '1px solid var(--adm-b2)', color: 'var(--adm-t3)' }}
                  >
                    {i + 1}
                  </span>
                  <span className={`h-px flex-1 ${i === detail.steps.length - 1 ? 'opacity-0' : ''}`} style={{ background: i < detail.stageIndex ? 'var(--adm-a5)' : 'var(--adm-b1)' }} />
                </span>
                <span className="mt-1.5 max-w-[52px] text-center text-[8.5px] leading-3" style={{ color: i === detail.stageIndex ? 'var(--adm-a4)' : 'var(--adm-t4)' }}>
                  {s.label === 'Application' ? 'Application Submitted' : s.label}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--adm-b1)] px-3" role="tablist" aria-label="Carrier detail tabs">
          {TABS.map((t) => (
            <button
              key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
              className="relative px-3 py-2.5 text-[11px] font-medium transition-colors"
              style={{ color: tab === t ? 'var(--adm-t1)' : 'var(--adm-t3)' }}
            >
              {t}
              {tab === t && <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded bg-[var(--adm-a4)]" />}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="pipe-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          {tab === 'Overview' && (
            <>
              <section className="rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)] p-4" aria-label="Company information">
                <div className="flex items-center justify-between">
                  <h3 className="text-[12px] font-semibold text-[var(--adm-t1)]">Company Information</h3>
                  <button className="flex items-center gap-1.5 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] px-2.5 py-1.5 text-[10.5px] text-[var(--adm-t2)] hover:border-[rgba(245,158,11,0.42)]" title="Editing arms with backend integration (demo)">
                    <Pencil size={11} /> Edit
                  </button>
                </div>
                <dl className="mt-3 space-y-2.5">
                  {([
                    ['Legal Name', detail.company.legalName], ['DBA Name', detail.company.dbaName],
                    ['MC Number', detail.company.mcNumber], ['DOT Number', detail.company.dotNumber],
                    ['Contact Person', detail.company.contactPerson], ['Email', detail.company.email],
                    ['Phone', detail.company.phone],
                  ] as const).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 text-[11px]">
                      <dt className="shrink-0 text-[var(--adm-t4)]">{k}</dt>
                      <dd className="truncate text-right text-[var(--adm-t2)]">{v}</dd>
                    </div>
                  ))}
                  <div className="flex justify-between gap-3 text-[11px]">
                    <dt className="shrink-0 text-[var(--adm-t4)]">Address</dt>
                    <dd className="text-right leading-4 text-[var(--adm-t2)]">{detail.company.addressLines.map((l) => <span key={l} className="block">{l}</span>)}</dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)] p-4" aria-label="Progress">
                <h3 className="text-[12px] font-semibold text-[var(--adm-t1)]">Progress</h3>
                <div className="mt-3 flex items-center gap-5">
                  <div className="relative shrink-0">
                    <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true">
                      <circle cx="42" cy="42" r="26" fill="none" stroke="var(--adm-s4)" strokeWidth="9" />
                      <circle cx="42" cy="42" r="26" fill="none" stroke="var(--adm-a5)" strokeWidth="9"
                        strokeDasharray={`${(detail.progressPercent / 100) * C} ${C}`} strokeLinecap="round" transform="rotate(-90 42 42)" />
                    </svg>
                    <span className="absolute inset-0 flex flex-col items-center justify-center">
                      <b className="tnum text-[15px] font-bold text-[var(--adm-t1)]">{detail.progressPercent}%</b>
                      <i className="not-italic text-[7.5px] text-[var(--adm-t4)]">Complete</i>
                    </span>
                  </div>
                  <ul className="min-w-0 flex-1 space-y-1.5">
                    {detail.steps.map((s) => (
                      <li key={s.label} className="flex items-center gap-2 text-[10.5px]">
                        {s.state === 'completed' ? <CheckCircle2 size={12} className="shrink-0 text-[var(--adm-ok)]" /> : (
                          <span className="h-3 w-3 shrink-0 rounded-full border" style={{ borderColor: s.state === 'active' ? 'var(--adm-a5)' : 'var(--adm-b2)' }} />
                        )}
                        <span className="flex-1 text-[var(--adm-t2)]">{s.label}</span>
                        <span style={{ color: s.state === 'completed' ? 'var(--adm-ok)' : s.state === 'active' ? 'var(--adm-a3)' : 'var(--adm-t4)' }}>
                          {s.note}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </>
          )}

          {tab === 'Documents' && <PlaceholderNote text="Document review panel arms with backend integration (GET carrier-documents)." />}
          {tab === 'Activity' && <PlaceholderNote text="Activity history arms with backend audit logs." />}
          {tab === 'History' && <PlaceholderNote text="Status history arms with backend carrier events." />}
          {tab === 'Notes' && (
            <section className="rounded-lg border border-[var(--adm-b1)] bg-[var(--adm-s1)] p-4" aria-label="Notes">
              <h3 className="text-[12px] font-semibold text-[var(--adm-t1)]">Notes</h3>
              {notes.length === 0 ? <p className="mt-2 text-[11px] text-[var(--adm-t4)]">No notes yet.</p> : (
                <ul className="mt-2 space-y-2">{notes.map((n, i) => <li key={i} className="rounded border border-[var(--adm-b1)] bg-[var(--adm-s2)] p-2 text-[11px] text-[var(--adm-t2)]">{n}</li>)}</ul>
              )}
            </section>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-[var(--adm-b1)] p-5">
          <h3 className="pb-3 text-[12px] font-semibold text-[var(--adm-t1)]">Actions</h3>
          <div className="relative flex gap-2.5">
            <a
              href={`mailto:${detail.company.email}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] py-2.5 text-[11.5px] text-[var(--adm-t2)] hover:border-[rgba(245,158,11,0.42)]"
            >
              <MessageSquare size={13} /> Send Message
            </a>
            <button
              onClick={() => setNoteOpen((v) => !v)}
              aria-expanded={noteOpen}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[var(--adm-b1)] bg-[var(--adm-s2)] py-2.5 text-[11.5px] text-[var(--adm-t2)] hover:border-[rgba(245,158,11,0.42)]"
            >
              <StickyNote size={13} /> Add Note <ChevronDown size={12} />
            </button>
            {noteOpen && (
              <div className="pipe-pop absolute bottom-12 right-0 z-50 w-64 rounded-lg border border-[var(--adm-b2)] bg-[var(--adm-s2)] p-3 shadow-2xl">
                <textarea
                  value={draft} onChange={(e) => setDraft(e.target.value)} rows={3}
                  placeholder="Internal note…"
                  className="w-full rounded border border-[var(--adm-b1)] bg-[var(--adm-s3)] p-2 text-[11px] text-[var(--adm-t1)] focus:border-[rgba(245,158,11,0.42)] focus:outline-none"
                />
                <button
                  onClick={() => { if (draft.trim()) { setNotes((n) => [...n, draft.trim()]); setDraft(''); setNoteOpen(false); setTab('Notes'); } }}
                  className="mt-2 w-full rounded bg-[var(--adm-a5)] py-1.5 text-[11px] font-semibold text-black hover:opacity-90"
                >
                  Save Note
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => router.push(`${ADMIN_ROUTES.carriers}/${detail.id}`)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-[var(--adm-a5)] py-3 text-[12.5px] font-bold text-black transition-opacity hover:opacity-90"
          >
            Review Application <ArrowRight size={14} />
          </button>
        </div>
      </aside>
    </>
  );
}

function PlaceholderNote({ text }: { text: string }) {
  return (
    <section className="rounded-lg border border-dashed border-[var(--adm-b1)] bg-[var(--adm-s1)] p-4">
      <p className="flex items-center gap-2 text-[11px] text-[var(--adm-t4)]"><Check size={12} className="text-[var(--adm-ok)]" /> {text}</p>
    </section>
  );
}