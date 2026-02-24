import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export type Mode = 'strategist' | 'tech';

export interface Section {
  id: string;
  name: string;
  points: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

// Sections configuration
export const SECTIONS: Section[] = [
  { id: 'hero', name: 'Accueil', points: 5 },
  { id: 'about', name: 'À propos', points: 15 },
  { id: 'journey', name: 'Parcours', points: 20 },
  { id: 'projects', name: 'Projets', points: 25 },
  { id: 'skills', name: 'Compétences', points: 15 },
  { id: 'chatbot', name: 'Chat IA', points: 10 },
  { id: 'contact', name: 'Contact', points: 10 },
];

// Badges configuration
export const BADGES_CONFIG: Omit<Badge, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first-contact',
    name: 'Premier Contact',
    description: 'A scrollé jusqu\'à la section À propos',
    icon: '👋',
  },
  {
    id: 'explorer',
    name: 'Explorateur',
    description: 'A visité toutes les sections',
    icon: '🧭',
  },
  {
    id: 'curious',
    name: 'Curieux',
    description: 'A posé une question au chatbot',
    icon: '🤔',
  },
  {
    id: 'dakar-connection',
    name: 'Dakar Connection',
    description: 'A découvert l\'expérience au Sénégal',
    icon: '🌍',
  },
  {
    id: 'dual-mode',
    name: 'Mode Dual',
    description: 'A utilisé le switch Stratège/Tech',
    icon: '🔄',
  },
  {
    id: 'gamer',
    name: 'Gamer',
    description: 'A trouvé l\'Easter Egg',
    icon: '🎮',
  },
];

// Store interface
interface AppState {
  // Mode
  mode: Mode;
  toggleMode: () => void;
  setMode: (mode: Mode) => void;
  
  // Progress & Discovery
  discoveredSections: string[];
  markSectionDiscovered: (sectionId: string) => void;
  getProgress: () => number;
  
  // Badges
  badges: Badge[];
  unlockBadge: (badgeId: string) => void;
  
  // Easter Egg
  easterEggUnlocked: boolean;
  unlockEasterEgg: () => void;
  showEasterEggGame: boolean;
  openEasterEggGame: () => void;
  closeEasterEggGame: () => void;
  konamiProgress: number;
  updateKonamiProgress: (progress: number) => void;
  resetKonamiProgress: () => void;
  
  // Chatbot
  chatHistory: { role: 'user' | 'assistant'; content: string }[];
  addChatMessage: (role: 'user' | 'assistant', content: string) => void;
  clearChatHistory: () => void;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;

  // UI State
  isChatOpen: boolean;
  toggleChat: () => void;
  setChat: (open: boolean) => void;
  
  // First Visit
  hasVisited: boolean;
  setHasVisited: () => void;
}

// Create store with persistence
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Mode
      mode: 'strategist',
      toggleMode: () => {
        const newMode = get().mode === 'strategist' ? 'tech' : 'strategist';
        set({ mode: newMode });
        
        // Unlock badge on first toggle
        if (!get().badges.find(b => b.id === 'dual-mode')?.unlocked) {
          get().unlockBadge('dual-mode');
        }
        
        // Update document attribute for CSS
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-mode', newMode);
        }
      },
      setMode: (mode) => {
        set({ mode });
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-mode', mode);
        }
      },
      
      // Progress & Discovery
      discoveredSections: ['hero'],
      markSectionDiscovered: (sectionId) => {
        const current = get().discoveredSections;
        if (!current.includes(sectionId)) {
          set({ discoveredSections: [...current, sectionId] });
          
          // Check for badges
          if (sectionId === 'about' && !get().badges.find(b => b.id === 'first-contact')?.unlocked) {
            get().unlockBadge('first-contact');
          }
          
          // Check if all sections discovered
          if (get().discoveredSections.length === SECTIONS.length - 1) {
            get().unlockBadge('explorer');
          }
        }
      },
      getProgress: () => {
        const discovered = get().discoveredSections;
        const totalPoints = SECTIONS.reduce((sum, s) => sum + s.points, 0);
        const earnedPoints = SECTIONS
          .filter(s => discovered.includes(s.id))
          .reduce((sum, s) => sum + s.points, 0);
        return Math.round((earnedPoints / totalPoints) * 100);
      },
      
      // Badges
      badges: BADGES_CONFIG.map(b => ({ ...b, unlocked: false })),
      unlockBadge: (badgeId) => {
        set(state => ({
          badges: state.badges.map(b =>
            b.id === badgeId && !b.unlocked
              ? { ...b, unlocked: true, unlockedAt: new Date() }
              : b
          ),
        }));
      },
      
      // Easter Egg
      easterEggUnlocked: false,
      unlockEasterEgg: () => {
        set({ easterEggUnlocked: true, showEasterEggGame: true });
        get().unlockBadge('gamer');
      },
      showEasterEggGame: false,
      openEasterEggGame: () => set({ showEasterEggGame: true }),
      closeEasterEggGame: () => set({ showEasterEggGame: false }),
      konamiProgress: 0,
      updateKonamiProgress: (progress) => set({ konamiProgress: progress }),
      resetKonamiProgress: () => set({ konamiProgress: 0 }),
      
      // Chatbot
      chatHistory: [],
      addChatMessage: (role, content) => {
        set(state => ({
          chatHistory: [...state.chatHistory, { role, content }],
        }));

        if (role === 'user') {
          // Mark chatbot section as discovered for gamification
          if (!get().discoveredSections.includes('chatbot')) {
            get().markSectionDiscovered('chatbot');
          }

          // Unlock curious badge on first question
          if (!get().badges.find(b => b.id === 'curious')?.unlocked) {
            get().unlockBadge('curious');
          }
        }
      },
      clearChatHistory: () => set({ chatHistory: [] }),
      isTyping: false,
      setIsTyping: (typing) => set({ isTyping: typing }),
      
      // UI State
      isChatOpen: false,
      toggleChat: () => set(state => ({ isChatOpen: !state.isChatOpen })),
      setChat: (open) => set({ isChatOpen: open }),
      
      // First Visit
      hasVisited: false,
      setHasVisited: () => set({ hasVisited: true }),
    }),
    {
      name: 'azelie-portfolio-storage',
      partialize: (state) => ({
        mode: state.mode,
        discoveredSections: state.discoveredSections,
        badges: state.badges,
        easterEggUnlocked: state.easterEggUnlocked,
        hasVisited: state.hasVisited,
      }),
    }
  )
);

// Selector hooks for better performance
export const useMode = () => useAppStore(state => state.mode);
export const useToggleMode = () => useAppStore(state => state.toggleMode);
export const useProgress = () => useAppStore(state => state.getProgress());
export const useBadges = () => useAppStore(state => state.badges);
export const useEasterEgg = () => useAppStore(state => state.easterEggUnlocked);
export const useChatOpen = () => useAppStore(state => state.isChatOpen);
export const useIsTyping = () => useAppStore(state => state.isTyping);
