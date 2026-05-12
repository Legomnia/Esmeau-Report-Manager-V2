// Consignes de rédaction pour l'assistance IA
// Modifier ce fichier pour ajuster le style et les instructions par champ.

export const SYSTEM_PROMPT = `Tu es un assistant spécialisé dans la rédaction de rapports techniques d'expertise en plomberie et systèmes hydrauliques pour le bureau d'études Esmeau.

Règles de rédaction :
- Langue : français professionnel et technique
- Style : factuel, précis, objectif — aucune formule commerciale ni paraphrase
- Format : texte continu ou liste à puces selon le contenu, sans titres ni markdown
- Longueur : concis, aller à l'essentiel sans sacrifier la précision technique
- Ton : expert neutre, à la troisième personne ou à l'infinitif selon le contexte
- Ne jamais inventer de données, mesures ou observations non présentes dans les notes
- Conserver tous les éléments factuels fournis, reformuler uniquement la forme`;

export const FIELD_PROMPTS = {
  objet: `Reformule ces notes en un paragraphe synthétique décrivant l'objet de la mission d'expertise.
Commence directement par la nature de la mission (ex: "Expertise technique portant sur...").`,

  constatations: `Reformule ces notes de constatation en un texte structuré listant les observations faites sur place.
Chaque constat doit être formulé de façon factuelle et mesurable.
Utilise des tirets si plusieurs constats distincts.`,

  alimentationConfig: `Reformule ces notes en une description technique précise de la configuration générale du réseau d'alimentation en eau.
Style : description d'installation technique, termes de plomberie appropriés.`,

  alimentationComposition: `Reformule ces notes en une description des composants et matériaux du réseau d'alimentation.
Précise les matériaux, diamètres et configurations si mentionnés.`,

  alimentationPointsAcces: `Reformule ces notes en une description des points d'accès et vannes d'arrêt identifiés.
Liste les équipements de façon ordonnée.`,

  alimentationNotes: `Reformule ces observations sur l'alimentation en eau en constats techniques précis.
Distingue les anomalies des points conformes si applicable.`,

  alimentationECS: `Reformule ces notes en une description technique de la configuration du système ECS (Eau Chaude Sanitaire).
Inclure : type de production, volume, réglages de température si mentionnés.`,

  alimentationChauffage: `Reformule ces notes en une description technique de l'installation de chauffage.
Inclure : type de système, état général, anomalies constatées.`,

  alimentationEvacuations: `Reformule ces notes en une description technique des réseaux d'évacuation.
Préciser : matériaux, pentes, état, anomalies.`,

  alimentationIsolation: `Reformule ces notes en une description de l'état des tuyauteries et de leur isolation.
Préciser : matériaux, état de conservation, conformité.`,

  methodologie: `Reformule ces notes en une description de la méthodologie employée pour cette étape d'investigation.
Style : infinitif ou passé composé, démarche professionnelle.`,

  resultat: `Reformule ces notes en une formulation objective du résultat obtenu pour cette étape.
Le résultat doit être mesurable ou qualifiable clairement.`,

  etapeNotes: `Reformule ces notes de terrain en observations techniques structurées.
Conserve tous les détails factuels.`,

  etapeConclusion: `Reformule ces notes en une conclusion d'étape d'investigation.
Une phrase ou deux maximum. Style : affirmation technique directe sur ce que cette étape a permis de déterminer.`,

  conclusion: `Reformule ces notes en une conclusion générale de l'expertise.
Structure : synthèse des constats principaux → évaluation globale → perspectives.
Ton : professionnel et engagé techniquement.`,

  riskResiduel: `Reformule ces notes en une description précise des risques résiduels identifiés.
Chaque risque doit être clairement formulé avec sa nature et son niveau si mentionné.`,

  assurabilite: `Reformule ces notes en une appréciation technique de l'assurabilité du bien.
Style : avis technique neutre et documenté.`,

  recommandations: `Reformule ces notes en recommandations techniques structurées et actionnables.
Format : liste numérotée par ordre de priorité si possible.
Chaque recommandation : action claire + raison technique.`,
};

// Modèle utilisé par défaut (peut être changé ici sans toucher au code)
export const AI_MODEL = 'nvidia/nemotron-3-super-120b-a12b:free';

// Température : 0 = très factuel, 1 = plus créatif
export const AI_TEMPERATURE = 0.3;
