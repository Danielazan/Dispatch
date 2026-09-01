/* ============ SceneLayout v4 ============ */
'use client';
import { useOnboarding } from '@/lib/onboarding/context';
import { OnboardingStepper } from './OnboardingStepper';
import { ONBOARDING_STEPS } from '@/lib/onboarding/steps';
import { Building2, Truck, MapPin, CreditCard, Users, FileText, CheckCircle, Clock, Hash, FileBadge, ArrowLeft, ArrowRight } from 'lucide-react';

const STEP_ICONS: Record<string, any> = {
  company: Building2, equipment: Truck, preferences: MapPin,
  billing: CreditCard, directory: Users, documents: FileText, submit: CheckCircle
};

const SAVE_TEXT: Record<string, string> = {
  idle: 'No changes yet',
  dirty: 'Unsaved changes',
  saving: 'Saving...',
  saved: 'All changes saved',
  error: 'Save failed - retry',
};

export function SceneLayout({ children }: { children: React.ReactNode }) {
  const { state, saveAndContinue, goToStep } = useOnboarding();
  const step = ONBOARDING_STEPS[state.currentStepIndex] || ONBOARDING_STEPS[0];
  const Icon = STEP_ICONS[step.id] || Building2;
  const nextLabel = state.currentStepIndex < ONBOARDING_STEPS.length - 1
    ? ONBOARDING_STEPS[state.currentStepIndex + 1].label
    : 'Submit';
  const isFinal = step.id === 'submit';
  const carrierId: string | undefined = state.sessionData?.carrier?.id;
  const appId = carrierId ? `AIK-${carrierId.slice(0, 4).toUpperCase()}-${carrierId.slice(4, 8).toUpperCase()}` : '-';
  const saveText = SAVE_TEXT[state.saveState] ?? 'No changes yet';

  return (
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto" style={{ minWidth: 0 }}>
      <div className="mb-8">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-brass-400 uppercase mb-3">WELCOME TO AIK DISPATCH SOLUTION INC</p>
        <h2 className="text-[24px] md:text-[28px] font-semibold text-ivory-50 leading-tight max-w-3xl">Complete your carrier profile so our team can understand your equipment, preferred lanes, and operating requirements. Once approved, you’ll be able to access freight opportunities aligned with your operation.</h2>
      </div>

      <OnboardingStepper />

      <div className="mb-6 mt-8">
        <div className="rounded-lg border border-steel-700/30 bg-ink-900/50 p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Icon size={20} className="text-brass-400" />
                <p className="text-[11px] font-semibold tracking-[0.15em] text-brass-400 uppercase">Step {step.index} of 7</p>
              </div>
              <h3 className="text-[32px] font-semibold text-ivory-50 mb-3">{step.label}</h3>
              <p className="text-[14px] text-steel-400 leading-relaxed max-w-2xl">{step.description}</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:flex-nowrap">
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-md bg-ink-950/50 border border-steel-700/30 min-w-[140px]">
                <Clock size={16} className="text-steel-500" />
                <div><p className="text-[11px] text-steel-400">Autosave ready</p><p className="text-[12px] text-steel-500">{saveText}</p></div>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-md bg-ink-950/50 border border-steel-700/30 min-w-[140px]">
                <Hash size={16} className="text-steel-500" />
                <div><p className="text-[11px] text-steel-400">Application ID</p><p className="text-[12px] text-steel-500">{appId}</p></div>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-md bg-ink-950/50 border border-steel-700/30 min-w-[140px]">
                <FileBadge size={16} className="text-steel-500" />
                <div><p className="text-[11px] text-steel-400">Status</p><p className="text-[12px] text-status-live">In Progress</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {children}

      {!isFinal && (
        <div className="mt-8 pt-6 border-t border-steel-700/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => goToStep(Math.max(0, state.currentStepIndex - 1))} className="flex items-center gap-2 px-5 py-3 rounded-[7px] border border-steel-700/40 bg-ink-900 text-ivory-50 text-[13px] font-medium hover:bg-ink-800 transition-colors">
              <ArrowLeft size={16} /> Save & Exit
            </button>
            <span className="text-[12px] text-steel-400">Your progress will be saved</span>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <button type="button" onClick={saveAndContinue} className="flex items-center gap-2 px-8 py-3 rounded-[7px] bg-brass-500 hover:bg-brass-400 text-ink-950 text-[13px] font-semibold transition-colors">
              SAVE & CONTINUE <ArrowRight size={16} />
            </button>
            <span className="text-[11px] text-steel-500">Next: {nextLabel}</span>
          </div>
        </div>
      )}
    </div>
  );
}