'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Code, 
  Database, 
  Users, 
  Award,
  ChevronRight,
  Brain,
  Briefcase,
  Globe,
  CheckCircle,
  Circle
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

// Types pour les niveaux de compétence (plus concret que des pourcentages)
type SkillLevel = 'notions' | 'operationnel' | 'avance' | 'expert';

interface Skill {
  name: string;
  level: SkillLevel;
  details?: string; // Contexte concret
}

interface SkillCategory {
  id: string;
  name: string;
  icon: typeof Code;
  description: string;
  skills: Skill[];
}

// Configuration des niveaux avec labels français
const LEVEL_CONFIG: Record<SkillLevel, { label: string; dots: number; color: string }> = {
  notions: { label: 'Notions', dots: 1, color: 'text-foreground-muted' },
  operationnel: { label: 'Opérationnel', dots: 2, color: 'text-blue-500' },
  avance: { label: 'Avancé', dots: 3, color: 'text-accent-primary' },
  expert: { label: 'Expert', dots: 4, color: 'text-green-500' },
};

// Données des compétences - adaptées selon le mode
const getSkillCategories = (mode: 'strategist' | 'tech'): SkillCategory[] => {
  if (mode === 'strategist') {
    return [
      {
        id: 'gestion-projet',
        name: 'Gestion de Projet',
        icon: Briefcase,
        description: 'Pilotage de projets complexes et multi-parties prenantes',
        skills: [
          { name: 'Cycle de projet (PCM)', level: 'expert', details: '10+ ans de pratique' },
          { name: 'Cadre logique & Théorie du changement', level: 'expert', details: 'Programmes UE' },
          { name: 'Gestion budgétaire', level: 'avance', details: 'Budgets multi-bailleurs' },
          { name: 'Reporting & Compliance UE', level: 'expert', details: 'Erasmus+, Horizon' },
          { name: 'Coordination de consortiums', level: 'avance', details: 'Europe/Afrique' },
          { name: 'Méthodologies agiles', level: 'operationnel', details: 'Scrum, Kanban' },
        ]
      },
      {
        id: 'financements',
        name: 'Financements Européens',
        icon: Globe,
        description: 'Expertise sur les programmes de financement UE',
        skills: [
          { name: 'Erasmus+', level: 'expert', details: '8+ ans, 50+ projets' },
          { name: 'Horizon Europe', level: 'avance', details: 'Rédaction de propositions' },
          { name: 'Fonds structurels (FEDER, FSE)', level: 'operationnel', details: 'Accompagnement' },
          { name: 'Bailleurs AFD/GIZ', level: 'operationnel', details: 'Coopération Nord/Sud' },
          { name: 'Rédaction de demandes', level: 'expert', details: 'Taux de succès élevé' },
        ]
      },
      {
        id: 'management',
        name: 'Leadership & Communication',
        icon: Users,
        description: 'Animation d\'équipes et relations partenariales',
        skills: [
          { name: 'Management d\'équipe', level: 'avance', details: 'Équipes jusqu\'à 12 pers.' },
          { name: 'Animation de formations', level: 'expert', details: 'Formateur certifié' },
          { name: 'Communication institutionnelle', level: 'avance', details: 'Bailleurs, partenaires' },
          { name: 'Négociation', level: 'avance', details: 'Contexte multiculturel' },
          { name: 'Facilitation d\'ateliers', level: 'expert', details: 'Design thinking, World café' },
        ]
      },
      {
        id: 'outils',
        name: 'Outils & Méthodes',
        icon: Database,
        description: 'Maîtrise des outils de gestion et d\'analyse',
        skills: [
          { name: 'Suite Office avancée', level: 'expert', details: 'Excel, PowerPoint' },
          { name: 'Outils collaboratifs', level: 'avance', details: 'Notion, Trello, Teams' },
          { name: 'Collecte de données', level: 'avance', details: 'Kobo Toolbox, Google Forms' },
          { name: 'Visualisation de données', level: 'operationnel', details: 'Power BI, tableaux de bord' },
          { name: 'Outils IA génératifs', level: 'operationnel', details: 'ChatGPT, Claude pour productivité' },
        ]
      },
    ];
  } else {
    // Mode Tech
    return [
      {
        id: 'programmation',
        name: 'Programmation',
        icon: Code,
        description: 'Langages et frameworks maîtrisés',
        skills: [
          { name: 'Python', level: 'avance', details: 'Pandas, NumPy, scripts ETL' },
          { name: 'SQL', level: 'operationnel', details: 'PostgreSQL, requêtes complexes' },
          { name: 'JavaScript/TypeScript', level: 'operationnel', details: 'React, Next.js' },
          { name: 'HTML/CSS', level: 'operationnel', details: 'Tailwind CSS' },
          { name: 'Git/GitHub', level: 'operationnel', details: 'Versioning, collaboration' },
        ]
      },
      {
        id: 'data',
        name: 'Data Engineering',
        icon: Database,
        description: 'Traitement et analyse de données',
        skills: [
          { name: 'Pandas/NumPy', level: 'avance', details: 'Manipulation de datasets' },
          { name: 'Data Cleaning', level: 'avance', details: 'Pipelines de nettoyage' },
          { name: 'ETL', level: 'operationnel', details: 'Extraction, transformation' },
          { name: 'Visualisation', level: 'avance', details: 'Plotly, Streamlit' },
          { name: 'Power BI', level: 'operationnel', details: 'Dashboards, rapports' },
        ]
      },
      {
        id: 'ia-ml',
        name: 'IA & Machine Learning',
        icon: Brain,
        description: 'Intelligence artificielle et apprentissage automatique',
        skills: [
          { name: 'Scikit-learn', level: 'operationnel', details: 'Classification, régression' },
          { name: 'NLP basique', level: 'notions', details: 'Traitement de texte' },
          { name: 'Streamlit', level: 'avance', details: 'Apps interactives' },
          { name: 'Prompt Engineering', level: 'operationnel', details: 'GPT, Claude' },
          { name: 'RAG (en apprentissage)', level: 'notions', details: 'LangChain, embeddings' },
        ]
      },
      {
        id: 'devops',
        name: 'Outils & DevOps',
        icon: Globe,
        description: 'Environnement de développement et déploiement',
        skills: [
          { name: 'VS Code / Cursor', level: 'avance', details: 'IDE principal' },
          { name: 'Terminal/Bash', level: 'operationnel', details: 'Commandes, scripts' },
          { name: 'Docker', level: 'notions', details: 'Containerisation basique' },
          { name: 'Vercel/Streamlit Cloud', level: 'operationnel', details: 'Déploiement' },
          { name: 'Environnements virtuels', level: 'operationnel', details: 'venv, conda' },
        ]
      },
    ];
  }
};

// Certifications et formations
const certifications = [
  {
    name: 'Mastère Big Data & IA',
    issuer: 'Sup de Vinci',
    date: '2025-2027',
    status: 'En cours',
    relevant: 'both'
  },
  {
    name: 'Coordinateur de Projet (Bioforce)',
    issuer: 'Institut Bioforce',
    date: '2019',
    status: 'Obtenu',
    relevant: 'strategist'
  }
];

// Composant pour afficher le niveau de compétence (dots)
function SkillLevelDots({ level }: { level: SkillLevel }) {
  const config = LEVEL_CONFIG[level];
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4].map((dot) => (
        <div key={dot}>
          {dot <= config.dots ? (
            <CheckCircle size={12} className={config.color} />
          ) : (
            <Circle size={12} className="text-border-primary" />
          )}
        </div>
      ))}
      <span className={cn('ml-2 text-xs', config.color)}>
        {config.label}
      </span>
    </div>
  );
}

// Composant carte de compétence
function SkillCard({ skill, index, isInView }: { skill: Skill; index: number; isInView: boolean }) {
  return (
    <motion.div
      className={cn(
        'flex items-center justify-between p-3 rounded-lg',
        'bg-background-primary/50 border border-border-primary/30',
        'hover:border-accent-primary/30 transition-colors'
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="flex-1">
        <div className="font-medium text-foreground-primary text-sm">
          {skill.name}
        </div>
        {skill.details && (
          <div className="text-xs text-foreground-muted mt-0.5">
            {skill.details}
          </div>
        )}
      </div>
      <SkillLevelDots level={skill.level} />
    </motion.div>
  );
}

// Composant principal
export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const mode = useAppStore(state => state.mode);
  const markSectionDiscovered = useAppStore(state => state.markSectionDiscovered);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const skillCategories = getSkillCategories(mode);
  
  // Initialiser la catégorie active
  useEffect(() => {
    if (skillCategories.length > 0 && !activeCategory) {
      setActiveCategory(skillCategories[0].id);
    }
  }, [skillCategories, activeCategory]);
  
  // Marquer section découverte
  useEffect(() => {
    if (isInView) {
      markSectionDiscovered('skills');
    }
  }, [isInView, markSectionDiscovered]);
  
  const activeSkillCategory = skillCategories.find(c => c.id === activeCategory);
  const relevantCertifications = certifications.filter(
    c => c.relevant === 'both' || c.relevant === mode
  );
  
  return (
    <section
      ref={sectionRef}
      id="skills"
      className="section bg-background-secondary/30 relative overflow-hidden"
    >
      {/* Fond décoratif avec couleurs visibles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container-custom relative z-10">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/10 text-accent-primary text-sm font-medium mb-4">
            <Brain size={16} />
            Compétences
          </div>
          
          <h2 className="text-display font-heading font-bold text-foreground-primary mb-4">
            {mode === 'strategist' ? 'Mes Compétences' : 'Stack Technique'}
          </h2>
          
          <p className="text-lg text-foreground-muted max-w-2xl mx-auto mb-6">
            {mode === 'strategist' 
              ? 'Plus de 10 ans d\'expérience en gestion de projets européens et internationaux.'
              : 'En reconversion vers la data et l\'IA, avec une solide base en gestion de projet.'}
          </p>
          
          {/* Légende des niveaux */}
          <div className="flex flex-wrap justify-center gap-4 mt-6 p-4 rounded-lg bg-background-primary/50 border border-border-primary/30 max-w-xl mx-auto">
            <span className="text-xs text-foreground-muted mr-2">Légende :</span>
            {Object.entries(LEVEL_CONFIG).map(([key, config]) => (
              <div key={key} className="flex items-center gap-1">
                <CheckCircle size={10} className={config.color} />
                <span className={cn('text-xs', config.color)}>{config.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Contenu principal */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Catégories (sidebar) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-2"
          >
            {skillCategories.map((category, index) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-300',
                    'border',
                    isActive
                      ? 'bg-accent-primary/10 border-accent-primary/50 shadow-glow-sm'
                      : 'bg-background-primary/50 border-border-primary/30 hover:border-accent-primary/30'
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                    isActive ? 'bg-accent-primary text-background-primary' : 'bg-background-secondary text-accent-primary'
                  )}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      'font-medium truncate',
                      isActive ? 'text-accent-primary' : 'text-foreground-primary'
                    )}>
                      {category.name}
                    </div>
                    <div className="text-xs text-foreground-muted truncate">
                      {category.skills.length} compétences
                    </div>
                  </div>
                  {isActive && <ChevronRight size={16} className="text-accent-primary" />}
                </motion.button>
              );
            })}
          </motion.div>
          
          {/* Détail des compétences */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            {activeSkillCategory && (
              <div className={cn(
                'p-6 rounded-xl',
                'bg-background-primary/50 backdrop-blur-sm border border-border-primary/30'
              )}>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-foreground-primary mb-2">
                    {activeSkillCategory.name}
                  </h3>
                  <p className="text-sm text-foreground-muted">
                    {activeSkillCategory.description}
                  </p>
                </div>
                
                <div className="space-y-2">
                  {activeSkillCategory.skills.map((skill, index) => (
                    <SkillCard 
                      key={skill.name} 
                      skill={skill} 
                      index={index}
                      isInView={isInView}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Certifications */}
            {relevantCertifications.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-4">
                  Formations & Certifications
                </h4>
                <div className="space-y-3">
                  {relevantCertifications.map((cert, index) => (
                    <motion.div
                      key={cert.name}
                      className={cn(
                        'flex items-center gap-3 p-4 rounded-lg',
                        'bg-background-primary/50 border border-border-primary/30'
                      )}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <Award className="flex-shrink-0 text-accent-primary" size={20} />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-foreground-primary">
                          {cert.name}
                        </div>
                        <div className="text-xs text-foreground-muted">
                          {cert.issuer} • {cert.date}
                        </div>
                      </div>
                      <span className={cn(
                        'px-2 py-1 text-xs rounded-full',
                        cert.status === 'En cours' 
                          ? 'bg-blue-500/10 text-blue-500' 
                          : 'bg-green-500/10 text-green-500'
                      )}>
                        {cert.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Skills;
