import kb from '@/content/knowledge-base.json';
import qaData from '@/content/qa.json';
import type { Mode } from '@/lib/store';

function compileIdentity(): string {
  const id = kb.identity;
  const langues = id.langues
    .map((l) => `${l.langue} (${l.niveau})`)
    .join(', ');

  return `## IDENTITÉ
Nom complet: ${id.nom_complet}
Âge: ${id.age} ans
Localisation: ${id.localisation}
Nationalité: ${id.nationalite}
Email: ${id.email}
LinkedIn: ${id.linkedin}
GitHub: ${id.github}
Langues: ${langues}
Tagline: "${id.tagline}"

## RÉSUMÉ DU PROFIL
${id.resume_profil}`;
}

function compileFormation(): string {
  const formations = kb.formation
    .map((f) =>
      `- ${f.diplome} | ${f.etablissement}, ${f.ville} (${f.periode})${f.statut ? ' — ' + f.statut : ''}
  Contenu: ${f.contenu}${f.objectif ? '\n  Objectif: ' + f.objectif : ''}`
    )
    .join('\n');

  return `## FORMATION
${formations}`;
}

function compileExperiences(): string {
  const exps = kb.experiences
    .map((e) => {
      const realisations = e.realisations.map((r) => `  - ${r}`).join('\n');
      return `### ${e.poste}
Entreprise: ${e.entreprise}
Lieu: ${e.lieu}
Période: ${e.periode} (${e.duree})${e.en_cours ? ' — EN COURS' : ''}
Description: ${e.description}
Réalisations:
${realisations}
Compétences: ${e.competences.join(', ')}`;
    })
    .join('\n\n');

  return `## EXPÉRIENCES PROFESSIONNELLES
${exps}`;
}

function compileCompetences(): string {
  const c = kb.competences;
  return `## COMPÉTENCES
### Techniques
${c.techniques.map((t) => `- ${t}`).join('\n')}

### Métier
${c.metier.map((m) => `- ${m}`).join('\n')}

### Soft skills
${c.soft_skills.map((s) => `- ${s}`).join('\n')}

### Outils
${c.outils.join(', ')}`;
}

function compileProjets(): string {
  const projets = kb.projets
    .map((p) => {
      const liens = [
        p.lien ? `Lien: ${p.lien}` : '',
        p.github ? `GitHub: ${p.github}` : '',
      ].filter(Boolean).join(' | ');
      return `### ${p.nom} (${p.type})
Stack: ${p.stack}
${p.description}
Points forts: ${p.points_forts.join(' | ')}
${liens}`;
    })
    .join('\n\n');

  return `## PROJETS
${projets}`;
}

function compileChiffres(): string {
  const c = kb.chiffres_cles;
  return `## CHIFFRES CLÉS
- Années d'expérience: ${c.annees_experience}
- Pays d'intervention: ${c.pays_intervention}
- Partenaires gérés: ${c.partenaires_geres}
- Budgets pilotés: ${c.budgets_pilotes}
- Projets Erasmus+ accompagnés: ${c.projets_erasmus_accompagnes}
- Personnes accompagnées (APF): ${c.personnes_accompagnees_apf}
- Équipe max managée: ${c.equipe_max_managee}
- Précision classificateur NLP: ${c.precision_classificateur_nlp}
- Réduction temps data cleaning: ${c.reduction_temps_data_cleaning}`;
}

function compileRecherche(): string {
  const r = kb.recherche_emploi;
  return `## RECHERCHE D'EMPLOI
Type: ${r.type}
Période: ${r.debut} — ${r.fin}
Postes visés: ${r.postes_vises.join(', ')}
Secteurs d'intérêt: ${r.secteurs_interet.join(', ')}
Localisation souhaitée: ${r.localisation_souhaitee}
Disponibilité: ${r.disponibilite}
Valeur ajoutée: ${r.valeur_ajoutee}`;
}

function compileQA(mode: Mode): string {
  const modeKey = mode === 'strategist' ? 'strategist' : 'tech';
  const pairs = qaData.qa
    .map((qa: { question: string; answer: { strategist: string; tech: string } }) =>
      `Q: ${qa.question}\nRéponse à donner: ${qa.answer[modeKey]}`
    )
    .join('\n\n');

  return `## QUESTIONS-RÉPONSES PRÉPARÉES
Quand une question correspond à l'une de celles ci-dessous, utilise la réponse fournie comme base:

${pairs}`;
}

function compilePortfolio(): string {
  const p = kb.a_propos_du_portfolio;
  return `## À PROPOS DE CE PORTFOLIO
Concept: ${p.concept}
Mode Stratège: ${p.mode_stratege}
Mode Tech: ${p.mode_tech}
Gamification: ${p.gamification}
Easter Egg: ${p.easter_egg}
Chatbot: ${p.chatbot}
Stack technique: ${p.stack}`;
}

export function buildSystemPrompt(mode: Mode): string {
  const identity = compileIdentity();
  const formation = compileFormation();
  const experiences = compileExperiences();
  const competences = compileCompetences();
  const projets = compileProjets();
  const chiffres = compileChiffres();
  const recherche = compileRecherche();
  const portfolio = compilePortfolio();
  const qa = compileQA(mode);

  const personalityInstructions = mode === 'strategist'
    ? `RÔLE: Tu es l'assistante virtuelle du portfolio d'Azélie Bernard, en mode "Stratège".
PERSONNALITÉ: Professionnelle, chaleureuse, structurée. Tu vouvoies le visiteur.
STYLE: Phrases complètes et élégantes, vocabulaire précis. Ton institutionnel et bienveillant.
FORMAT: Réponses de 2 à 5 phrases. Utilise le gras **comme ceci** pour les points clés.`
    : `RÔLE: Tu es l'assistante virtuelle du portfolio d'Azélie Bernard, en mode "Tech".
PERSONNALITÉ: Décontractée, technique, joueuse. Tu tutoies le visiteur.
STYLE: Phrases courtes, jargon tech assumé, métaphores de programmation.
FORMAT: Réponses de 2 à 5 phrases. Utilise des \`backticks\` pour les termes techniques.`;

  return `${personalityInstructions}

=== RÈGLES ABSOLUES ===

1. LANGUE: Réponds TOUJOURS en français correct avec les accents (é, è, ê, à, ù, ç), sauf si le visiteur écrit en anglais.
2. EXACTITUDE: Utilise UNIQUEMENT les informations de la BASE DE CONNAISSANCES ci-dessous. Ne complète JAMAIS avec des informations inventées ou supposées.
3. SI TU NE SAIS PAS: Dis "Je n'ai pas cette information" plutôt que d'inventer quoi que ce soit.
4. PERSONNE: Parle d'Azélie à la troisième personne ("Azélie", "elle"). Tu n'es PAS Azélie.
5. HORS SUJET: Redirige poliment vers le profil d'Azélie.
6. DATES ET CHIFFRES: Cite-les EXACTEMENT comme dans la base. Ne les modifie jamais.
7. Q&A: Si une question correspond à une Q&A préparée, utilise cette réponse comme base fidèlement.
8. CONCISION: Réponds en 2 à 5 phrases. Pas de pavés sauf si on te demande des détails.

=== BASE DE CONNAISSANCES COMPLÈTE SUR AZÉLIE BERNARD ===

${identity}

${chiffres}

${formation}

${experiences}

${competences}

${projets}

${recherche}

${portfolio}

${qa}

=== FIN DE LA BASE DE CONNAISSANCES ===

RAPPEL: Français correct avec accents. Fidèle aux données ci-dessus. N'invente rien.`;
}
