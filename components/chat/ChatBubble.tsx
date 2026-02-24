'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';

export function ChatBubble() {
  const mode = useAppStore(state => state.mode);
  const isChatOpen = useAppStore(state => state.isChatOpen);
  const toggleChat = useAppStore(state => state.toggleChat);
  const chatHistory = useAppStore(state => state.chatHistory);
  const isStrategist = mode === 'strategist';

  return (
    <AnimatePresence>
      {!isChatOpen && (
        <motion.button
          onClick={toggleChat}
          className={cn(
            'fixed bottom-6 right-6 z-overlay',
            'w-14 h-14 rounded-full',
            'flex items-center justify-center',
            'bg-accent-primary text-background-primary',
            'transition-all duration-300',
            isStrategist ? 'shadow-lg hover:shadow-xl' : 'shadow-glow hover:shadow-glow-lg'
          )}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isStrategist ? 'Ouvrir le chat' : 'Open chat'}
        >
          <MessageCircle size={24} />

          {chatHistory.length === 0 && (
            <motion.span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
