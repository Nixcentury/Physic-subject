'use client';

import { useState } from 'react';

import { HubShell } from '@/components/learning-hub/hub-shell';
import { LoginScreen } from '@/components/learning-hub/login-screen';

export function LearningHubApp() {
  const [isGuest, setIsGuest] = useState(false);

  if (!isGuest) {
    return <LoginScreen onContinue={() => setIsGuest(true)} />;
  }

  return <HubShell onSignOut={() => setIsGuest(false)} />;
}
