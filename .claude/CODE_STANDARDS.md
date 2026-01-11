# 🧹 Normes de Code & Stratégie de Test (QA)

> **Ce document fusionne les directives de nettoyage de code et la stratégie de tests.**

---

## PARTIE 1 : Nettoyage & Refactoring

### 1.1 Élimination du "Dead Code"

*   **Contexts Legacy** : Une fois qu'une Feature est migrée vers TanStack Query/Zustand, le fichier `Context` correspondant dans `src/hooks/contexts/` doit être **supprimé** (pas commenté).
*   **Services Legacy** : Les fichiers `src/services/*.ts` utilisant `fetch` natif doivent être remplacés par des hooks dans `entities/*/api/` et supprimés.
*   **Styles CSS/SCSS** : Migrer les fichiers `.scss` vers des solutions CSS-in-JS (MUI `sx` prop ou `styled()`) ou garder des modules CSS scopés si nécessaire, mais supprimer les fichiers globaux non utilisés.

### 1.2 Standardisation du Code (Conventions)

| Élément | Convention |
|:--------|:-----------|
| Composants | `PascalCase` (ex: `CampaignList.tsx`) |
| Hooks | `camelCase` préfixé par `use` (ex: `useCampaignList.ts`) |
| Fichiers | Correspond au nom de l'export principal |
| Props | Interface TypeScript nommée `Props` ou `ComponentNameProps`. Pas de destructuring profond. |

### 1.3 Simplification des "God Components"

Pour tout composant dépassant 200 lignes (ex: `FsecDetailsPage`) :

1.  **Extraction** : Identifier les blocs logiques (Tableau, Filtres, Modal).
2.  **Relocation** : Déplacer vers `widgets/` ou `features/` selon la réutilisabilité.
3.  **Composition** : Le composant parent ne doit faire que de l'assemblage (Layout).

### 1.4 Refactoring Imports

*   **Barrels (Index.ts)** : Chaque dossier de niveau 1 dans une slice FSD (`ui`, `model`, `api`) doit avoir un `index.ts`.
*   **Interdiction** : Ne jamais importer depuis l'intérieur d'un module privé d'une autre slice.
    *   ❌ `import { Internal } from 'features/auth/ui/InternalComponent'`
    *   ✅ `import { AuthWidget } from 'features/auth'`

### 1.5 Gestion des Erreurs

*   Remplacer les `console.log` ou `alert` par le système de notification global (`Snackbar` via Zustand).
*   Toute interaction API doit être enveloppée dans une gestion d'erreur (via `onError` de TanStack Query ou `try/catch` dans les handlers).

---

## PARTIE 2 : Stratégie de Test

### 2.1 Stack de Test

| Outil | Usage |
|:------|:------|
| **Vitest** | Unit & Integration (plus rapide que Jest, natif Vite) |
| **React Testing Library (RTL)** | Component Testing |
| **Playwright (Futur)** | E2E (hors scope immédiat, mais code préparé pour) |
| **MSW (Mock Service Worker)** | Mocking API pour intercepter les appels TanStack Query |

### 2.2 Niveaux de Test Prioritaires

#### 🟢 Niveau 1 : Domain Entities (Unit)

*   **Cible** : `entities/*/model/*.schema.ts` et `*.utils.ts`.
*   **Quoi tester** :
    *   Les transformateurs Zod (API Input -> Domain Output).
    *   La validation des règles métier (dates, statuts).
*   **Critère** : 100% de couverture sur les mappers.

#### 🟡 Niveau 2 : Features / Hooks (Integration)

*   **Cible** : `hooks/useMyQuery.ts` et `features/*/model/useStore.ts`.
*   **Quoi tester** :
    *   Le succès de la Query (données chargées).
    *   La gestion de l'erreur (Loading state, Error state).
    *   Les mises à jour optimistes (Zustand updates).
*   **Outil** : `renderHook` de RTL + Wrapper QueryClient de test.

#### 🔴 Niveau 3 : Widgets UI (Component)

*   **Cible** : `widgets/` (ex: `FsecTabs`, `CampaignTable`).
*   **Quoi tester** :
    *   Le rendu correct des données (pas de crash si `undefined`).
    *   Les interactions utilisateur (Clic, Saisie).
    *   L'accessibilité (Aria labels présents).
*   **Règle** : Ne pas tester l'implémentation de Material UI (supposée fiable), tester **votre** usage.

### 2.3 Recette de Migration (Checklist QA)

Pour valider qu'une fonctionnalité est migrée "Pixel Perfect" :

- [ ] **Visuel** : Comparer Legacy vs New (Screenshot). Aucune régression visuelle tolérée.
- [ ] **Data** : Vérifier dans Redux DevTools / React Query DevTools que le cache est propre.
- [ ] **Réseau** : Vérifier l'onglet Network. Pas de requêtes en double (double-fetching).
- [ ] **Console** : Aucune erreur React (Keys uniques, DOM nesting validation).

### 2.4 Exemple de Test (Zod Mapper)

```typescript
test('should transform API snake_case to domain camelCase', () => {
  const apiData = { fsec_status: 'VALIDATED', created_at: '2024-01-01' };
  const result = FsecSchema.parse(apiData);
  expect(result).toEqual({ 
    fsecStatus: 'VALIDATED', 
    createdAt: new Date('2024-01-01') 
  });
});
```
