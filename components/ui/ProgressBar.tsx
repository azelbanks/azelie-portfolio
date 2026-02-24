'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  className?: string;
  showLabel?: boolean;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  className,
  showLabel = true,
  showPercentage = true,
  size = 'md',
}: ProgressBarProps) {
  const storeProgress = useAppStore((state) => state.getProgress());
  const mode = useAppStore((state) => state.mode);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const progress = mounted ? storeProgress : 0;

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-foreground-secondary">
            {mode === 'strategist' 
              ? 'Vous connaissez Azélie à'
              : 'Profile.load():'
            }
          </span>
          {showPercentage && (
            <motion.span
              className="text-sm font-mono text-accent-primary"
              key={progress}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {progress}%
            </motion.span>
          )}
        </div>
      )}

      <div
        className={cn(
          'relative w-full overflow-hidden rounded-full',
          'bg-background-tertiary',
          sizeClasses[size]
        )}
      >
        <motion.div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full',
            mode === 'strategist'
              ? 'bg-gradient-to-r from-accent-primary to-accent-secondary'
              : 'bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />

        {mode === 'tech' && (
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${progress}%`,
              boxShadow: '0 0 10px var(--accent-glow), 0 0 20px var(--accent-glow)',
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <motion.div
          className="absolute inset-y-0 w-1/4 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ['-100%', '400%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
        />
      </div>
    </div>
  );
}

export function CircularProgress({ 
  className,
  size = 60,
  strokeWidth = 4,
}: { 
  className?: string;
  size?: number;
  strokeWidth?: number;
}) {
  const storeProgress = useAppStore((state) => state.getProgress());
  const mode = useAppStore((state) => state.mode);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const progress = mounted ? storeProgress : 0;

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bg-tertiary)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            filter: mode === 'tech' ? 'drop-shadow(0 0 6px var(--accent-glow))' : 'none',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-sm font-mono font-bold text-accent-primary"
          key={progress}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {progress}%
        </motion.span>
      </div>
    </div>
  );
}

export default ProgressBar;
