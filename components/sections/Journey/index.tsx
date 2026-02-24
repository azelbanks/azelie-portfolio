'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Calendar, 
  ChevronDown,
  Sparkles,
  Globe
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import timelineData from '@/content/timeline.json';

// Types
interface TimelineItem {
  id: string;
  type: 'experience' | 'education';
  title: string;
  organization: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  duration?: string;
  status?: string;
  description: {
    strategist: string;
    tech: string;
  };
  achievements?: string[];
  skills: string[];
  highlight?: boolean;
  special?: string;
  current?: boolean;
}

// Formater les dates
const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "Aujourd'hui";
  const [year, month] = dateStr.split('-');
  const months = ['Janv.', 'Fév.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
  return `${months[parseInt(month) - 1]} ${year}`;
};

// Contenu de la carte
function TimelineCardContent({
  item,
  mode,
  isExpanded,
  onToggle,
  isEducation,
  alignRight = false
}: {
  item: TimelineItem;
  mode: 'strategist' | 'tech';
  isExpanded: boolean;
  onToggle: () => void;
  isEducation: boolean;
  alignRight?: boolean;
}) {
  return (
    <motion.div
      className={cn(
        'group cursor-pointer p-5 rounded-xl border transition-all duration-300',
        'bg-background-secondary/50 backdrop-blur-sm',
        item.highlight || item.current
          ? 'border-accent-primary/50 shadow-glow-sm' 
          : 'border-border-primary/30 hover:border-accent-primary/30',
        isExpanded && 'ring-2 ring-accent-primary/20'
      )}
      onClick={onToggle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Badge En cours */}
      {item.current && (
        <div className={cn(
          'inline-flex items-center gap-1.5 px-2 py-1 mb-3 rounded-full bg-green-500/10 text-green-500 text-xs font-medium',
          alignRight && 'float-right ml-3'
        )}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          En cours
        </div>
      )}
      
      {/* En-tête */}
      <div className={cn('flex items-start justify-between gap-3 mb-3', alignRight && 'flex-row-reverse')}>
        <div className={cn('flex-1', alignRight && 'text-right')}>
          <div className={cn(
            'flex items-center gap-2 text-xs text-foreground-muted mb-1.5 flex-wrap',
            alignRight && 'justify-end'
          )}>
            <span className={cn(
              'px-2 py-0.5 rounded-full',
              isEducation ? 'bg-blue-500/10 text-blue-500' : 'bg-accent-primary/10 text-accent-primary'
            )}>
              {isEducation ? 'Formation' : 'Expérience'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {formatDate(item.startDate)} — {formatDate(item.endDate)}
            </span>
          </div>
          
          <h3 className="text-base font-semibold text-foreground-primary group-hover:text-accent-primary transition-colors leading-tight">
            {item.title}
          </h3>
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-foreground-muted flex-shrink-0 mt-1"
        >
          <ChevronDown size={18} />
        </motion.div>
      </div>
      
      {/* Organisation & Lieu */}
      <div className={cn(
        'flex flex-wrap items-center gap-3 text-sm text-foreground-muted mb-3',
        alignRight && 'justify-end'
      )}>
        <span className="font-medium text-foreground-secondary">{item.organization}</span>
        <span className="flex items-center gap-1 text-xs">
          <MapPin size={12} />
          {item.location}
        </span>
        {item.duration && (
          <span className="text-accent-primary text-xs font-medium">{item.duration}</span>
        )}
      </div>
      
      {/* Description */}
      <p className={cn(
        'text-sm text-foreground-muted leading-relaxed',
        alignRight && 'text-right'
      )}>
        {item.description[mode]}
      </p>
      
      {/* Contenu expansé */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-border-primary/30">
              {/* Réalisations */}
              {item.achievements && item.achievements.length > 0 && (
                <div className="mb-4">
                  <h4 className={cn(
                    'text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2',
                    alignRight && 'text-right'
                  )}>
                    Réalisations clés
                  </h4>
                  <ul className={cn('space-y-1.5', alignRight && 'text-right')}>
                    {item.achievements.map((achievement, i) => (
                      <li 
                        key={i} 
                        className={cn(
                          'text-sm text-foreground-muted flex items-start gap-2',
                          alignRight && 'flex-row-reverse'
                        )}
                      >
                        <span className="text-accent-primary mt-0.5">•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Compétences */}
              <div>
                <h4 className={cn(
                  'text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2',
                  alignRight && 'text-right'
                )}>
                  Compétences mobilisées
                </h4>
                <div className={cn('flex flex-wrap gap-1.5', alignRight && 'justify-end')}>
                  {item.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs rounded-full bg-accent-primary/10 text-accent-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Composant pour un item de la timeline (layout alterné)
function TimelineCard({ 
  item, 
  index, 
  isExpanded, 
  onToggle 
}: { 
  item: TimelineItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const mode = useAppStore(state => state.mode);
  const unlockBadge = useAppStore(state => state.unlockBadge);
  const markSectionDiscovered = useAppStore(state => state.markSectionDiscovered);
  
  if (isInView) {
    markSectionDiscovered('journey');
  }
  
  const isEducation = item.type === 'education';
  const Icon = isEducation ? GraduationCap : Briefcase;
  const isEven = index % 2 === 0;
  
  const handleClick = () => {
    onToggle();
    if (item.special === 'dakar-connection') {
      unlockBadge('dakar-connection');
    }
  };
  
  return (
    <motion.div
      ref={ref}
      className="relative grid grid-cols-[1fr_auto_1fr] gap-4 md:gap-8"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Colonne gauche */}
      <div className={cn('flex', isEven ? 'justify-end' : 'justify-end md:justify-start')}>
        {isEven ? (
          <div className="w-full max-w-md">
            <TimelineCardContent
              item={item}
              mode={mode}
              isExpanded={isExpanded}
              onToggle={handleClick}
              isEducation={isEducation}
              alignRight={true}
            />
          </div>
        ) : (
          <div className="hidden md:block" />
        )}
      </div>
      
      {/* Point central avec ligne */}
      <div className="relative flex flex-col items-center">
        {/* Ligne verticale */}
        <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-accent-primary/50 via-accent-primary/30 to-accent-primary/50" />
        
        {/* Point */}
        <motion.div
          className={cn(
            'relative z-10 flex items-center justify-center',
            'w-10 h-10 rounded-full border-2 mt-4',
            item.highlight || item.current
              ? 'bg-accent-primary border-accent-primary text-background-primary'
              : 'bg-background-secondary border-accent-primary/50 text-accent-primary'
          )}
          whileHover={{ scale: 1.2 }}
        >
          <Icon size={16} />
        </motion.div>
        
        {/* Badge highlight */}
        {(item.highlight || item.current) && (
          <motion.div
            className="absolute top-2 -right-1"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </motion.div>
        )}
      </div>
      
      {/* Colonne droite */}
      <div className={cn('flex', !isEven ? 'justify-start' : 'justify-start md:justify-end')}>
        {!isEven ? (
          <div className="w-full max-w-md">
            <TimelineCardContent
              item={item}
              mode={mode}
              isExpanded={isExpanded}
              onToggle={handleClick}
              isEducation={isEducation}
              alignRight={false}
            />
          </div>
        ) : (
          <div className="hidden md:block" />
        )}
      </div>
    </motion.div>
  );
}

// Version mobile (layout simple)
function TimelineCardMobile({ 
  item, 
  index, 
  isExpanded, 
  onToggle 
}: { 
  item: TimelineItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const mode = useAppStore(state => state.mode);
  const unlockBadge = useAppStore(state => state.unlockBadge);
  const markSectionDiscovered = useAppStore(state => state.markSectionDiscovered);
  
  if (isInView) {
    markSectionDiscovered('journey');
  }
  
  const isEducation = item.type === 'education';
  const Icon = isEducation ? GraduationCap : Briefcase;
  
  const handleClick = () => {
    onToggle();
    if (item.special === 'dakar-connection') {
      unlockBadge('dakar-connection');
    }
  };
  
  return (
    <motion.div
      ref={ref}
      className="relative pl-12"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      {/* Point sur la timeline */}
      <div className="absolute left-0 top-4">
        <motion.div
          className={cn(
            'relative z-10 flex items-center justify-center',
            'w-8 h-8 rounded-full border-2',
            item.highlight || item.current
              ? 'bg-accent-primary border-accent-primary text-background-primary'
              : 'bg-background-secondary border-accent-primary/50 text-accent-primary'
          )}
          whileHover={{ scale: 1.1 }}
        >
          <Icon size={14} />
        </motion.div>
        
        {(item.highlight || item.current) && (
          <motion.div
            className="absolute -right-1 -top-1"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-3 h-3 text-yellow-500" />
          </motion.div>
        )}
      </div>
      
      <TimelineCardContent
        item={item}
        mode={mode}
        isExpanded={isExpanded}
        onToggle={handleClick}
        isEducation={isEducation}
        alignRight={false}
      />
    </motion.div>
  );
}

// Composant principal
export function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const mode = useAppStore(state => state.mode);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'experience' | 'education'>('all');
  
  // Combiner et trier les données
  const allItems: TimelineItem[] = [
    ...timelineData.experiences,
    ...timelineData.education
  ].sort((a, b) => {
    if (a.current && !b.current) return -1;
    if (!a.current && b.current) return 1;
    return b.startDate.localeCompare(a.startDate);
  });
  
  const filteredItems = filter === 'all' 
    ? allItems 
    : allItems.filter(item => item.type === filter);
  
  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  return (
    <section
      ref={sectionRef}
      id="journey"
      className="section bg-background-secondary/30 relative overflow-hidden"
    >
      {/* Fond décoratif */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container-custom relative z-10">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/10 text-accent-primary text-sm font-medium mb-4">
            <Globe size={16} />
            Parcours
          </div>
          
          <h2 className="text-display font-heading font-bold text-foreground-primary mb-4">
            Mon Parcours
          </h2>
          
          <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
            {mode === 'strategist' 
              ? 'Plus de 10 ans d\'expérience en gestion de projets européens et internationaux.'
              : 'De la gestion de projets européens vers la data et l\'IA. Un parcours atypique.'}
          </p>
          
          <div className="w-20 h-1 bg-accent-primary mx-auto mt-6" />
        </motion.div>
        
        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-2 mb-12"
        >
          {[
            { key: 'all', label: 'Tout' },
            { key: 'experience', label: 'Expériences' },
            { key: 'education', label: 'Formations' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                filter === key
                  ? 'bg-accent-primary text-background-primary'
                  : 'bg-background-secondary text-foreground-muted hover:text-foreground-primary border border-border-primary/30'
              )}
            >
              {label}
            </button>
          ))}
        </motion.div>
        
        {/* Timeline Desktop (zigzag) */}
        <div className="hidden md:block relative max-w-5xl mx-auto space-y-8">
          {filteredItems.map((item, index) => (
            <TimelineCard
              key={item.id}
              item={item}
              index={index}
              isExpanded={expandedId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
        
        {/* Timeline Mobile (simple) */}
        <div className="md:hidden relative max-w-lg mx-auto">
          {/* Ligne verticale */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-accent-primary/50 via-accent-primary/30 to-transparent" />
          
          <div className="space-y-6">
            {filteredItems.map((item, index) => (
              <TimelineCardMobile
                key={item.id}
                item={item}
                index={index}
                isExpanded={expandedId === item.id}
                onToggle={() => handleToggle(item.id)}
              />
            ))}
          </div>
        </div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto"
        >
          {[
            { value: '10+', label: 'Années d\'expérience' },
            { value: '4', label: 'Pays' },
            { value: '50+', label: 'Projets accompagnés' },
          ].map((stat, i) => (
            <div 
              key={i}
              className="text-center p-4 rounded-xl bg-background-secondary/50 border border-border-primary/30"
            >
              <div className="text-2xl md:text-3xl font-bold text-accent-primary">
                {stat.value}
              </div>
              <div className="text-xs text-foreground-muted mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Journey;
