'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Handshake, Swords, Trophy, RotateCcw, Sparkles, HelpCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

type Choice = 'cooperate' | 'defect';

interface GameResult {
  round: number;
  playerChoice: Choice;
  aiChoice: Choice;
  playerScore: number;
  aiScore: number;
}

interface PlayerProfile {
  type: string;
  title: { strategist: string; tech: string };
  description: { strategist: string; tech: string };
  skills: string[];
}

const PAYOFFS = {
  'cooperate-cooperate': { player: 3, ai: 3 },
  'cooperate-defect': { player: 0, ai: 5 },
  'defect-cooperate': { player: 5, ai: 0 },
  'defect-defect': { player: 1, ai: 1 },
};

function azélieAI(history: Choice[]): Choice {
  if (history.length === 0) return 'cooperate';
  return history[history.length - 1];
}

const PROFILES: Record<string, PlayerProfile> = {
  cooperator: {
    type: 'cooperator',
    title: { strategist: '🤝 Le Collaborateur', tech: '🤝 The Collaborator' },
    description: { 
      strategist: 'Vous privilégiez la confiance et le travail d\'équipe. Azélie apprécie cette approche !',
      tech: '// trust++ ; You value teamwork and mutual success.'
    },
    skills: ['Travail d\'équipe', 'Communication', 'Confiance']
  },
  defector: {
    type: 'defector',
    title: { strategist: '⚔️ Le Compétiteur', tech: '⚔️ The Competitor' },
    description: {
      strategist: 'Vous maximisez vos gains à court terme. Stratégie efficace mais risquée.',
      tech: '// while(true) { optimize(self); } Short-term gains.'
    },
    skills: ['Compétitivité', 'Décision rapide', 'Résultats']
  },
  strategist: {
    type: 'strategist',
    title: { strategist: '🧠 Le Stratège', tech: '🧠 The Strategist' },
    description: {
      strategist: 'Vous adaptez votre comportement selon la situation. Profil idéal !',
      tech: '// if(context) { adapt(); } Flexible and context-aware.'
    },
    skills: ['Adaptabilité', 'Analyse', 'Vision long-terme']
  },
  balanced: {
    type: 'balanced',
    title: { strategist: '⚖️ L\'Équilibriste', tech: '⚖️ The Balancer' },
    description: {
      strategist: 'Équilibre parfait entre coopération et compétition. Bravo !',
      tech: '// balance(coop, compete); Optimal equilibrium.'
    },
    skills: ['Équilibre', 'Négociation', 'Diplomatie']
  }
};

export function RecruiterDilemma() {
  const mode = useAppStore(state => state.mode);
  const isOpen = useAppStore(state => state.showEasterEggGame);
  const closeGame = useAppStore(state => state.closeEasterEggGame);

  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [round, setRound] = useState(1);
  const totalRounds = 5;
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [playerChoices, setPlayerChoices] = useState<Choice[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [showRules, setShowRules] = useState(false);
  
  const makeChoice = useCallback((playerChoice: Choice) => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const aiChoice = azélieAI(playerChoices);
    const key = `${playerChoice}-${aiChoice}` as keyof typeof PAYOFFS;
    const { player, ai } = PAYOFFS[key];
    
    const result: GameResult = { round, playerChoice, aiChoice, playerScore: player, aiScore: ai };
    
    setTimeout(() => {
      setLastResult(result);
      setPlayerScore(prev => prev + player);
      setAiScore(prev => prev + ai);
      setPlayerChoices(prev => [...prev, playerChoice]);
      
      if (round >= totalRounds) {
        setTimeout(() => setGameState('result'), 1000);
      } else {
        setRound(prev => prev + 1);
      }
      setIsAnimating(false);
    }, 800);
  }, [isAnimating, playerChoices, round, totalRounds]);
  
  const getProfile = (): PlayerProfile => {
    const coopRate = playerChoices.filter(c => c === 'cooperate').length / playerChoices.length;
    let switches = 0;
    for (let i = 1; i < playerChoices.length; i++) {
      if (playerChoices[i] !== playerChoices[i - 1]) switches++;
    }
    if (coopRate > 0.7) return PROFILES.cooperator;
    if (coopRate < 0.3) return PROFILES.defector;
    if (switches >= 3) return PROFILES.strategist;
    return PROFILES.balanced;
  };
  
  const resetGame = () => {
    setGameState('intro');
    setRound(1);
    setPlayerScore(0);
    setAiScore(0);
    setPlayerChoices([]);
    setLastResult(null);
  };
  
  if (!isOpen) return null;
  
  const profile = gameState === 'result' ? getProfile() : null;
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => closeGame()} />
        
        <motion.div
          className={cn(
            'relative w-full max-w-lg rounded-2xl overflow-hidden bg-background-primary border-2',
            mode === 'strategist' ? 'border-accent-primary' : 'border-accent-primary shadow-glow-md'
          )}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-accent-primary/10 border-border-primary">
            <h2 className={cn('text-lg font-bold', mode === 'tech' ? 'font-mono text-accent-primary' : 'font-heading')}>
              {mode === 'strategist' ? '🎮 Le Dilemme du Recruteur' : '> RECRUITER_DILEMMA.exe'}
            </h2>
            <div className="flex gap-2">
              <button onClick={() => setShowRules(!showRules)} className="p-2 rounded-lg hover:bg-background-secondary">
                <HelpCircle size={18} />
              </button>
              <button onClick={() => closeGame()} className="p-2 rounded-lg hover:bg-background-secondary">
                <X size={18} />
              </button>
            </div>
          </div>
          
          {/* Rules */}
          <AnimatePresence>
            {showRules && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="border-b border-border-primary bg-background-secondary/50 overflow-hidden"
              >
                <div className={cn('p-4 text-sm text-foreground-muted', mode === 'tech' && 'font-mono')}>
                  <p className="font-semibold mb-2">📖 Règles:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Coopérer + Coopérer = +3 chacun</li>
                    <li>• Trahir + Coopérer = +5 vs +0</li>
                    <li>• Trahir + Trahir = +1 chacun</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Content */}
          <div className="p-6">
            {gameState === 'intro' && (
              <div className="text-center">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-xl font-semibold mb-4">{mode === 'strategist' ? 'Bienvenue dans le Dilemme' : 'Welcome'}</h3>
                <p className={cn('text-foreground-muted mb-6', mode === 'tech' && 'font-mono text-sm')}>
                  {mode === 'strategist' 
                    ? 'À chaque round, coopérez ou trahissez. Votre profil révélera vos talents !'
                    : '// Each round: cooperate or defect. Your choices reveal your profile.'}
                </p>
                <button
                  onClick={() => setGameState('playing')}
                  className="px-8 py-3 rounded-lg font-semibold bg-accent-primary text-background-primary"
                >
                  {mode === 'strategist' ? 'Commencer' : 'Start'}
                </button>
              </div>
            )}
            
            {gameState === 'playing' && (
              <div>
                <div className="text-center mb-6">
                  <p className={cn('text-sm mb-2 text-foreground-muted', mode === 'tech' && 'font-mono')}>
                    Round {round}/{totalRounds}
                  </p>
                  <div className="flex justify-center gap-12">
                    <div>
                      <div className="text-2xl font-bold">{playerScore}</div>
                      <div className="text-xs text-foreground-muted">Vous</div>
                    </div>
                    <div className="text-foreground-muted">vs</div>
                    <div>
                      <div className="text-2xl font-bold text-accent-primary">{aiScore}</div>
                      <div className="text-xs text-foreground-muted">Azélie</div>
                    </div>
                  </div>
                </div>
                
                {lastResult && (
                  <motion.div
                    className="mb-6 p-3 rounded-lg text-center text-sm bg-background-secondary"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Round {lastResult.round}: 
                    [{lastResult.playerChoice === 'cooperate' ? '🤝' : '⚔️'}] vs 
                    [{lastResult.aiChoice === 'cooperate' ? '🤝' : '⚔️'}]
                    → +{lastResult.playerScore} / +{lastResult.aiScore}
                  </motion.div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    onClick={() => makeChoice('cooperate')}
                    disabled={isAnimating}
                    className={cn(
                      'p-6 rounded-xl border-2 flex flex-col items-center gap-3',
                      'border-green-500/30 hover:border-green-500 hover:bg-green-500/10',
                      isAnimating && 'opacity-50'
                    )}
                    whileHover={!isAnimating ? { scale: 1.05 } : {}}
                  >
                    <Handshake size={40} className="text-green-500" />
                    <span className="font-semibold">{mode === 'strategist' ? 'Coopérer' : 'COOP'}</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => makeChoice('defect')}
                    disabled={isAnimating}
                    className={cn(
                      'p-6 rounded-xl border-2 flex flex-col items-center gap-3',
                      'border-red-500/30 hover:border-red-500 hover:bg-red-500/10',
                      isAnimating && 'opacity-50'
                    )}
                    whileHover={!isAnimating ? { scale: 1.05 } : {}}
                  >
                    <Swords size={40} className="text-red-500" />
                    <span className="font-semibold">{mode === 'strategist' ? 'Trahir' : 'DEFECT'}</span>
                  </motion.button>
                </div>
                
                {isAnimating && (
                  <p className={cn('mt-6 text-center text-sm text-accent-primary', mode === 'tech' && 'font-mono')}>
                    {mode === 'strategist' ? 'Azélie réfléchit...' : '> thinking...'}
                  </p>
                )}
              </div>
            )}
            
            {gameState === 'result' && profile && (
              <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Trophy size={60} className="mx-auto mb-4 text-yellow-500" />
                <h3 className="text-2xl font-bold mb-2">{profile.title[mode]}</h3>
                <p className={cn('text-foreground-muted mb-6', mode === 'tech' && 'font-mono text-sm')}>
                  {profile.description[mode]}
                </p>
                
                <div className="flex justify-center gap-8 text-lg font-bold mb-6 p-4 rounded-lg bg-background-secondary">
                  <div><span>{playerScore}</span><span className="text-xs block">Vous</span></div>
                  <div>vs</div>
                  <div><span className="text-accent-primary">{aiScore}</span><span className="text-xs block">IA</span></div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {profile.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 rounded-full text-sm bg-accent-primary/10 text-accent-primary">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-4 justify-center">
                  <button onClick={resetGame} className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border-primary">
                    <RotateCcw size={18} /> Rejouer
                  </button>
                  <button onClick={() => closeGame()} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-primary text-background-primary">
                    <Sparkles size={18} /> Terminé
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default RecruiterDilemma;
