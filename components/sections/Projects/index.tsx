'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, 
  Github, 
  Star, 
  ArrowUpRight,
  Layers,
  Play,
  X
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

// Types
interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: {
    strategist: string;
    tech: string;
  };
  category: string;
  tags: string[];
  links: {
    demo?: string;
    github?: string;
    streamlit?: string;
  };
  highlights: string[];
  featured?: boolean;
}

// Données des projets - 100% français
const projects: Project[] = [
  {
    id: 'dilemme-prisonnier',
    title: 'Le Dilemme du Prisonnier',
    subtitle: 'Simulation de théorie des jeux',
    description: {
      strategist: 'Application interactive pour explorer les concepts de théorie des jeux et de prise de décision stratégique. Un outil pédagogique pour comprendre les dynamiques de coopération et de compétition.',
      tech: 'Application Streamlit implémentant le dilemme du prisonnier itéré avec plusieurs stratégies IA (Tit-for-Tat, Pavlov, Random). Visualisation en temps réel avec Plotly.'
    },
    category: 'data',
    tags: ['Python', 'Streamlit', 'Théorie des jeux', 'Plotly'],
    links: {
      streamlit: 'https://azelie-bernard-dilemme-prisonnier.streamlit.app',
      github: 'https://github.com/azelie-bernard/dilemme-prisonnier'
    },
    highlights: [
      '5 stratégies IA implémentées',
      'Visualisation interactive',
      'Analyse des patterns'
    ],
    featured: true
  },
  {
    id: 'portfolio-dualite',
    title: 'Portfolio Dualité',
    subtitle: 'Ce site web',
    description: {
      strategist: 'Portfolio interactif avec un système de switch entre deux univers visuels : Stratège et Tech. Inclut un système de gamification avec badges et un easter egg interactif.',
      tech: 'Application Next.js 14 avec TypeScript, Tailwind CSS et Framer Motion. Architecture de composants modulaire, gestion d\'état avec Zustand, animations fluides.'
    },
    category: 'web',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'Framer Motion'],
    links: {
      github: 'https://github.com/azelie-bernard/portfolio'
    },
    highlights: [
      'Double thème Stratège/Tech',
      'Gamification intégrée',
      'Easter Egg caché'
    ],
    featured: true
  },
  {
    id: 'erasmus-dashboard',
    title: 'Tableau de bord Erasmus+',
    subtitle: 'Suivi de projets européens',
    description: {
      strategist: 'Système de suivi des indicateurs de performance pour les projets Erasmus+. Automatisation du reporting mensuel et visualisation claire des données d\'impact.',
      tech: 'Pipeline de données depuis Excel/CSV vers Power BI. Scripts Python pour le nettoyage automatique des données. Suivi de 50+ projets européens.'
    },
    category: 'data',
    tags: ['Power BI', 'Excel', 'Python', 'Reporting'],
    links: {},
    highlights: [
      '50+ projets suivis',
      'Reporting automatisé',
      'KPIs temps réel'
    ],
    featured: false
  },
  {
    id: 'data-toolkit',
    title: 'Boîte à outils Data',
    subtitle: 'Scripts de nettoyage de données',
    description: {
      strategist: 'Suite d\'outils automatisés pour le nettoyage et la standardisation de jeux de données. Réduction du temps de préparation de 70%.',
      tech: 'Toolkit Python avec Pandas : détection de doublons, imputation de valeurs manquantes, inférence de types, export multi-format (CSV, Excel, JSON).'
    },
    category: 'data',
    tags: ['Python', 'Pandas', 'Automatisation'],
    links: {
      github: 'https://github.com/azelie-bernard/data-toolkit'
    },
    highlights: [
      '-70% temps de préparation',
      'Détection automatique',
      'Multi-format'
    ],
    featured: false
  }
];

// Catégories
const categories = [
  { id: 'all', label: 'Tous les projets' },
  { id: 'data', label: 'Data & Analytics' },
  { id: 'web', label: 'Applications Web' },
];

// Modal Streamlit
function StreamlitModal({ 
  url, 
  isOpen, 
  onClose,
  title 
}: { 
  url: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}) {
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          className="relative w-full max-w-6xl h-[85vh] bg-background-primary rounded-xl overflow-hidden border border-border-primary"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          <div className="flex items-center justify-between p-4 border-b border-border-primary bg-background-secondary">
            <h3 className="font-semibold text-foreground-primary">{title}</h3>
            <div className="flex items-center gap-2">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 transition-colors"
              >
                <ExternalLink size={14} />
                Ouvrir dans un nouvel onglet
              </a>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-background-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <iframe
            src={url}
            className="w-full h-[calc(100%-60px)]"
            title={title}
            allow="clipboard-write; clipboard-read"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Carte projet
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const mode = useAppStore(state => state.mode);
  const [showStreamlit, setShowStreamlit] = useState(false);
  
  const hasLinks = project.links.demo || project.links.github || project.links.streamlit;
  
  return (
    <>
      <motion.div
        ref={ref}
        className={cn(
          'group relative rounded-xl overflow-hidden border transition-all duration-300',
          'bg-background-secondary/50 backdrop-blur-sm border-border-primary/30',
          'hover:border-accent-primary/50 hover:shadow-glow-sm',
          project.featured && 'md:col-span-2'
        )}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -4 }}
      >
        {/* Badge Featured */}
        {project.featured && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-medium">
            <Star size={12} fill="currentColor" />
            Projet phare
          </div>
        )}
        
        {/* Image/Visual */}
        <div className={cn(
          'relative h-44 overflow-hidden',
          'bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20'
        )}>
          {/* Pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(45deg, currentColor 1px, transparent 1px),
                                linear-gradient(-45deg, currentColor 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }}
          />
          
          {/* Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-5xl opacity-30">
              {project.category === 'data' ? '📊' : '🌐'}
            </div>
          </div>
          
          {/* Overlay avec boutons */}
          {hasLinks && (
            <div className={cn(
              'absolute inset-0 flex items-center justify-center gap-3',
              'bg-background-primary/90 backdrop-blur-sm',
              'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
            )}>
              {project.links.streamlit && (
                <button
                  onClick={() => setShowStreamlit(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-accent-primary text-background-primary hover:scale-105 transition-transform"
                >
                  <Play size={16} />
                  Voir la démo
                </button>
              )}
              
              {project.links.demo && !project.links.streamlit && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-accent-primary text-background-primary hover:scale-105 transition-transform"
                >
                  <ExternalLink size={16} />
                  Voir
                </a>
              )}
              
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-background-secondary text-foreground-primary border border-border-primary hover:scale-105 transition-transform"
                >
                  <Github size={16} />
                  Code
                </a>
              )}
            </div>
          )}
        </div>
        
        {/* Contenu */}
        <div className="p-5">
          <div className="mb-1 text-xs text-foreground-muted">{project.subtitle}</div>
          
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-foreground-primary group-hover:text-accent-primary transition-colors">
            {project.title}
            <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          
          <p className="text-sm text-foreground-muted mb-4 line-clamp-3">
            {project.description[mode]}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs rounded-md bg-accent-primary/10 text-accent-primary"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* Highlights */}
          <div className="pt-3 border-t border-border-primary/30">
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-foreground-muted">
              {project.highlights.map((highlight, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="text-accent-primary">•</span>
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Modal Streamlit */}
      {project.links.streamlit && (
        <StreamlitModal
          url={project.links.streamlit}
          isOpen={showStreamlit}
          onClose={() => setShowStreamlit(false)}
          title={project.title}
        />
      )}
    </>
  );
}

// Composant principal
export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const mode = useAppStore(state => state.mode);
  const markSectionDiscovered = useAppStore(state => state.markSectionDiscovered);
  const [activeFilter, setActiveFilter] = useState('all');
  
  if (isInView) {
    markSectionDiscovered('projects');
  }
  
  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);
  
  return (
    <section
      ref={sectionRef}
      id="projects"
      className="section relative overflow-hidden"
    >
      <div className="container-custom relative z-10">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/10 text-accent-primary text-sm font-medium mb-4">
            <Layers size={16} />
            Portfolio
          </div>
          
          <h2 className="text-display font-heading font-bold text-foreground-primary mb-4">
            Mes Projets
          </h2>
          
          <p className="text-lg text-foreground-muted max-w-2xl mx-auto mb-6">
            {mode === 'strategist' 
              ? 'Une sélection de réalisations illustrant mes compétences en gestion de projet et en analyse de données.'
              : 'Projets personnels et professionnels en data et développement web.'}
          </p>
          
          <div className="w-20 h-1 bg-accent-primary mx-auto" />
        </motion.div>
        
        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                activeFilter === cat.id
                  ? 'bg-accent-primary text-background-primary'
                  : 'bg-background-secondary text-foreground-muted hover:text-foreground-primary border border-border-primary/30'
              )}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>
        
        {/* Grille de projets */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* CTA Dilemme du Prisonnier */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className={cn(
            'mt-12 p-6 rounded-xl text-center',
            'bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10',
            'border border-accent-primary/20'
          )}
        >
          <h3 className="text-lg font-semibold text-foreground-primary mb-2">
            🎮 Testez le Dilemme du Prisonnier
          </h3>
          <p className="text-sm text-foreground-muted mb-4 max-w-lg mx-auto">
            Explorez les concepts de théorie des jeux avec cette application interactive. Affrontez différentes stratégies d'IA et découvrez la vôtre !
          </p>
          <a
            href="https://azelie-bernard-dilemme-prisonnier.streamlit.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-accent-primary text-background-primary hover:opacity-90 transition-opacity"
          >
            <Play size={16} />
            Lancer l'application
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default Projects;
