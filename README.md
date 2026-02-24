# 🎨 Portfolio "Dualité" — Azélie Bernard

> **Là où la stratégie rencontre le code**

Un portfolio interactif de nouvelle génération basé sur le concept de "Switch" entre deux univers visuels représentant un profil hybride : Stratège et Tech.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![License](https://img.shields.io/badge/license-Private-red)

---

## ✨ Fonctionnalités

### 🔄 Switch Dual Mode
- **Mode Stratège** : Élégance institutionnelle, tons ivoire/or/marine
- **Mode Tech** : Cyberpunk raffiné, noir profond avec accents néon (cyan/magenta)
- Transition fluide entre les deux univers
- Adaptation du contenu et du ton selon le mode

### 🎮 Gamification
- Barre de progression "Vous connaissez Azélie à X%"
- Badges à débloquer en explorant le site
- Easter Egg secret (Konami Code → Dilemme du Recruteur)

### 🤖 Chatbot RAG (À venir)
- Assistant IA entraîné sur CV et mémoires
- Personnalité différente selon le mode actif
- Fonctionnement côté client avec WebLLM

### 📄 CV Dynamique
- Génération PDF différente selon le mode
- Mode Stratège → CV orienté gestion de projet
- Mode Tech → CV orienté data/technique

---

## 🛠 Stack Technique

```
Framework:      Next.js 14 (App Router)
Language:       TypeScript
Styling:        Tailwind CSS + CSS Variables
Animations:     Framer Motion + GSAP
3D/Effects:     tsParticles
State:          Zustand
Fonts:          Playfair Display + DM Sans + JetBrains Mono
```

---

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Setup

```bash
# Cloner le repo
git clone https://github.com/azelie-bernard/portfolio.git
cd portfolio

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build production
npm run build

# Démarrer en production
npm start
```

---

## 📁 Structure du Projet

```
azelie-portfolio/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Page d'accueil
│   ├── globals.css         # Styles globaux + theming
│   └── api/                # API Routes
│
├── components/
│   ├── layout/             # Header, Footer, ModeProvider
│   ├── sections/           # Hero, About, Journey, etc.
│   ├── ui/                 # Composants réutilisables
│   └── easter-egg/         # Fonctionnalités cachées
│
├── lib/
│   ├── store.ts            # Zustand store
│   ├── animations.ts       # Variants Framer Motion
│   ├── utils.ts            # Utilitaires
│   └── rag/                # Système RAG (à venir)
│
├── content/                # Données JSON
│   ├── profile.json
│   ├── timeline.json
│   └── projects.json
│
└── public/                 # Assets statiques
```

---

## 🎨 Système de Theming

Le switch entre les modes utilise des CSS Variables pour une transition fluide :

```css
/* Mode Stratège (défaut) */
:root {
  --bg-primary: #FFFEF9;
  --accent-primary: #C9A962;
  --accent-secondary: #1E3A5F;
}

/* Mode Tech */
[data-mode="tech"] {
  --bg-primary: #05050A;
  --accent-primary: #00F0FF;
  --accent-secondary: #FF00E5;
}
```

---

## 🎯 Roadmap

### Phase 1 - MVP ✅
- [x] Setup Next.js + Tailwind
- [x] Système de theming dual
- [x] Layout (Header, Footer)
- [x] Hero Section avec particles
- [x] Section About
- [x] Store Zustand

### Phase 2 - Core Features 🚧
- [ ] Timeline interactive (Journey)
- [ ] Section Projects
- [ ] Section Skills (Radar chart)
- [ ] Section Contact
- [ ] CV dynamique

### Phase 3 - Intelligence
- [ ] WebLLM integration
- [ ] Système RAG
- [ ] Chatbot fonctionnel

### Phase 4 - Polish
- [ ] Three.js Hero scene
- [ ] Easter Egg complet
- [ ] Animations avancées
- [ ] Tests & optimisations

---

## 🔐 Easter Egg

Tape le Konami Code (↑↑↓↓←→←→BA) pour débloquer le **Dilemme du Recruteur** — un mini-jeu basé sur la théorie des jeux !

---

## 📝 Scripts Disponibles

```bash
npm run dev          # Développement avec hot reload
npm run build        # Build production
npm run start        # Serveur production
npm run lint         # ESLint
npm run type-check   # Vérification TypeScript
```

---

## 🌐 Déploiement

### Vercel (Recommandé)

1. Connecter le repo GitHub à Vercel
2. Les déploiements sont automatiques sur chaque push

### Variables d'environnement

```env
# .env.local (si nécessaire)
NEXT_PUBLIC_SITE_URL=https://azelie-bernard.com
```

---

## 📄 License

Projet privé — © 2025 Azélie Bernard

---

## 🙏 Crédits

- Design & Développement : Claude (Anthropic) × Azélie Bernard
- Fonts : Google Fonts
- Icons : Lucide React
- Inspiration : Le parcours unique d'Azélie, de Dakar à l'IA

---

*"La coopération finit toujours par payer."* — Robert Axelrod
