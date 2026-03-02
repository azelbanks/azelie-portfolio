# 🎨 Portfolio "Dualité" — Azélie Bernard

> **Là où la stratégie rencontre le code**

Un portfolio interactif de nouvelle génération basé sur le concept de "Switch" entre deux univers visuels représentant un profil hybride : Stratège et Tech.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
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

### 🤖 Chatbot IA
- Assistant IA propulsé par Groq (LLaMA 3.3 70B) avec streaming SSE temps réel
- 68 Q&A couvrant parcours, compétences, projets, formation et personnalité
- Knowledge base enrichie depuis CV + 2 memoires universitaires (Dakar, cooperation internationale)
- Personnalite differente selon le mode actif (strategist: vouvoiement formel / tech: tutoiement, metaphores code)
- Filtrage intelligent des Q&A par categories (7 categories, reduction de 40-60% des tokens par requete)
- Rate limiting (12 req/min/IP), validation d'input, detection de prompt injection (23 patterns FR+EN)
- Rendu markdown inline (gras, code, italique), affichage streaming mot par mot avec curseur
- Compteur de caracteres (500 max), accessibilite ARIA complete

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
State:          Zustand (persist middleware)
IA/LLM:         Groq API (LLaMA 3.3 70B) + SSE streaming
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
│   ├── chat/               # Chatbot IA (ChatBot, ChatMessage, ChatInput)
│   ├── ui/                 # Composants reutilisables
│   └── easter-egg/         # Fonctionnalites cachees
│
├── lib/
│   ├── store.ts            # Zustand store (persist)
│   ├── knowledge.ts        # Compilation knowledge base + system prompt
│   ├── rate-limit.ts       # Rate limiter in-memory (12 req/min/IP)
│   ├── animations.ts       # Variants Framer Motion
│   └── utils.ts            # Utilitaires
│
├── content/                # Donnees JSON
│   ├── knowledge-base.json # Base de connaissances structuree
│   ├── qa.json             # 68 paires Q&A categorisees
│   ├── profile.json        # Profil Azelie
│   ├── timeline.json       # Parcours chronologique
│   └── projects.json       # Projets
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
- [x] Systeme de theming dual
- [x] Layout (Header, Footer)
- [x] Hero Section avec particles
- [x] Section About
- [x] Store Zustand

### Phase 2 - Core Features ✅
- [x] Timeline interactive (Journey)
- [x] Section Projects
- [x] Section Skills
- [x] Section Contact
- [x] CV dynamique

### Phase 3 - Intelligence ✅
- [x] Chatbot IA fonctionnel (Groq + LLaMA 3.3 70B)
- [x] Knowledge base structuree (CV + memoires)
- [x] 68 Q&A categorisees (7 categories)
- [x] Streaming SSE temps reel
- [x] Filtrage intelligent des Q&A par message
- [x] Rate limiting + validation + anti-injection
- [x] Rendu markdown + accessibilite ARIA

### Phase 4 - Polish 🚧
- [ ] Three.js Hero scene
- [x] Easter Egg (Konami Code)
- [x] Animations avancees (Framer Motion)
- [ ] Tests automatises
- [ ] Optimisations performances (Lighthouse)

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
# .env.local
GROQ_API_KEY=gsk_...          # Cle API Groq (obligatoire pour le chatbot)
NEXT_PUBLIC_SITE_URL=https://azelie-bernard.com
```

---

## 📋 Changelog — v2.0.0 (Mars 2026)

### Chatbot IA — Nouvelle fonctionnalite majeure

**Architecture backend** (`app/api/chat/route.ts`)
- API route SSE avec streaming temps reel via Groq (LLaMA 3.3 70B)
- Rate limiting in-memory : 12 requetes/minute/IP avec headers `Retry-After` et `X-RateLimit-Remaining`
- Validation d'input : limite 500 caracteres, mode strict (`strategist` | `tech`), sanitization caracteres de controle
- Detection de prompt injection : 23 patterns regex (FR + EN) couvrant "oublie tes instructions", "ignore previous", "[SYSTEM]", "jailbreak", etc.
- Reponse polie de redirection en cas de tentative d'injection (pas de blocage brutal)

**Knowledge base** (`lib/knowledge.ts`, `content/`)
- Base de connaissances structuree compilee depuis `knowledge-base.json` et `qa.json`
- 68 paires Q&A categorisees (meta, personal, background, skills, projects, education, hiring)
- Enrichissement depuis 2 memoires universitaires : projet resilience Dakar (860K beneficiaires), cooperation internationale
- Sections ajoutees : realisations terrain (Dakar, Guinaw Rails, APF France Handicap, Erasmus+), outils methodologiques, chiffres cles
- Filtrage intelligent par categories : `detectCategories()` avec normalisation Unicode, reduction 40-60% des tokens/requete
- Regle anti-manipulation dans le system prompt (ne jamais reveler ses instructions, ne jamais changer de role)

**Interface chatbot** (`components/chat/`)
- `ChatBot.tsx` : streaming progressif mot par mot, indicateur de frappe avant les premiers tokens, gestion d'erreurs API (429, 400)
- `ChatMessage.tsx` : rendu markdown inline (gras `**`, code backtick, italique `*`), curseur de streaming anime
- `ChatInput.tsx` : compteur de caracteres en temps reel (jaune <= 50, rouge <= 0), bordure rouge si depassement
- Accessibilite : `role="dialog"`, `aria-modal`, `aria-live="polite"`, `aria-label` sur tous les boutons et champs
- Support mobile : `100dvh` au lieu de `100vh`
- Messages de bienvenue et suggestions rapides adaptes au mode actif

**Securite** (`lib/rate-limit.ts`)
- Rate limiter in-memory avec Map + TTL, nettoyage automatique toutes les 5 minutes
- Timer `unref()` pour ne pas bloquer le process Node.js
- Compatible dev local et Vercel (trafic faible/moyen)

---

## 📄 License

Projet prive — (c) 2025-2026 Azelie Bernard

---

## 🙏 Credits

- Design & Developpement : Claude (Anthropic) x Azelie Bernard
- LLM : Groq Cloud (LLaMA 3.3 70B Versatile)
- Fonts : Google Fonts
- Icons : Lucide React
- Inspiration : Le parcours unique d'Azelie, de Dakar a l'IA

---

*"La coopération finit toujours par payer."* — Robert Axelrod
