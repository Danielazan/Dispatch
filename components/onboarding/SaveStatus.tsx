'use client';
import { useOnboarding } from '@/lib/onboarding/context';
import { Check, Cloud, AlertCircle } from 'lucide-react';

export function SaveStatus() {
  const { state } = useOnboarding();
  let icon = <Cloud size={14} />;
  let text = 'READY';
  let color = 'text-steel-500';
  
  if (state.saveState === 'dirty') { text = 'UNSAVED'; color = 'text-brass-400'; }
  if (state.saveState === 'saving') { text = 'SAVING...'; color = 'text-ivory-100'; }
  if (state.saveState === 'saved') { text = 'CONFIRMED'; color = 'text-status-live'; icon = <Check size={14} />; }
  if (state.saveState === 'error') { text = 'SYNC FAILED'; color = 'text-red-400'; icon = <AlertCircle size={14} />; }

  return (
    <div className="flex items-center gap-2 font-tech text-[10px] uppercase tracking-widest" data-text>
      <span className={color}>{icon}</span>
      <span className={color}>{text}</span>
      {state.lastSavedAt && state.saveState !== 'saving' && (
        <span className="text-steel-600 ml-2">· {new Date(state.lastSavedAt).toLocaleTimeString()}</span>
      )}
    </div>
  );
}