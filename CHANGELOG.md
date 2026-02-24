# Portfolio Dualité — Azélie Bernard

## Documentation du projet

**URL en production** : https://azelie-portfolio.vercel.app
**Repository GitHub** : https://github.com/azelbanks/azelie-portfolio
**Stack** : Next.js 14 / TypeScript / Tailwind CSS / Framer Motion / Zustand

---

## Modifications effectuées — 24 février 2026

### 1. Easter Egg — Code Konami

**Problème** : Le composant `KonamiListener` n'était pas rendu dans la page, et ne fonctionnait pas sur clavier AZERTY.

**Corrections** :
- Import et rendu de `KonamiListener` dans `app/page.tsx`
- Remplacement de `event.code` par `event.key` dans `KonamiListener.tsx` pour supporter tous les claviers (AZERTY, QWERTY, etc.)
- Suppression du blocage `if (easterEggUnlocked) return` pour permettre de relancer le jeu
- Ajout de `openEasterEggGame` / `closeEasterEggGame` dans le store Zustand pour gérer l'ouverture/fermeture sans boucle infinie

**Fichiers modifiés** :
- `app/page.tsx`
- `components/easter-egg/KonamiListener.tsx`
- `components/easter-egg/RecruiterDilemma/index.tsx`
- `lib/store.ts`

---

### 2. Erreur d'hydratation Next.js / Zustand

**Problème** : Mismatch entre la valeur serveur (progress = 5%) et la valeur client (progress = 100% depuis localStorage), causant une erreur "Text content does not match server-rendered HTML".

**Correction** : Ajout d'un pattern `useState(false)` + `useEffect(() => setMounted(true))` dans les composants qui affichent des valeurs persistées. Les valeurs du store ne sont rendues qu'après l'hydratation côté client.

**Fichiers modifiés** :
- `components/ui/ProgressBar.tsx` (ProgressBar + CircularProgress)
- `components/sections/Contact/index.tsx`

---

### 3. Formulaire de contact — EmailJS

**Problème** : Le formulaire simulait l'envoi avec un `setTimeout`, aucun email n'était réellement envoyé.

**Correction** : Intégration d'EmailJS avec :
- Envoi du message principal (template `template_5sezs0v`)
- Envoi d'un auto-reply au visiteur (template `template_om5eizp`)
- Champ honeypot invisible anti-bot
- Variables d'environnement configurées dans `.env.local` et Vercel

**Configuration EmailJS** :
- Service ID : `service_fn3obz8`
- Public Key : `beTbEGyDH3Qm2Cpqg`
- Template Contact : `template_5sezs0v`
- Template Auto-Reply : `template_om5eizp`

**Fichiers modifiés** :
- `components/sections/Contact/index.tsx`
- `.env.local` (non commité, configuré aussi sur Vercel)
- `package.json` (ajout `@emailjs/browser`)

---

### 4. Favicon

**Problème** : Aucun fichier favicon, `apple-touch-icon.png` en 404 dans la console.

**Correction** : Création d'un `favicon.svg` avec les initiales "AB" aux couleurs du portfolio. Mise à jour du `layout.tsx` pour pointer vers le SVG.

**Fichiers modifiés** :
- `public/favicon.svg` (nouveau)
- `app/layout.tsx`

---

### 5. Liens CV dans le Header

**Problème** : Les liens CV pointaient vers `/cv/strategist` et `/cv/tech` qui n'existent pas. Noms de fichiers incohérents avec le composant Contact.

**Correction** : Alignement sur les noms corrects :
- Mode Stratège : `/cv/CV_Azelie_Bernard_Chef_de_Projet.pdf`
- Mode Tech : `/cv/CV_Azelie_Bernard_Data_IA.pdf`

**Fichiers modifiés** :
- `components/layout/Header.tsx`

---

### 6. Harmonisation des URLs

**Problème** : LinkedIn, email et Streamlit avaient des URLs différentes selon les fichiers.

**Corrections** :
- LinkedIn → `https://www.linkedin.com/in/azélie-bernard` partout
- Email → `mailto:azeliebernard@gmail.com` partout
- Streamlit → `https://dilemme-du-prisonnier.streamlit.app` partout

**Fichiers modifiés** :
- `components/sections/Contact/index.tsx`
- `content/projects.json`
- `content/knowledge-base.json`
- `content/qa.json`

---

### 7. Accessibilité (aria-labels)

**Correction** : Ajout d'`aria-label` sur les éléments interactifs principaux :
- Bouton chatbot dans le Header
- Bouton fermeture du menu mobile
- Liens de téléchargement CV (Header desktop + mobile)
- Bouton téléchargement CV dans Contact

**Fichiers modifiés** :
- `components/layout/Header.tsx`
- `components/sections/Contact/index.tsx`

---

### 8. Fix build Vercel — tsparticles

**Problème** : La prop `init` n'existe pas dans `@tsparticles/react` v3, causant une erreur TypeScript au build.

**Correction** : Remplacement par `initParticlesEngine()` dans un `useEffect`, conformément à l'API v3.

**Fichiers modifiés** :
- `components/sections/Hero/ParticleField.tsx`

---

### 9. Fix build Vercel — Timeline type casting

**Problème** : Le champ `type` importé depuis le JSON est inféré comme `string` au lieu de `"education" | "experience"`.

**Correction** : Cast explicite `as TimelineItem[]` lors de la combinaison des données.

**Fichiers modifiés** :
- `components/sections/Journey/index.tsx`

---

### 10. Déploiement

- Repository créé sur GitHub : `azelbanks/azelie-portfolio`
- Déployé sur Vercel : https://azelie-portfolio.vercel.app
- Variables d'environnement configurées sur Vercel (Groq + EmailJS)
- Déploiement automatique à chaque push sur `main`

---

## Ce qui reste à faire

### Priorité haute

- [ ] **Déposer les 2 CVs PDF** dans `public/cv/` :
  - `CV_Azelie_Bernard_Chef_de_Projet.pdf`
  - `CV_Azelie_Bernard_Data_IA.pdf`
- [ ] **Ajouter la photo de profil** dans la section About (remplacer le placeholder "AB")
- [ ] **Ajouter le domaine Vercel dans EmailJS** : aller dans EmailJS → Account → Security → Domain Restriction → ajouter `azelie-portfolio.vercel.app`

### Priorité moyenne

- [ ] **Créer une image Open Graph** (1200x630px) pour le partage LinkedIn/Twitter, la placer dans `public/og-image.png`
- [ ] **Domaine personnalisé** : acheter `azelie-bernard.com` (ou similaire) et le configurer sur Vercel
- [ ] **Tester sur mobile** : vérifier toutes les sections sur iPhone/Android
- [ ] **Configurer la clé API Groq** : vérifier que le chatbot fonctionne en production

### Priorité basse

- [ ] Ajouter plus d'aria-labels et tester avec un lecteur d'écran
- [ ] Ajouter un tracking analytics (Vercel Analytics ou Plausible)
- [ ] Optimiser les performances (lazy loading des composants lourds : Three.js, tsParticles)
- [ ] Ajouter une section blog/articles (optionnel)
- [ ] Remplacer `console.error` par un service de monitoring (Sentry) pour la production

---

## Structure des variables d'environnement

```env
# Groq - Chatbot IA
GROQ_API_KEY=your_groq_api_key

# EmailJS - Formulaire de contact
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_fn3obz8
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_5sezs0v
NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID=template_om5eizp
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=beTbEGyDH3Qm2Cpqg
```
