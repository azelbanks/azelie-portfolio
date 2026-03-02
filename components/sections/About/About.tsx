'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { staggerContainer, staggerItem, fadeInLeft, fadeInRight } from '@/lib/animations';
import { MapPin, Calendar, GraduationCap, Briefcase, Sparkles, Code2 } from 'lucide-react';

import profileData from '@/content/profile.json';

export function About() {
  const mode = useAppStore((state) => state.mode);
  const markSectionDiscovered = useAppStore((state) => state.markSectionDiscovered);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  useEffect(() => {
    if (isInView) {
      markSectionDiscovered('about');
    }
  }, [isInView, markSectionDiscovered]);

  const isStrategist = mode === 'strategist';

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={cn(
            'absolute top-0 right-0 w-1/2 h-1/2 rounded-full blur-3xl opacity-10',
            isStrategist ? 'bg-accent-primary' : 'bg-accent-primary'
          )}
          style={{ transform: 'translate(25%, -25%)' }}
        />
        <div
          className={cn(
            'absolute bottom-0 left-0 w-1/3 h-1/3 rounded-full blur-3xl opacity-10',
            isStrategist ? 'bg-accent-secondary' : 'bg-accent-secondary'
          )}
          style={{ transform: 'translate(-25%, 25%)' }}
        />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div
            variants={staggerItem}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4',
              'border border-border bg-background-secondary/50'
            )}
          >
            {isStrategist ? (
              <Sparkles size={16} className="text-accent-primary" />
            ) : (
              <Code2 size={16} className="text-accent-primary" />
            )}
            <span className="text-sm font-medium text-foreground-secondary">
              {isStrategist ? 'À propos' : 'about.md'}
            </span>
          </motion.div>

          <motion.h2
            variants={staggerItem}
            className="text-display font-heading font-bold text-foreground-primary mb-4"
          >
            {isStrategist ? 'Qui suis-je ?' : 'whoami'}
          </motion.h2>

          <motion.p
            variants={staggerItem}
            className="text-body-lg text-foreground-secondary max-w-2xl mx-auto"
          >
            {isStrategist
              ? 'Un profil hybride qui transforme la complexité en impact mesurable.'
              : '// hybrid_profile.transform(complexity, measurable_impact)'}
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image / Visual Side */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="relative"
          >
            <div
              className={cn(
                'relative aspect-[4/5] rounded-3xl overflow-hidden',
                'border border-border',
                !isStrategist && 'neon-border'
              )}
            >
              {/* Placeholder for profile image */}
              <div
                className={cn(
                  'absolute inset-0 flex items-center justify-center',
                  'bg-gradient-to-br',
                  isStrategist
                    ? 'from-accent-primary/20 to-accent-secondary/20'
                    : 'from-accent-primary/10 to-accent-secondary/10'
                )}
              >
                <div className="text-center p-8">
                  <div
                    className={cn(
                      'w-32 h-32 mx-auto rounded-full mb-6',
                      'bg-background-secondary border-2 border-accent-primary',
                      'flex items-center justify-center',
                      !isStrategist && 'shadow-glow'
                    )}
                  >
                    <span className="text-4xl font-heading font-bold text-accent-primary">
                      AB
                    </span>
                  </div>
                  <p className="text-foreground-secondary text-sm">
                    {isStrategist ? 'Photo à venir' : '// profile_image.loading'}
                  </p>
                </div>
              </div>

              {/* Tech mode overlay effects */}
              {!isStrategist && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-background-primary/80 to-transparent" />
                  <div className="absolute inset-0 opacity-20">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.1) 2px, rgba(0,240,255,0.1) 4px)',
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Floating badges */}
            <motion.div
              className={cn(
                'absolute -bottom-4 -right-4 p-4 rounded-2xl',
                'bg-background-primary border border-border shadow-lg',
                !isStrategist && 'neon-border'
              )}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center">
                  <MapPin size={20} className="text-accent-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground-primary">Bordeaux</p>
                  <p className="text-xs text-foreground-muted">France</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className={cn(
                'absolute -top-4 -left-4 p-4 rounded-2xl',
                'bg-background-primary border border-border shadow-lg',
                !isStrategist && 'neon-border'
              )}
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-secondary/20 flex items-center justify-center">
                  <GraduationCap size={20} className="text-accent-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground-primary">Master Big Data</p>
                  <p className="text-xs text-foreground-muted">En cours</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Text Content Side */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {/* Mode-specific narrative */}
            <div className="mb-8">
              <motion.p
                key={mode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className={cn(
                  'text-body-lg leading-relaxed',
                  isStrategist ? 'text-foreground-secondary' : 'text-foreground-secondary font-mono text-base'
                )}
              >
                {profileData.about[mode]}
              </motion.p>
            </div>

            {/* Why section */}
            <div
              className={cn(
                'p-6 rounded-2xl mb-8',
                'bg-background-secondary/50 border border-border',
                !isStrategist && 'neon-border'
              )}
            >
              <h3 className={cn(
                'font-heading font-semibold mb-3 text-foreground-primary',
                !isStrategist && 'font-mono'
              )}>
                {isStrategist ? 'Pourquoi cette évolution ?' : '// motivation.reason'}
              </h3>
              <p className="text-foreground-secondary text-sm leading-relaxed">
                {profileData.why}
              </p>
            </div>

            {/* Values */}
            <div className="space-y-4">
              <h3 className={cn(
                'font-heading font-semibold text-foreground-primary',
                !isStrategist && 'font-mono'
              )}>
                {isStrategist ? 'Mes valeurs' : 'values.map()'}
              </h3>
              <div className="grid gap-3">
                {profileData.values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-xl',
                      'bg-background-secondary/30 border border-border/50',
                      'hover:border-accent-primary/50 transition-colors'
                    )}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                        'bg-accent-primary/10 text-accent-primary'
                      )}
                    >
                      <span className="font-mono text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground-primary">{value.title}</p>
                      <p className="text-sm text-foreground-muted">{value.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default About;
