/* ============ SceneController v3 (Clean) ============ */
'use client';
import { useOnboarding } from '@/lib/onboarding/context';
import { SceneLayout } from './SceneLayout';
import { Scene01Company } from './scenes/Scene01Company';
import { Scene02Equipment } from './scenes/Scene02Equipment';
import { Scene03Preferences } from './scenes/Scene03Preferences';
import { Scene04Billing } from './scenes/Scene04Billing';
import { Scene05Directory } from './scenes/Scene05Directory';
import { Scene06Documents } from './scenes/Scene06Documents';
import { Scene07Submit } from './scenes/Scene07Submit';

export function SceneController() {
  const { state } = useOnboarding();
  const currentStep = state.sessionData ? state.currentStepIndex : 0;

  const renderScene = () => {
    switch (currentStep) {
      case 0: return <Scene01Company />;
      case 1: return <Scene02Equipment />;
      case 2: return <Scene03Preferences />;
      case 3: return <Scene04Billing />;
      case 4: return <Scene05Directory />;
      case 5: return <Scene06Documents />;
      case 6: return <Scene07Submit />;
      default: return <Scene01Company />;
    }
  };

  return <SceneLayout>{renderScene()}</SceneLayout>;
}