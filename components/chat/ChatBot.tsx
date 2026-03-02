'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { X, Trash2, Sparkles, Terminal } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

export function ChatBot() {
  const mode = useAppStore(state => state.mode);
  const isChatOpen = useAppStore(state => state.isChatOpen);
  const setChat = useAppStore(state => state.setChat);
  const chatHistory = useAppStore(state => state.chatHistory);
  const addChatMessage = useAppStore(state => state.addChatMessage);
  const clearChatHistory = useAppStore(state => state.clearChatHistory);
  const isTyping = useAppStore(state => state.isTyping);
  const setIsTyping = useAppStore(state => state.setIsTyping);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [streamingContent, setStreamingContent] = useState('');
  const isStrategist = mode === 'strategist';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping, streamingContent]);

  const handleSendMessage = useCallback(async (message: string) => {
    addChatMessage('user', message);
    setIsTyping(true);
    setStreamingContent('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          mode,
          history: chatHistory,
        }),
      });

      if (!response.ok) {
        let errorMsg: string;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || 'Une erreur est survenue.';
        } catch {
          errorMsg = isStrategist
            ? 'Désolée, une erreur est survenue. Réessayez dans quelques instants.'
            : 'Error: connection.failed() // Try again later';
        }
        addChatMessage('assistant', errorMsg);
        return;
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(l => l.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulated += parsed.content;
                setStreamingContent(accumulated);
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      }

      if (accumulated) {
        setStreamingContent('');
        addChatMessage('assistant', accumulated);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setStreamingContent('');
      const errorMsg = isStrategist
        ? 'Désolée, une erreur est survenue. Réessayez dans quelques instants.'
        : 'Error: connection.failed() // Try again later';
      addChatMessage('assistant', errorMsg);
    } finally {
      setIsTyping(false);
    }
  }, [mode, chatHistory, addChatMessage, setIsTyping, isStrategist]);

  const welcomeMessage = {
    role: 'assistant' as const,
    content: isStrategist
      ? 'Bonjour ! Je suis l\'assistante virtuelle d\'Azélie. Comment puis-je vous aider à découvrir son profil ?'
      : '> init azelie_bot.exe\n// Hey! Ask me anything about Azelie. Skills, projects, background — I got you.',
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.div
          role="dialog"
          aria-label={isStrategist ? 'Assistant virtuel d\'Azélie' : 'azelie.chat()'}
          aria-modal="true"
          className={cn(
            'fixed bottom-4 right-4 z-overlay',
            'w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100dvh-6rem)]',
            'flex flex-col',
            'rounded-2xl overflow-hidden',
            'border border-border',
            'bg-background-primary',
            isStrategist ? 'shadow-lg' : 'shadow-glow neon-border'
          )}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className={cn(
            'flex items-center justify-between px-4 py-3',
            'border-b border-border',
            'bg-background-secondary'
          )}>
            <div className="flex items-center gap-2">
              {isStrategist
                ? <Sparkles size={16} className="text-accent-primary" />
                : <Terminal size={16} className="text-accent-primary" />
              }
              <span className="font-heading font-semibold text-sm text-foreground-primary">
                {isStrategist ? 'Assistant Azélie' : 'azelie.chat()'}
              </span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
            </div>
            <div className="flex items-center gap-1">
              <motion.button
                onClick={clearChatHistory}
                className="p-1.5 rounded-lg hover:bg-background-tertiary text-foreground-muted hover:text-foreground-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={isStrategist ? 'Effacer la conversation' : 'clear()'}
              >
                <Trash2 size={14} />
              </motion.button>
              <motion.button
                onClick={() => setChat(false)}
                className="p-1.5 rounded-lg hover:bg-background-tertiary text-foreground-muted hover:text-foreground-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={isStrategist ? 'Fermer le chat' : 'close()'}
              >
                <X size={14} />
              </motion.button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto py-4 space-y-1" aria-live="polite">
            {chatHistory.length === 0 && !streamingContent && (
              <>
                <ChatMessage message={welcomeMessage} index={0} />
                <div className="px-4 pt-2 pb-1 flex flex-wrap gap-2">
                  {(isStrategist
                    ? [
                        'Qui est Azélie ?',
                        'Pourquoi la data et l\'IA ?',
                        'Ses compétences',
                        'Pourquoi la recruter ?',
                      ]
                    : [
                        'Who is Azélie?',
                        'Pourquoi l\'IA ?',
                        'Stack technique',
                        'Pourquoi la recruter ?',
                      ]
                  ).map((q) => (
                    <motion.button
                      key={q}
                      onClick={() => handleSendMessage(q)}
                      disabled={isTyping}
                      className={cn(
                        'text-xs px-3 py-1.5 rounded-full',
                        'border border-border',
                        'text-foreground-muted hover:text-foreground-primary',
                        'hover:bg-background-secondary',
                        'transition-colors duration-200',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              </>
            )}

            {chatHistory.map((msg, i) => (
              <ChatMessage key={i} message={msg} index={i} />
            ))}

            {streamingContent && (
              <ChatMessage
                message={{ role: 'assistant', content: streamingContent }}
                index={chatHistory.length}
                isStreaming
              />
            )}

            {isTyping && !streamingContent && (
              <motion.div
                className="flex items-center gap-3 px-4 py-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  'border border-border bg-background-secondary'
                )}>
                  {isStrategist
                    ? <Sparkles size={14} className="text-accent-primary" />
                    : <Terminal size={14} className="text-accent-primary" />
                  }
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.span
                      key={i}
                      className="w-2 h-2 rounded-full bg-accent-primary"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput onSend={handleSendMessage} disabled={isTyping} />

          {/* Tech mode scanlines overlay */}
          {!isStrategist && (
            <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,240,255,0.1)_2px,rgba(0,240,255,0.1)_4px)]" />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
