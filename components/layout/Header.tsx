'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { ModeSwitch, ModeSwitchCompact } from '@/components/ui/Switch';
import { CircularProgress } from '@/components/ui/ProgressBar';
import { Menu, X, Download, MessageCircle } from 'lucide-react';

const navItems = [
  { id: 'about', label: { strategist: 'À propos', tech: 'about()' }, href: '#about' },
  { id: 'journey', label: { strategist: 'Parcours', tech: 'timeline[]' }, href: '#journey' },
  { id: 'projects', label: { strategist: 'Projets', tech: 'projects/' }, href: '#projects' },
  { id: 'skills', label: { strategist: 'Compétences', tech: 'skills.map()' }, href: '#skills' },
  { id: 'contact', label: { strategist: 'Contact', tech: 'connect()' }, href: '#contact' },
];

export function Header() {
  const mode = useAppStore((state) => state.mode);
  const toggleChat = useAppStore((state) => state.toggleChat);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' }
    );

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-header',
          'transition-all duration-500',
          isScrolled
            ? 'bg-background-primary/80 backdrop-blur-lg border-b border-border shadow-sm'
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="container-custom">
          <nav className="flex items-center justify-between h-16 md:h-20 px-4 md:px-8">
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center font-heading font-bold text-lg',
                'bg-accent-primary text-background-primary',
                mode === 'tech' && 'shadow-glow'
              )}>
                {mode === 'strategist' ? 'AB' : '</>'}
              </div>
              <div className="hidden sm:block">
                <p className="font-heading font-semibold text-foreground-primary">
                  {mode === 'strategist' ? 'Azélie Bernard' : 'azelie.dev'}
                </p>
                <p className="text-xs text-foreground-muted">
                  {mode === 'strategist' ? 'Stratégie × Data × IA' : '// strategy && code'}
                </p>
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                    activeSection === item.id
                      ? 'text-accent-primary bg-accent-primary/10'
                      : 'text-foreground-secondary hover:text-foreground-primary hover:bg-background-secondary'
                  )}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {item.label[mode]}
                </motion.button>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Progress indicator (desktop) */}
              <div className="hidden md:block">
                <CircularProgress size={40} strokeWidth={3} />
              </div>

              {/* Mode Switch (desktop) */}
              <div className="hidden md:block">
                <ModeSwitch size="sm" showLabels={false} />
              </div>

              {/* Chat button */}
              <motion.button
                onClick={toggleChat}
                className={cn(
                  'hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl',
                  'bg-accent-primary text-background-primary',
                  'hover:shadow-glow transition-all duration-300',
                  'text-sm font-medium'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Ouvrir le chatbot"
              >
                <MessageCircle size={16} />
                <span>{mode === 'strategist' ? 'Discutons' : 'chat()'}</span>
              </motion.button>

              {/* CV Download */}
              <motion.a
                href={mode === 'strategist' ? '/cv/CV_Azelie_Bernard_Chef_de_Projet.pdf' : '/cv/CV_Azelie_Bernard_Data_IA.pdf'}
                download
                className={cn(
                  'hidden sm:flex items-center justify-center w-10 h-10 rounded-xl',
                  'border border-border hover:border-accent-primary',
                  'text-foreground-secondary hover:text-accent-primary',
                  'transition-all duration-300'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Télécharger CV"
                aria-label={mode === 'strategist' ? 'Télécharger CV Chef de Projet' : 'Télécharger CV Data & IA'}
              >
                <Download size={18} />
              </motion.a>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  'lg:hidden flex items-center justify-center w-10 h-10 rounded-xl',
                  'bg-background-secondary text-foreground-primary',
                  'hover:bg-background-tertiary transition-colors'
                )}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[99] bg-background-primary/80 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              className={cn(
                'fixed top-0 right-0 bottom-0 z-[100] w-80 max-w-[85vw]',
                'bg-background-primary border-l border-border',
                'lg:hidden flex flex-col'
              )}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Mobile menu header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-heading font-semibold">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-background-secondary"
                  aria-label="Fermer le menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation items */}
              <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavClick(item.href)}
                    className={cn(
                      'w-full text-left px-4 py-3 rounded-xl',
                      'transition-all duration-300',
                      activeSection === item.id
                        ? 'bg-accent-primary/10 text-accent-primary'
                        : 'text-foreground-secondary hover:bg-background-secondary hover:text-foreground-primary'
                    )}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {item.label[mode]}
                  </motion.button>
                ))}
              </nav>

              {/* Mobile menu footer */}
              <div className="p-4 border-t border-border space-y-4">
                {/* Mode switch */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-secondary">Mode</span>
                  <ModeSwitchCompact />
                </div>

                {/* Progress */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-secondary">Progression</span>
                  <CircularProgress size={36} strokeWidth={3} />
                </div>

                {/* CTA buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      toggleChat();
                    }}
                    className={cn(
                      'flex items-center justify-center gap-2 py-3 rounded-xl',
                      'bg-accent-primary text-background-primary',
                      'text-sm font-medium'
                    )}
                  >
                    <MessageCircle size={16} />
                    Chat
                  </button>
                  <a
                    href={mode === 'strategist' ? '/cv/CV_Azelie_Bernard_Chef_de_Projet.pdf' : '/cv/CV_Azelie_Bernard_Data_IA.pdf'}
                    download
                    className={cn(
                      'flex items-center justify-center gap-2 py-3 rounded-xl',
                      'border border-border text-foreground-primary',
                      'text-sm font-medium'
                    )}
                    aria-label="Télécharger CV"
                  >
                    <Download size={16} />
                    CV
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
