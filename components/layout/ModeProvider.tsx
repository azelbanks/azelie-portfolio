'use client';

import { useEffect, ReactNode } from 'react';
import { useAppStore } from '@/lib/store';

interface ModeProviderProps {
  children: ReactNode;
}

export function ModeProvider({ children }: ModeProviderProps) {
  const mode = useAppStore((state) => state.mode);
  const setHasVisited = useAppStore((state) => state.setHasVisited);

  // Sync mode with document attribute on mount and changes
  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
  }, [mode]);

  // Mark as visited on first load
  useEffect(() => {
    setHasVisited();
  }, [setHasVisited]);

  return <>{children}</>;
}

export default ModeProvider;
