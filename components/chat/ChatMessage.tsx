'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { User, Sparkles, Terminal } from 'lucide-react';

interface ChatMessageProps {
  message: { role: 'user' | 'assistant'; content: string };
  index: number;
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const mode = useAppStore(state => state.mode);
  const isUser = message.role === 'user';
  const isStrategist = mode === 'strategist';

  return (
    <motion.div
      className={cn(
        'flex gap-3 px-4 py-2',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
    >
      {/* Avatar */}
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
        isUser
          ? 'bg-accent-primary text-background-primary'
          : 'border border-border bg-background-secondary'
      )}>
        {isUser
          ? <User size={14} />
          : isStrategist
            ? <Sparkles size={14} className="text-accent-primary" />
            : <Terminal size={14} className="text-accent-primary" />
        }
      </div>

      {/* Message bubble */}
      <div className={cn(
        'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
        isUser
          ? 'bg-accent-primary text-background-primary rounded-br-sm'
          : cn(
              'bg-background-secondary border border-border-subtle text-foreground-primary rounded-bl-sm',
              !isStrategist && 'font-mono text-[13px]'
            )
      )}>
        {message.content}
      </div>
    </motion.div>
  );
}
