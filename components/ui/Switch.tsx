'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Briefcase, Code2 } from 'lucide-react';

interface ModeSwitchProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export function ModeSwitch({ 
  className, 
  size = 'md',
  showLabels = true 
}: ModeSwitchProps) {
  const mode = useAppStore((state) => state.mode);
  const toggleMode = useAppStore((state) => state.toggleMode);

  const sizeClasses = {
    sm: 'h-8 w-16',
    md: 'h-10 w-20',
    lg: 'h-12 w-24',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  const isStrategist = mode === 'strategist';

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Label Stratège */}
      {showLabels && (
        <motion.span
          className={cn(
            'text-sm font-medium transition-colors duration-300',
            isStrategist ? 'text-accent-primary' : 'text-foreground-muted'
          )}
          animate={{ opacity: isStrategist ? 1 : 0.5 }}
        >
          Stratège
        </motion.span>
      )}

      {/* Switch Button */}
      <button
        onClick={toggleMode}
        className={cn(
          'relative rounded-full p-1 transition-all duration-500',
          'bg-background-secondary border-2 border-border',
          'hover:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2',
          'focus:ring-offset-background-primary',
          sizeClasses[size]
        )}
        aria-label={`Basculer en mode ${isStrategist ? 'Tech' : 'Stratège'}`}
        role="switch"
        aria-checked={!isStrategist}
      >
        {/* Track background effect */}
        <motion.div
          className="absolute inset-1 rounded-full"
          animate={{
            background: isStrategist
              ? 'linear-gradient(135deg, #C9A962 0%, #D4B87A 100%)'
              : 'linear-gradient(135deg, #00F0FF 0%, #FF00E5 100%)',
          }}
          transition={{ duration: 0.5 }}
          style={{ opacity: 0.2 }}
        />

        {/* Sliding thumb */}
        <motion.div
          className={cn(
            'absolute top-1 flex items-center justify-center rounded-full',
            'bg-accent-primary shadow-lg',
            size === 'sm' && 'h-6 w-6',
            size === 'md' && 'h-8 w-8',
            size === 'lg' && 'h-10 w-10'
          )}
          animate={{
            x: isStrategist ? 0 : size === 'sm' ? 32 : size === 'md' ? 40 : 48,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        >
          <motion.div
            animate={{ rotate: isStrategist ? 0 : 360 }}
            transition={{ duration: 0.5 }}
          >
            {isStrategist ? (
              <Briefcase 
                size={iconSizes[size]} 
                className="text-background-primary" 
              />
            ) : (
              <Code2 
                size={iconSizes[size]} 
                className="text-background-primary" 
              />
            )}
          </motion.div>
        </motion.div>

        {/* Glow effect for tech mode */}
        {!isStrategist && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 10px rgba(0, 240, 255, 0.1)',
            }}
          />
        )}
      </button>

      {/* Label Tech */}
      {showLabels && (
        <motion.span
          className={cn(
            'text-sm font-medium transition-colors duration-300',
            !isStrategist ? 'text-accent-primary' : 'text-foreground-muted'
          )}
          animate={{ opacity: !isStrategist ? 1 : 0.5 }}
        >
          Tech
        </motion.span>
      )}
    </div>
  );
}

// Compact version for mobile
export function ModeSwitchCompact({ className }: { className?: string }) {
  const mode = useAppStore((state) => state.mode);
  const toggleMode = useAppStore((state) => state.toggleMode);

  const isStrategist = mode === 'strategist';

  return (
    <button
      onClick={toggleMode}
      className={cn(
        'relative flex items-center justify-center w-10 h-10 rounded-xl',
        'bg-background-secondary border border-border',
        'hover:border-accent-primary transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-accent-primary',
        className
      )}
      aria-label={`Mode ${isStrategist ? 'Stratège' : 'Tech'}`}
    >
      <motion.div
        animate={{ rotate: isStrategist ? 0 : 180 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {isStrategist ? (
          <Briefcase size={18} className="text-accent-primary" />
        ) : (
          <Code2 size={18} className="text-accent-primary" />
        )}
      </motion.div>

      {/* Glow for tech mode */}
      {!isStrategist && (
        <div className="absolute inset-0 rounded-xl animate-pulse opacity-30 bg-accent-primary blur-sm" />
      )}
    </button>
  );
}

export default ModeSwitch;
