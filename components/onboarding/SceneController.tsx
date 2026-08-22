/* ============ SceneController v13 ============ */
'use client';
import { useState, type ComponentType, type CSSProperties } from 'react';
import { site } from '@/config/site';
import { useOnboarding } from '@/lib/onboarding/context';
import { ONBOARDING_STEPS } from '@/lib/onboarding/steps';
import { OnboardingStepper } from './OnboardingStepper';
import { Scene01Company } from './scenes/Scene01Company';
import { Scene02Authority } from './scenes/Scene02Authority';
import { Scene03Insurance } from './scenes/Scene03Insurance';
import { Scene04Fleet } from './scenes/Scene04Fleet';
import { Scene05Documents } from './scenes/Scene05Documents';
import { Scene06Review } from './scenes/Scene06Review';
import { Scene07Submit } from './scenes/Scene07Submit';
import { InvalidLinkState } from './states/InvalidLinkState';
import { ExpiredLinkState } from './states/ExpiredLinkState';
import { AlreadySubmittedState } from './states/AlreadySubmittedState';
import { Building2, CheckCircle2, Clock3, FileText, Info, Lock, ArrowLeft, ArrowRight, AlertCircle, Cloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createRouteSignalTimeline } from '@/motion/onboardingMotion';

const seg: CSSProperties = { padding: '5px 8px', display: 'flex', alignItems: 'center', columnGap: 6 };
const t1: CSSProperties = { fontSize: 11, fontWeight: 600, lineHeight: 1.2, whiteSpace: 'nowrap' };
const t2: CSSProperties = { fontSize: 10, lineHeight: 1.2, whiteSpace: 'nowrap' };

function StatusStrip() {
  const { state } = useOnboarding();
  const carrierId: string | undefined = state.sessionData?.carrier?.id;
  const appId = carrierId ? `AIK-${carrierId.slice(0, 4).toUpperCase()}-${carrierId.slice(4, 8).toUpperCase()}` : '—';
  const save = state.saveState;
  const icon = save === 'saved' ? <CheckCircle2 size={12} className="text-status-live" />
    : save === 'error' ? <AlertCircle size={12} className="text-red-400" />
    : save === 'saving' ? <Cloud size={12} className="text-ivory-100" />
    : <Cloud size={12} className="text-steel-500" />;
  const title = save === 'saved' ? 'Autosaved' : save === 'saving' ? 'Saving…' : save === 'error' ? 'Save failed' : save === 'dirty' ? 'Unsaved changes' : 'Autosave ready';
  const titleCls = save === 'saved' ? 'text-status-live' : save === 'error' ? 'text-red-400' : save === 'dirty' ? 'text-brass-400' : 'text-steel-300';
  const sub = state.lastSavedAt ? `Last saved ${new Date(state.lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'No changes yet';
  const submitted = state.sessionData?.status === 'submitted';

  return (
    <div data-status-strip className="flex items-stretch divide-x divide-steel-700/30 border border-steel-700/30 rounded-[8px] bg-ink-900/50" data-text>
      <div style={seg}>{icon} <div> <p className={titleCls} style={t1}>{title}</p> <p className="text-steel-400" style={t2}>{sub}</p> </div> </div>
      <div style={seg}> <Clock3 size={12} className="text-steel-400" /> <div> <p className="text-steel-300" style={t1}>Application ID</p> <p className="text-ivory-100 font-tech" style={t2}>{appId}</p> </div> </div>
      <div style={seg}> <FileText size={12} className="text-steel-400" /> <div> <p className="text-steel-300" style={t1}>Status</p> <p className={submitted ? 'text-status-live' : 'text-brass-400'} style={t1}>{submitted ? 'Submitted' : 'In Progress'}</p> </div> </div>
    </div>
  );
}

/* v13: responsive header grid via .ob-header-grid; strip wraps below on <768px via .ob-strip */
function SectionHeader() {
  const { state } = useOnboarding();
  const step = ONBOARDING_STEPS[state.currentStepIndex];
  return (
    <div className="ob-header-grid">
      <div className="flex" style={{ columnGap: 14, minWidth: 0 }}>
        <Building2 size={26} strokeWidth={1.25} className="text-brass-400 shrink-0 mt-0.5" />
        <div style={{ minWidth: 0 }}>
          <p className="font-tech text-brass-400 uppercase" style={{ fontSize: 11, letterSpacing: '0.18em' }} data-brass>Step {step.index} of 7</p>
          <h2 className="text-ivory-50 font-semibold" style={{ fontSize: 26, lineHeight: 1.15, marginTop: 2 }} data-text>{step.label}</h2>
          <p className="text-steel-400" style={{ fontSize: 13, lineHeight: 1.6, marginTop: 6, maxWidth: 760, textAlign: 'justify' }} data-text>{step.description}</p>
        </div>
      </div>
      <div className="ob-strip"> <StatusStrip /> </div>
    </div>
  );
}

function InfoPanel() {
  return (
    <aside className="rounded-[8px] border border-steel-700/25 bg-ink-900/40 p-4 space-y-3 self-start" data-text>
      <div>
        <div className="flex items-center gap-2"> <Info size={13} className="text-status-available" /> <h3 className="text-[12px] font-semibold text-status-available">Why we need this</h3> </div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-steel-400">{site.infoWhy}</p>
      </div>
      <div className="h-px bg-steel-700/25" />
      <div>
        <div className="flex items-center gap-2"> <Lock size={12} className="text-brass-400" /> <h3 className="text-[12px] font-semibold text-status-available">Your information is secure</h3> </div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-steel-400">{site.infoSecure}</p>
      </div>
    </aside>
  );
}

function ActionBar() {
  const { state, triggerSave, goToStep } = useOnboarding();
  const router = useRouter();
  const next = ONBOARDING_STEPS[state.currentStepIndex + 1];
  const busy = state.saveState === 'saving';
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSaveAndContinue = async () => {
    if (isTransitioning || busy || !next) return;
    setIsTransitioning(true);

    const scope = document.querySelector('[data-main]') as HTMLElement;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (scope && !prefersReducedMotion) {
      const { timeline, revert } = createRouteSignalTimeline(scope, state.currentStepIndex, state.currentStepIndex + 1);
      if (timeline) timeline.play();

      setTimeout(async () => {
        const ok = await triggerSave();
        if (ok) {
          setTimeout(() => {
            goToStep(state.currentStepIndex + 1);
          }, 340);
        }
      }, 240);

      setTimeout(() => {
        setIsTransitioning(false);
        if (revert) revert();
      }, 1100);
    } else {
      const ok = await triggerSave();
      if (ok) goToStep(state.currentStepIndex + 1);
      setIsTransitioning(false);
    }
  };

  return (
    <div className="px-5 py-3 border-t border-steel-700/25 flex flex-wrap items-center justify-between gap-6 gap-y-3" data-text>
      <div className="flex items-center gap-4">
        <button type="button" disabled={busy || isTransitioning} onClick={async () => { await triggerSave(); router.push('/'); }}
          className="flex items-center gap-2 h-9 px-4 rounded-[7px] border border-steel-700/40 bg-ink-900 text-[13px] font-semibold text-ivory-100 hover:border-steel-600 transition-colors disabled:opacity-50">
          <ArrowLeft size={14} /> Save & Exit
        </button>
        <span className="text-[12px] text-steel-500">Your progress will be saved</span>
      </div>
      <div className="flex flex-col items-end gap-1">
        <button type="button" data-cta-continue disabled={busy || isTransitioning || !next} onClick={handleSaveAndContinue}
          className="group flex items-center gap-3 h-10 px-7 rounded-[7px] bg-brass-500 hover:bg-brass-400 text-ink-950 text-[13px] font-display font-semibold uppercase tracking-[0.06em] shadow-[0_16px_36px_rgba(0,0,0,0.18)] transition-colors disabled:opacity-60">
          {busy || isTransitioning ? 'Saving…' : 'Save & Continue'}
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
        {next && <span className="text-[11px] text-steel-500">Next: {next.label}</span>}
      </div>
    </div>
  );
}

const SCENE_REGISTRY: Partial<Record<number, ComponentType>> = {
  0: Scene01Company,
  1: Scene02Authority,
  2: Scene03Insurance,
  3: Scene04Fleet,
  4: Scene05Documents,
  5: Scene06Review,
  6: Scene07Submit,
};

function ScenePlaceholder() {
  const { state } = useOnboarding();
  const step = ONBOARDING_STEPS[state.currentStepIndex];
  return (
    <div className="rounded-[9px] border border-dashed border-steel-700/40 bg-ink-900/30 p-8 text-center">
      <p className="font-tech text-[11px] uppercase tracking-[0.18em] text-steel-500">Scene {step.index} — {step.label}</p>
      <p className="mt-2 text-[13px] text-steel-400 max-w-md mx-auto">Wired into the shell — implementation activates when it lands.</p>
    </div>
  );
}

function WorkspaceSkeleton() {
  return (
    <div className="flex flex-col flex-1" aria-busy="true" aria-label="Loading application">
      <div className="px-4 md:px-8 pt-6"> <div className="h-3 w-56 rounded bg-ink-900" /> <div className="mt-3 h-5 w-full max-w-[560px] rounded bg-ink-900" /> </div>
      <div className="mx-4 md:mx-6 mt-4 mb-6 h-[380px] rounded-[10px] bg-ink-900/50 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.025), transparent)' }} />
      </div>
    </div>
  );
}

function LoadErrorState() {
  const { state, reload } = useOnboarding();
  return (
    <div className="flex-1 grid place-items-center p-10">
      <div className="max-w-md text-center">
        <p className="font-tech text-[11px] uppercase tracking-[0.18em] text-steel-500">System status</p>
        <h1 className="mt-3 font-display text-2xl text-ivory-50">We couldn't reach the dispatch system</h1>
        <p className="mt-3 text-[13px] text-steel-400">{state.error?.message ?? 'Connection problem — check your network and try again.'}</p>
        <button type="button" onClick={reload} className="mt-5 px-6 py-2.5 rounded-[7px] border border-steel-700/40 text-[13px] font-semibold text-ivory-100 hover:border-brass-500/60 hover:text-brass-300 transition-colors">Retry</button>
      </div>
    </div>
  );
}

export function SceneController() {
  const { state } = useOnboarding();
  if (state.status === 'loading') return <WorkspaceSkeleton />;
  if (state.status === 'invalid') return <InvalidLinkState />;
  if (state.status === 'expired') return <ExpiredLinkState />;
  if (state.status === 'error') return <LoadErrorState />;
  if (state.status === 'submitted') return <AlreadySubmittedState session={state.sessionData} />;

  const Scene = SCENE_REGISTRY[state.currentStepIndex] ?? ScenePlaceholder;

  return (
    <div className="flex flex-col flex-1">
      <div className="px-4 md:px-8 pt-6" data-text>
        <p className="font-tech text-[11px] tracking-[0.18em] text-brass-400 uppercase">{site.welcomeEyebrow}</p>
        <h1 className="mt-2 text-[21px] font-semibold leading-snug text-ivory-50">{site.welcomeHeadline}</h1>
      </div>

      <div data-stepper className="overflow-x-auto ob-scroll">
        <OnboardingStepper />
      </div>

      <section className="mx-4 mb-6 border border-steel-700/25 rounded-[10px] bg-ink-900/30 overflow-hidden">
        <SectionHeader />
        <div className="h-px bg-steel-700/25" style={{ margin: '0 20px' }} />
        <div className="ob-scene-grid items-start">
          <div data-scene={state.currentStepIndex} style={{ minWidth: 0 }}>
            <Scene />
          </div>
          <InfoPanel />
        </div>
        <ActionBar />
      </section>
    </div>
  );
}