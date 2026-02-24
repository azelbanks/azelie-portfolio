'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

interface TypewriterTextProps {
  texts: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function TypewriterText({
  texts,
  className,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
}: TypewriterTextProps) {
  const mode = useAppStore((state) => state.mode);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentFullText = texts[currentTextIndex];

  const tick = useCallback(() => {
    if (isPaused) return;

    if (!isDeleting) {
      // Typing
      if (displayedText.length < currentFullText.length) {
        setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
      } else {
        // Finished typing, pause before deleting
        setIsPaused(true);
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // Deleting
      if (displayedText.length > 0) {
        setDisplayedText(displayedText.slice(0, -1));
      } else {
        // Finished deleting, move to next text
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }
    }
  }, [currentFullText, displayedText, isDeleting, isPaused, pauseDuration, texts.length]);

  useEffect(() => {
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, typingSpeed, deletingSpeed]);

  // Reset when texts change (mode switch)
  useEffect(() => {
    setCurrentTextIndex(0);
    setDisplayedText('');
    setIsDeleting(false);
    setIsPaused(false);
  }, [texts]);

  const isTerminalStyle = mode === 'tech';

  return (
    <span className={cn('inline-block', className)}>
      {isTerminalStyle && (
        <span className="text-accent-secondary opacity-70 mr-1">&gt;</span>
      )}
      <AnimatePresence mode="wait">
        <motion.span
          key={displayedText}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className="inline"
        >
          {displayedText}
        </motion.span>
      </AnimatePresence>
      <motion.span
        className={cn(
          'inline-block w-[3px] h-[1.1em] ml-1 align-middle',
          isTerminalStyle ? 'bg-accent-primary' : 'bg-accent-secondary'
        )}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'steps(2)' }}
      />
    </span>
  );
}

// Simple version without deletion
export function TypewriterSimple({
  text,
  className,
  speed = 50,
  delay = 0,
  onComplete,
}: {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    if (displayedText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [displayedText, text, speed, started, onComplete]);

  return <span className={className}>{displayedText}</span>;
}

// Decrypt effect for tech mode
export function DecryptText({
  text,
  className,
  duration = 1500,
  delay = 0,
}: {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';

  useEffect(() => {
    const startTimer = setTimeout(() => setIsDecrypting(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!isDecrypting) return;

    const iterations = 10;
    const intervalTime = duration / (text.length * iterations);
    let currentIteration = 0;

    const interval = setInterval(() => {
      const progress = currentIteration / (text.length * iterations);
      const revealedLength = Math.floor(progress * text.length);

      const newText = text
        .split('')
        .map((char, index) => {
          if (index < revealedLength) return char;
          if (char === ' ') return ' ';
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      setDisplayedText(newText);
      currentIteration++;

      if (currentIteration >= text.length * iterations) {
        setDisplayedText(text);
        clearInterval(interval);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isDecrypting, text, duration]);

  return <span className={className}>{displayedText || text.replace(/./g, ' ')}</span>;
}

export default TypewriterText;
