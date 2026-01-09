# 🤖 Directives IA - Comportement et Garde-Fous

> **Ce document fusionne les règles anti-hallucination et le protocole de démarrage du développement.**

---

## 📥 1. Ingestion du Contexte (Ordre de Lecture)

Avant d'écrire la moindre ligne de code, tu dois lire et assimiler les fichiers suivants dans le dossier `.claude/` :

1.  `ARCHITECTURE.md` (Tes standards techniques Backend + Frontend)
2.  `MIGRATION_PLAN.md` (Ton plan de travail spécifique - mappings APIs, dossiers, clés de query)
3.  `CODE_STANDARDS.md` (Tes normes de refactoring et de tests)
4.  `DATA_MODEL.md` (Référence données - consulter si besoin)

### ⛔ Exclusions Explicites

Pas besoin de relire ces fichiers s'ils sont présents, ils sont déjà fusionnés ou obsolètes :
*   ❌ `AI_PROMPT.md` → fusionné dans `ARCHITECTURE.md`
*   ❌ `Technical_Architecture_Reference.md` → fusionné dans `ARCHITECTURE.md`
*   ❌ `Anti_Hallucination_Rules.md` → fusionné dans ce fichier
*   ❌ `Context_Manifest.md` → obsolète

---

## 🚫 2. Règles Anti-Hallucinations

### 2.1 Règle du "Backend First" (Source de Vérité)

**Ne jamais inventer d'endpoint API.**

*   **Vérification Obligatoire** : Avant de créer un hook TanStack Query, consulter impérativement :
    *   `cible/api/urls.py` (Liste des routes).
    *   Le contrôleur associé (ex: `cible/api/fsec/fsec_controller.py`) pour confirmer les paramètres requis (UUID, Query Params) et le format de réponse.
*   **Interdiction** : Ne pas supposer qu'une route existe parce qu'elle existait dans le Legacy. Le Backend a changé.

### 2.2 Règle du "Zero Magic String" (Typage Strict)

**Ne jamais utiliser de types `any` ou d'objets non validés.**

*   **Schémas Zod** : Toute donnée entrante doit être validée par un schéma Zod défini dans `entities/*/model/*.schema.ts`.
*   **Mapping Explicite** : Si le Backend renvoie `snake_case` et le Front attend `camelCase`, le transformateur Zod est **obligatoire**. Ne pas "espérer" que ça matche.

### 2.3 Règle de l'Existant (File System Check)

**Ne pas importer de fichiers imaginaires.**

*   Avant de faire un `import { Button } from '@shared/ui/Button'`, vérifier que le composant a bien été migré ou créé.
*   Si un utilitaire manque (ex: date formatter), le créer explicitement dans `shared/lib` avant de l'utiliser.

### 2.4 Règle de la Migration (Legacy vs Target)

**Ne pas mélanger les paradigmes.**

*   Si vous travaillez sur une Feature FSD (dossier `features/`), **interdiction absolue** d'importer un `Context` Legacy (`src/hooks/contexts/`).
*   L'état doit venir soit de **TanStack Query** (Server), soit de **Zustand** (Client).

---

## ⚠️ 3. Clause de Non-Hallucination ("Ask First")

**Règle d'or : Le doute bénéficie à l'utilisateur.**

Si tu rencontres une ambiguïté (ex: un champ manquant dans l'API, une incohérence entre la maquette et le code, une règle métier floue) :

*   **NE FAIS PAS** : Ne prends pas de décision arbitraire pour "avancer".
*   **FAIS** : Arrête-toi et pose la question explicitement à l'utilisateur.

> *"Je préfère attendre ta confirmation plutôt que de devoir refaire le code plus tard."*

---

## 🚑 4. Protocole de Correction

Si une incohérence est détectée (ex: le Backend demande un champ que le Front n'a pas) :

1.  **Stop**. Ne pas inventer de valeur par défaut.
2.  **Analyser** le code Python du contrôleur.
3.  **Proposer** une mise à jour du schéma Zod ou demander une clarification à l'utilisateur.

---

## 🔍 5. Recherche de Code avec mgrep

**mgrep est ton outil principal pour explorer le codebase.** Il te donne la réponse en langage naturel + la source pertinente, tout servi.

### Commande de base

```bash
mgrep "ta question en langage naturel" --store "spectre" -a -m <nombre>
```

### Paramètres essentiels

| Paramètre | Description |
|-----------|-------------|
| `--store "spectre"` | **Obligatoire** - le store indexé du projet |
| `-a` | Active la réponse en langage naturel |
| `-m <n>` | Nombre de résultats du retrieval (minimum 10) |

### Ajuster `-m` selon la complexité

| Type de requête | `-m` recommandé |
|-----------------|-----------------|
| Question simple (1-2 fichiers) | 10 |
| Question moyenne (flow, feature) | 20-30 |
| Question complexe (debug, architecture) | 30-50 |

### Stratégie pour requêtes complexes

Si la requête touche **plusieurs parties du codebase**, lance plusieurs mgrep en parallèle plutôt qu'une seule requête surchargée :

```bash
# Exemple : comprendre le système d'auth complet
mgrep "comment fonctionne l'authentification LinkedIn côté frontend" --store "spectre" -a -m 20
mgrep "comment le token LinkedIn est géré côté Convex" --store "spectre" -a -m 20
mgrep "comment le background script gère les sessions" --store "spectre" -a -m 20
```

### Règles

- **OBLIGATOIRE** : Utilise mgrep pour TOUTE recherche de code. N'utilise JAMAIS grep, Grep tool, ou Glob pour chercher du code.
- **Langage naturel** : mgrep est un agent IA comme toi. Parle-lui comme à un collègue, pas comme à un moteur de recherche.
  - ❌ `"architecture block icon color complete status"` (mots-clés robotiques)
  - ✅ `"Quelle est la couleur de l'icône des blocs d'architecture quand ils sont complétés ?"` (question naturelle)

### Note pour les Subagents

**Les subagents n'héritent PAS des instructions de ce fichier.**

Quand tu lances un subagent Explore, copie-colle les instructions sur mgrep de cette section dans le prompt du subagent.

---

## 🏁 6. Démarrage d'une Session

Une fois le contexte chargé, tes premières actions doivent être :

1.  Vérifier l'état actuel du repo (`git status`).
2.  Identifier la prochaine tâche dans `MIGRATION_PLAN.md`.
3.  Proposer un plan d'action pour cette tâche spécifique.
