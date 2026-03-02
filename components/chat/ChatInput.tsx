'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Send, Loader2 } from 'lucide-react';

const MAX_LENGTH = 500;

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const mode = useAppStore(state => state.mode);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isStrategist = mode === 'strategist';
  const remaining = MAX_LENGTH - input.length;
  const isOverLimit = remaining < 0;

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled || isOverLimit) return;
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
      'border-t border-border',
      'bg-background-primary'
    )}>
      <div className="flex items-center gap-2 p-3">
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
          aria-label={isStrategist ? 'Votre message' : 'Your message'}
          className={cn(
            'flex-1 bg-background-secondary rounded-xl px-4 py-2.5',
            'text-sm text-foreground-primary placeholder:text-foreground-muted',
            'border focus:outline-none',
            'transition-colors duration-200',
            !isStrategist && 'font-mono',
            disabled && 'opacity-50 cursor-not-allowed',
            isOverLimit
              ? 'border-red-500 focus:border-red-500'
              : 'border-border-subtle focus:border-accent-primary'
          )}
        />
        <motion.button
          onClick={handleSend}
          disabled={disabled || !input.trim() || isOverLimit}
          className={cn(
            'flex-shrink-0 w-10 h-10 rounded-xl',
            'flex items-center justify-center',
            'bg-accent-primary text-background-primary',
            'disabled:opacity-30 disabled:cursor-not-allowed',
            'transition-all duration-200'
          )}
          whileHover={!disabled ? { scale: 1.05 } : undefined}
          whileTap={!disabled ? { scale: 0.95 } : undefined}
          aria-label={isStrategist ? 'Envoyer' : 'Send'}
        >
          {disabled ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </motion.button>
      </div>
      {input.length > 0 && (
        <div className={cn(
          'px-4 pb-2 -mt-1 text-[10px]',
          remaining <= 50
            ? remaining <= 0
              ? 'text-red-500'
              : 'text-yellow-500'
            : 'text-foreground-muted'
        )}>
          {remaining}
        </div>
      )}
    </div>
  );
}
