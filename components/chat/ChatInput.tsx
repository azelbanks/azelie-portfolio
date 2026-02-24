'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const mode = useAppStore(state => state.mode);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isStrategist = mode === 'strategist';

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn(
      'flex items-center gap-2 p-3 border-t border-border',
      'bg-background-primary'
    )}>
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isStrategist
          ? 'Posez votre question...'
          : '> type your query...'
        }
        disabled={disabled}
        className={cn(
          'flex-1 bg-background-secondary rounded-xl px-4 py-2.5',
          'text-sm text-foreground-primary placeholder:text-foreground-muted',
          'border border-border-subtle focus:border-accent-primary focus:outline-none',
          'transition-colors duration-200',
          !isStrategist && 'font-mono',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      />
      <motion.button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-xl',
          'flex items-center justify-center',
          'bg-accent-primary text-background-primary',
          'disabled:opacity-30 disabled:cursor-not-allowed',
          'transition-all duration-200'
        )}
        whileHover={!disabled ? { scale: 1.05 } : undefined}
        whileTap={!disabled ? { scale: 0.95 } : undefined}
      >
        {disabled ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
      </motion.button>
    </div>
  );
}
