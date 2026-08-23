'use client';
import { createContext, useCallback, useContext, useEffect, useReducer, useRef, type ReactNode } from 'react';
import { obApi, OnboardingApiError } from './api';

export interface CarrierDocument { id: string; documentType: string; fileName: string; reviewStatus: string; }
export interface CarrierData {
  id?: string; status?: string; verificationStatus?: string; agreementStatus?: string;
  legalName?: string | null; dbaName?: string | null; authorityNumber?: string | null;
  dotNumber?: string | null; ein?: string | null; address?: string | null;
  phone?: string | null; email?: string | null; paymentPreference?: string | null;
  factoringCompanyName?: string | null; documents?: CarrierDocument[];
}
export interface LeadData { companyName?: string; contactName?: string; email?: string; phone?: string; }
export interface SessionData {
  status: 'active' | 'submitted' | 'expired' | 'revoked'; readOnly: boolean; expiresAt?: string;
  submittedAt?: string | null; furthestCompletedSection: number; lead: LeadData | null; carrier: CarrierData | null;
}

export type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';
export type ShellStatus = 'loading' | 'ready' | 'invalid' | 'expired' | 'submitted' | 'error';

interface OnboardingState {
  token: string; status: ShellStatus; sessionData: SessionData | null;
  currentStepIndex: number; saveState: SaveState; lastSavedAt: string | null; error: OnboardingApiError | null;
}

type Action =
  | { type: 'SET_STATUS'; status: ShellStatus }
  | { type: 'SET_SESSION'; data: SessionData }
  | { type: 'SET_STEP'; index: number }
  | { type: 'UPDATE_FIELD'; key: keyof CarrierData; value: string | null }
  | { type: 'SET_SAVE_STATE'; state: SaveState; timestamp?: string }
  | { type: 'SET_ERROR'; error: OnboardingApiError | null };

function isLocked(data: SessionData | null | undefined): boolean {
  return data?.readOnly === true || data?.status === 'submitted';
}

function reducer(state: OnboardingState, action: Action): OnboardingState {
  switch (action.type) {
    case 'SET_STATUS': return { ...state, status: action.status };
    case 'SET_SESSION': return { ...state, sessionData: action.data, status: isLocked(action.data) ? 'submitted' : 'ready' };
    case 'SET_STEP': return { ...state, currentStepIndex: Math.max(0, Math.min(6, action.index)) };
    case 'UPDATE_FIELD': {
      if (!state.sessionData || isLocked(state.sessionData)) return state;
      return { ...state, saveState: 'dirty', sessionData: { ...state.sessionData, carrier: { ...(state.sessionData.carrier ?? {}), [action.key]: action.value } as CarrierData } };
    }
    case 'SET_SAVE_STATE': return { ...state, saveState: action.state, lastSavedAt: action.timestamp ?? state.lastSavedAt };
    case 'SET_ERROR': return { ...state, error: action.error };
    default: return state;
  }
}

interface OnboardingContextValue {
  state: OnboardingState; goToStep: (index: number) => void;
  updateField: (key: keyof CarrierData, value: string | null) => void;
  saveSection: (section: number, data: Record<string, unknown>) => Promise<boolean>;
  registerSceneSave: (fn: (() => Promise<boolean>) | null) => void;
  triggerSave: () => Promise<boolean>; saveAndContinue: () => Promise<void>;
  reload: () => void; refreshSession: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ token, children }: { token: string; children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { token, status: 'loading', sessionData: null, currentStepIndex: 0, saveState: 'idle', lastSavedAt: null, error: null });
  const stateRef = useRef(state); stateRef.current = state;
  const sceneSaveRef = useRef<(() => Promise<boolean>) | null>(null);

  const load = useCallback(async () => {
    dispatch({ type: 'SET_STATUS', status: 'loading' }); dispatch({ type: 'SET_ERROR', error: null });
    try {
      const session = await obApi.getSession(token);
      dispatch({ type: 'SET_SESSION', data: session });
      if (!isLocked(session) && typeof session?.furthestCompletedSection === 'number' && session.furthestCompletedSection > 1) {
        dispatch({ type: 'SET_STEP', index: session.furthestCompletedSection - 1 });
      }
    } catch (err) {
      const e = err instanceof OnboardingApiError ? err : new OnboardingApiError(0, 'network_error', 'Connection problem.');
      if (e.status === 404) dispatch({ type: 'SET_STATUS', status: 'invalid' });
      else if (e.status === 410) dispatch({ type: 'SET_STATUS', status: 'expired' });
      else if (e.status === 423) dispatch({ type: 'SET_STATUS', status: 'submitted' });
      else { dispatch({ type: 'SET_ERROR', error: e }); dispatch({ type: 'SET_STATUS', status: 'error' }); }
    }
  }, [token]);

  useEffect(() => { void load(); }, [load]);

  const goToStep = useCallback((index: number) => { dispatch({ type: 'SET_STEP', index }); }, []);
  const updateField = useCallback((key: keyof CarrierData, value: string | null) => { dispatch({ type: 'UPDATE_FIELD', key, value }); }, []);

  // BULLETPROOF SAVE: Defensively merges backend response to prevent state wipe
  const saveSection = useCallback(async (section: number, data: Record<string, unknown>): Promise<boolean> => {
    dispatch({ type: 'SET_SAVE_STATE', state: 'saving' }); dispatch({ type: 'SET_ERROR', error: null });
    try {
      const res = await obApi.saveSection(token, section, data) as any;
      const updatedCarrier = res.carrier ?? res; // Handles nested or flat response
      const existingCarrier = stateRef.current.sessionData?.carrier ?? {};
      const existingDocs = existingCarrier.documents ?? [];
      const updatedDocs = updatedCarrier.documents ?? existingDocs; // Prevents doc wipe if backend omits them

      dispatch({
        type: 'SET_SESSION',
        data: {
          ...(stateRef.current.sessionData ?? ({} as SessionData)),
          carrier: { ...existingCarrier, ...updatedCarrier, documents: updatedDocs },
          furthestCompletedSection: res.furthestCompletedSection ?? stateRef.current.sessionData?.furthestCompletedSection,
        },
      });
      dispatch({ type: 'SET_SAVE_STATE', state: 'saved', timestamp: new Date().toISOString() });
      return true;
    } catch (err) {
      const e = err instanceof OnboardingApiError ? err : new OnboardingApiError(0, 'network_error', 'Connection problem.');
      if (e.status === 410) dispatch({ type: 'SET_STATUS', status: 'expired' });
      else if (e.status === 423) dispatch({ type: 'SET_STATUS', status: 'submitted' });
      else { dispatch({ type: 'SET_ERROR', error: e }); dispatch({ type: 'SET_SAVE_STATE', state: 'error' }); }
      return false;
    }
  }, [token]);

  const refreshSession = useCallback(async () => {
    try { const session = await obApi.getSession(token); dispatch({ type: 'SET_SESSION', data: session }); } catch {}
  }, [token]);

  const registerSceneSave = useCallback((fn: (() => Promise<boolean>) | null) => { sceneSaveRef.current = fn; }, []);
  const triggerSave = useCallback(async (): Promise<boolean> => { if (!sceneSaveRef.current) return false; return sceneSaveRef.current(); }, []);
  const saveAndContinue = useCallback(async () => { const ok = await triggerSave(); if (ok) dispatch({ type: 'SET_STEP', index: stateRef.current.currentStepIndex + 1 }); }, [triggerSave]);

  return (
    <OnboardingContext.Provider value={{ state, goToStep, updateField, saveSection, registerSceneSave, triggerSave, saveAndContinue, reload: load, refreshSession }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}

export function useSceneSave(fn: () => Promise<boolean>) {
  const { registerSceneSave } = useOnboarding();
  const fnRef = useRef(fn); fnRef.current = fn;
  useEffect(() => { registerSceneSave(() => fnRef.current()); return () => registerSceneSave(null); }, [registerSceneSave]);
}
