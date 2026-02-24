'use client';

import { useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/store';

// Konami Code sequence: ↑↑↓↓←→←→BA
// Uses event.key instead of event.code to support all keyboard layouts (AZERTY, QWERTY, etc.)
const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

interface KonamiListenerProps {
  onActivate: () => void;
}

export function KonamiListener({ onActivate }: KonamiListenerProps) {
  const konamiProgress = useAppStore((state) => state.konamiProgress);
  const updateKonamiProgress = useAppStore((state) => state.updateKonamiProgress);
  const resetKonamiProgress = useAppStore((state) => state.resetKonamiProgress);
  const easterEggUnlocked = useAppStore((state) => state.easterEggUnlocked);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const expectedKey = KONAMI_CODE[konamiProgress];

      if (event.key.toLowerCase() === expectedKey.toLowerCase()) {
        const newProgress = konamiProgress + 1;

        if (newProgress === KONAMI_CODE.length) {
          // Code complete!
          onActivate();
          resetKonamiProgress();
        } else {
          updateKonamiProgress(newProgress);
        }
      } else {
        // Wrong key, reset progress
        resetKonamiProgress();
      }
    },
    [konamiProgress, easterEggUnlocked, onActivate, updateKonamiProgress, resetKonamiProgress]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset progress after 2 seconds of inactivity
  useEffect(() => {
    if (konamiProgress > 0) {
      const timeout = setTimeout(() => {
        resetKonamiProgress();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [konamiProgress, resetKonamiProgress]);

  // Visual feedback (optional - could show progress indicator)
  return null;
}

// Hook version for flexibility
export function useKonamiCode(onActivate: () => void) {
  const konamiProgress = useAppStore((state) => state.konamiProgress);
  const updateKonamiProgress = useAppStore((state) => state.updateKonamiProgress);
  const resetKonamiProgress = useAppStore((state) => state.resetKonamiProgress);
  const easterEggUnlocked = useAppStore((state) => state.easterEggUnlocked);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const expectedKey = KONAMI_CODE[konamiProgress];

      if (event.key.toLowerCase() === expectedKey.toLowerCase()) {
        const newProgress = konamiProgress + 1;

        if (newProgress === KONAMI_CODE.length) {
          onActivate();
          resetKonamiProgress();
        } else {
          updateKonamiProgress(newProgress);
        }
      } else {
        resetKonamiProgress();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiProgress, easterEggUnlocked, onActivate, updateKonamiProgress, resetKonamiProgress]);

  useEffect(() => {
    if (konamiProgress > 0) {
      const timeout = setTimeout(() => {
        resetKonamiProgress();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [konamiProgress, resetKonamiProgress]);

  return {
    progress: konamiProgress,
    total: KONAMI_CODE.length,
    percentage: Math.round((konamiProgress / KONAMI_CODE.length) * 100),
  };
}

export default KonamiListener;
