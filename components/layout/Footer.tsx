'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Linkedin, Github, Mail, Heart, Coffee } from 'lucide-react';

const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/azélie-bernard',
    icon: Linkedin,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/azelbanks',
    icon: Github,
  },
  {
    name: 'Email',
    href: 'mailto:azeliebernard@gmail.com',
    icon: Mail,
  },
];

export function Footer() {
  const mode = useAppStore((state) => state.mode);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-background-secondary/50">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-primary to-transparent" />

      <div className="container-custom px-6 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Brand */}
          <div className="text-center md:text-left">
            <motion.div
              className="inline-flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center',
                'bg-accent-primary text-background-primary font-heading font-bold text-sm'
              )}>
                {mode === 'strategist' ? 'AB' : '</>'}
              </div>
              <span className="font-heading font-semibold text-foreground-primary">
                {mode === 'strategist' ? 'Azélie Bernard' : 'azelie.dev'}
              </span>
            </motion.div>
            <p className="mt-2 text-sm text-foreground-muted max-w-xs mx-auto md:mx-0">
              {mode === 'strategist'
                ? 'Là où la stratégie rencontre le code.'
                : '// where strategy meets code'}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4">
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-xl',
                  'bg-background-primary border border-border',
                  'text-foreground-secondary hover:text-accent-primary',
                  'hover:border-accent-primary hover:shadow-glow-sm',
                  'transition-all duration-300'
                )}
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={link.name}
              >
                <link.icon size={18} />
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm text-foreground-muted">
              {mode === 'strategist' ? (
                <>
                  © {currentYear} Azélie Bernard
                  <br />
                  <span className="inline-flex items-center gap-1">
                    Fait avec <Heart size={12} className="text-red-500" /> à Bordeaux
                  </span>
                </>
              ) : (
                <>
                  <code className="text-xs">© {currentYear} azelie.run()</code>
                  <br />
                  <span className="inline-flex items-center gap-1 text-xs">
                    powered_by: <Coffee size={12} className="text-accent-primary" /> && passion
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Bottom tagline */}
        <motion.div
          className="mt-8 pt-8 border-t border-border text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className={cn(
            'text-sm',
            mode === 'strategist'
              ? 'text-foreground-muted'
              : 'text-foreground-muted font-mono'
          )}>
            {mode === 'strategist'
              ? '"La coopération finit toujours par payer." — Robert Axelrod'
              : 'return cooperation.alwaysPays(); // Axelrod, 1981'}
          </p>
        </motion.div>
      </div>

      {/* Tech mode scanlines effect */}
      {mode === 'tech' && (
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,240,255,0.1)_2px,rgba(0,240,255,0.1)_4px)]" />
        </div>
      )}
    </footer>
  );
}

export default Footer;
