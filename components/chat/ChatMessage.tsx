'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { User, Sparkles, Terminal } from 'lucide-react';

interface ChatMessageProps {
  message: { role: 'user' | 'assistant'; content: string };
  index: number;
  isStreaming?: boolean;
}

function renderMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Split by newlines first
  const lines = text.split('\n');

  lines.forEach((line, lineIdx) => {
    if (lineIdx > 0) {
      parts.push(<br key={`br-${lineIdx}`} />);
    }

    // Process inline markdown: **bold**, `code`, *italic*
    const regex = /(\*\*(.+?)\*\*|`([^`]+)`|\*([^*]+)\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(line)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }

      if (match[2]) {
        // **bold**
        parts.push(
          <strong key={`b-${lineIdx}-${match.index}`} className="font-semibold">
            {match[2]}
          </strong>
        );
      } else if (match[3]) {
        // `code`
        parts.push(
          <code
            key={`c-${lineIdx}-${match.index}`}
            className="px-1 py-0.5 rounded bg-background-tertiary text-accent-primary text-[0.85em]"
          >
            {match[3]}
          </code>
        );
      } else if (match[4]) {
        // *italic*
        parts.push(
          <em key={`i-${lineIdx}-${match.index}`}>{match[4]}</em>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }
  });

  return parts;
}

export function ChatMessage({ message, index, isStreaming }: ChatMessageProps) {
  const mode = useAppStore(state => state.mode);
  const isUser = message.role === 'user';
  const isStrategist = mode === 'strategist';

  const renderedContent = useMemo(
    () => (isUser ? message.content : renderMarkdown(message.content)),
    [message.content, isUser]
  );

  return (
    <motion.div
      className={cn(
        'flex gap-3 px-4 py-2',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: isStreaming ? 0 : Math.min(index * 0.05, 0.3) }}
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
        {renderedContent}
        {isStreaming && (
          <span className="inline-block w-1.5 h-4 ml-0.5 bg-accent-primary animate-pulse align-text-bottom" />
        )}
      </div>
    </motion.div>
  );
}
