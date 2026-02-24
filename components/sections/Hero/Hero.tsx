'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { ModeSwitch } from '@/components/ui/Switch';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { TypewriterText } from './TypewriterText';
import { ParticleField } from './ParticleField';
import { ArrowDown, Sparkles, Terminal } from 'lucide-react';

// Profile data
import profileData from '@/content/profile.json';

export function Hero() {
  const mode = useAppStore((state) => state.mode);
  const markSectionDiscovered = useAppStore((state) => state.markSectionDiscovered);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  // Mark hero as discovered on mount
  useEffect(() => {
    markSectionDiscovered('hero');
  }, [markSectionDiscovered]);

  const isStrategist = mode === 'strategist';

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {/* Particle Field */}
        <ParticleField />

        {/* Gradient overlay */}
        <div
          className={cn(
            'absolute inset-0 transition-all duration-700',
            isStrategist
              ? 'bg-gradient-to-b from-transparent via-background-primary/50 to-background-primary'
              : 'bg-gradient-to-b from-transparent via-background-primary/70 to-background-primary'
          )}
        />

        {/* Grid pattern for tech mode */}
        {!isStrategist && (
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(var(--accent-primary) 1px, transparent 1px),
                  linear-gradient(90deg, var(--accent-primary) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
              }}
            />
          </div>
        )}

        {/* Noise texture */}
        <div className="absolute inset-0 noise opacity-[0.02]" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 container-custom px-6 md:px-8 py-20"
        style={{ opacity, scale, y }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Pre-title badge */}
          <motion.div
            className="inline-flex items-center gap-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full',
                'border border-border bg-background-secondary/50 backdrop-blur-sm',
                isStrategist ? '' : 'neon-border'
              )}
            >
              {isStrategist ? (
                <Sparkles size={16} className="text-accent-primary" />
              ) : (
                <Terminal size={16} className="text-accent-primary" />
              )}
              <span className="text-sm font-medium text-foreground-secondary">
                {isStrategist
                  ? 'Profil hybride · Stratégie × Data × IA'
                  : '> profile.type = "hybrid" // strategy && code'}
              </span>
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            className="text-display-xl font-heading font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="text-foreground-primary">
              {profileData.personal.name}
            </span>
          </motion.h1>

          {/* Animated Title */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <TypewriterText
              texts={
                isStrategist
                  ? [
                      'Ingénieure de Projets Européens',
                      'Cheffe de Projet',
                      'Data Analyst en devenir',
                      'Profil Hybride',
                    ]
                  : [
                      'const role = "Data Engineer";',
                      'function buildPipelines() {}',
                      'class HybridProfile {}',
                      '// strategy.merge(code)',
                    ]
              }
              className={cn(
                'text-headline',
                isStrategist
                  ? 'text-accent-secondary font-heading'
                  : 'text-accent-primary font-mono'
              )}
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            className={cn(
              'text-title text-foreground-secondary mb-8 max-w-2xl mx-auto',
              isStrategist ? '' : 'font-mono text-lg'
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {isStrategist ? (
              <>
                <span className="text-gradient font-semibold">
                  {profileData.personal.tagline}
                </span>
                <br />
                <span className="text-body-lg mt-2 block">
                  8 ans d&apos;expérience en gestion de projets complexes.
                  <br />
                  Aujourd&apos;hui, je code ce que j&apos;analysais.
                </span>
              </>
            ) : (
              <>
                <span className="text-accent-primary">{`// `}</span>
                <span className="text-gradient">{profileData.personal.tagline}</span>
                <br />
                <code className="text-sm mt-2 block text-foreground-muted">
                  {`experience.years = 8; // now I code what I used to analyze`}
                </code>
              </>
            )}
          </motion.p>

          {/* Mode Switch */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <ModeSwitch size="lg" />
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            className="max-w-md mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <ProgressBar size="md" />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
              glowEffect={!isStrategist}
            >
              {isStrategist ? 'Découvrir mon parcours' : 'explore()'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {isStrategist ? 'Voir mes projets' : 'viewProjects()'}
            </Button>
          </motion.div>

          {/* Key metrics */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            {profileData.highlights.map((highlight, index) => (
              <motion.div
                key={highlight.label}
                className={cn(
                  'p-4 rounded-2xl',
                  'bg-background-secondary/50 backdrop-blur-sm',
                  'border border-border',
                  !isStrategist && 'hover:neon-border transition-all duration-300'
                )}
                whileHover={{ y: -5, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
              >
                <p className={cn(
                  'text-2xl md:text-3xl font-bold',
                  isStrategist ? 'text-accent-primary' : 'text-accent-primary font-mono'
                )}>
                  {highlight.number}
                </p>
                <p className="text-sm font-medium text-foreground-primary mt-1">
                  {highlight.label}
                </p>
                <p className="text-xs text-foreground-muted">
                  {highlight.context}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.button
          onClick={() => {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={cn(
            'flex flex-col items-center gap-2 text-foreground-muted',
            'hover:text-accent-primary transition-colors'
          )}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-xs font-medium">
            {isStrategist ? 'Scroll' : 'scroll()'}
          </span>
          <ArrowDown size={20} />
        </motion.button>
      </motion.div>
    </section>
  );
}

export default Hero;
