# 🏛️ Architecture Technique - Backend & Frontend

> **Ce document combine les règles d'architecture pour le Backend (Hexagonal/Clean) et le Frontend (FSD/React).**

---

## 🚀 OBJECTIFS CLÉS : Ultra-Performance, Maintenabilité & Réactivité

> [!IMPORTANT]
> Cette application doit être **ultra-performante**, **super réactive** et **très maintenable**. Chaque décision technique doit servir ces trois objectifs.

### Principes Non-Négociables

| Objectif | Règles |
|:---------|:-------|
| **⚡ Ultra-Performance** | Lazy loading systématique. Code splitting par route. Bundle < 200KB initial. Pas de dépendances lourdes inutiles. |
| **🔄 Réactivité** | UI jamais bloquée > 16ms. `useTransition` pour les opérations lourdes. Optimistic updates sur toutes les mutations. Skeleton loaders, pas de spinners bloquants. |
| **🧱 Maintenabilité** | Clean Architecture stricte. Tests obligatoires sur les mappers. Typage à 100% (zéro `any`). Composants < 200 lignes. |

### Checklist Performance (à valider pour chaque feature)

- [ ] **First Contentful Paint (FCP)** < 1.5s
- [ ] **Time to Interactive (TTI)** < 3s
- [ ] **Pas de re-render inutile** (vérifier avec React DevTools Profiler)
- [ ] **Pas de requêtes N+1** côté Backend (utiliser `select_related`, `prefetch_related`)
- [ ] **Cache TanStack Query** configuré avec `staleTime` approprié
- [ ] **Images optimisées** (WebP, lazy loading natif)

### Anti-Patterns à Éviter Absolument

| ❌ Interdit | ✅ Alternative |
|:-----------|:--------------|
| `useEffect` pour fetch de données | TanStack Query (`useQuery`) |
| Props drilling > 2 niveaux | Zustand store ou Context dédié |
| `any` en TypeScript | Types stricts avec Zod inference |
| Composants > 200 lignes | Extraction en widgets/features |
| `console.log` en production | Logger conditionnel ou suppression |
| Re-render de listes entières | `React.memo` + keys stables |
| Import de librairies entières | Tree-shaking (`import { Button } from '@mui/material'`) |

---

## 📐 PARTIE 1 : Backend (Django - Clean Architecture)

### 1.1 Pattern Architectural

**Architecture Pattern** : Strict Clean Architecture (Hexagonal).

**Flow** : `API (Controller) → Domain (Service) → Repository (Interface) → Persistence (Repository Impl) → DB (Django ORM)`.

**Golden Rule** : Inner layers (Domain) MUST NOT know about outer layers (API, Django ORM).

### 1.2 Structure des Dossiers

| Dossier | Contenu |
|:--------|:--------|
| `cible/api/{domain}/` | Controllers (Input/Output management only) |
| `cible/domain/{domain}/services/` | Pure Business Logic |
| `cible/domain/{domain}/interface/` | Repository Interfaces (Abstract) |
| `cible/domain/{domain}/models/` | Beans/DTOs (Data Classes, NO Django models) |
| `cible/repository/{domain}/models/` | Django ORM Entities (DB Tables) |
| `cible/repository/{domain}/repositories/` | Implementation of Interfaces using ORM |
| `cible/mapper/{domain}/` | 4 functions (Entity↔Bean, API↔Bean) |

### 1.3 Règles Strictes Backend

| Couche | Règle |
|:-------|:------|
| **Controllers** | NEVER contain business logic. ONLY call Services. NEVER use Django Models directly. |
| **Services** | Pure Python. NEVER import django.db.models. Manipulate Beans only. |
| **Repositories** | Return Beans, NOT Entities. Must map data before returning. |
| **Naming** | `_controller.py`, `_service.py`, `_repository.py`, `_bean.py`, `_mapper.py`. |
| **Database** | Table names in UPPERCASE. |

### 1.4 Templates de Code Backend

#### Entity (DB) - `repository/{domain}/models/`
```python
import uuid
from django.db import models

class ProductEntity(models.Model):
    class Meta:
        app_label = "cible"; db_table = "PRODUCT"
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=50)
```

#### Bean (Domain DTO) - `domain/{domain}/models/`
```python
from dataclasses import dataclass
from decimal import Decimal

@dataclass
class ProductBean:
    uuid: str
    code: str
    price: Decimal = Decimal("0")
```

#### Interface - `domain/{domain}/interface/`
```python
import abc

class IProductRepository(abc.ABC):
    @abc.abstractmethod
    def create(self, item: ProductBean) -> ProductBean:
        raise NotImplementedError
```

#### Repository Impl - `repository/{domain}/repositories/`
```python
from django.db import transaction

class ProductRepository(IProductRepository):
    @transaction.atomic
    def create(self, bean: ProductBean) -> ProductBean:
        entity = product_mapper_bean_to_entity(bean)
        entity.save()
        return product_mapper_entity_to_bean(entity)
```

#### Mapper - `mapper/{domain}/`
```python
# MUST implement: entity_to_bean, bean_to_entity, api_to_bean
def product_mapper_entity_to_bean(entity: ProductEntity) -> ProductBean:
    return ProductBean(uuid=str(entity.uuid), code=entity.code)
```

#### Service - `domain/{domain}/services/`
```python
def create_product(repository: IProductRepository, bean: ProductBean) -> ProductBean:
    if repository.exists_by_code(bean.code): raise ConflictException("code", bean.code)
    return repository.create(bean)
```

#### Controller - `api/{domain}/`
```python
from rest_framework.viewsets import ViewSet
from django.http import JsonResponse

class ProductController(ViewSet):
    @action(detail=False, methods=["post"])
    def create(self, request):
        bean = product_mapper_api_to_bean(request.data)
        result = create_product(ProductRepository(), bean)
        return JsonResponse(result, safe=False, encoder=Encoder)
```

---

## 📐 PARTIE 2 : Frontend (React - Feature-Sliced Design)

### 2.1 Principes Architecturaux

*   **Feature-Based Organization** : Structure modulaire stricte (`src/features/`) fonctionnant comme des micro-applications.
*   **Structure par Feature** :
    *   `api/` : Requêtes TanStack Query, DTOs.
    *   `assets/` : Ressources locales.
    *   `components/` : UI atomique scopée.
    *   `hooks/` : Logique métier et state complexe.
    *   `store/` : Slices Zustand locaux.
    *   `types/` : Interfaces TS + Schémas Zod.
*   **Encapsulation** : Interfaces publiques via `index.ts` (Barrel files).
*   **Imports Absolus** : Usage de `@features/` via `tsconfig.json`.
*   **Separation of Concerns** : Pattern Container/Presentational moderne (Hooks pour la logique, Composants pour le rendu pur).

### 2.2 React 18 & Performance (CRITIQUE)

> [!CAUTION]
> La réactivité de l'UI est une priorité absolue. Aucune interaction ne doit bloquer le thread principal > 16ms.

#### Techniques de Performance Obligatoires

| Technique | Quand l'utiliser | Exemple |
|:----------|:-----------------|:--------|
| `useTransition` | Updates lourds (filtrage, changement d'onglet) | `const [isPending, startTransition] = useTransition()` |
| `useDeferredValue` | Inputs avec recherche live | `const deferredSearch = useDeferredValue(searchTerm)` |
| `React.memo` | Composants enfants purs recevant des props stables | `export default React.memo(MyComponent)` |
| `useMemo` | Calculs coûteux (tri, filtrage de listes) | `const sorted = useMemo(() => items.sort(...), [items])` |
| `useCallback` | Fonctions passées en props à des composants mémorisés | `const handleClick = useCallback(() => {...}, [deps])` |
| `Suspense` + `lazy` | Code splitting par route/composant lourd | `const Modal = lazy(() => import('./Modal'))` |

#### Règles de Rendering

*   **Automatic Batching** : React 18 batch automatiquement → profitez-en, pas de `flushSync` inutile.
*   **Concurrent Rendering** : Utilisez `startTransition` pour les updates non-urgentes.
*   **Skeleton > Spinner** : Afficher la structure de la page immédiatement, charger les données ensuite.
*   **Optimistic Updates** : Mettre à jour l'UI avant la confirmation serveur (`onMutate` de TanStack Query).

### 2.3 Design System (MUI "Apple-Like")

*   **Thématisation (`createTheme`)** :
    *   **Typographie** : Font `Inter` ou System (`-apple-system`). Échelle stricte, `htmlFontSize: 16`.
    *   **Espacement** : Grille de 8px stricte (`theme.spacing()`). Aucune valeur en dur. Stack > Marges manuelles.
    *   **Glassmorphism** : `backdrop-filter: blur()`, opacité 0.7-0.85, bordures subtiles. Support Dark Mode via `theme.applyStyles`.
    *   **Ombres** : Douces et diffuses (custom `theme.shadows`).

### 2.4 Gestion d'État (Server vs Client)

| Type | Outil | Usage |
|:-----|:------|:------|
| **Server State** | TanStack Query v5 | Cache géré, auto-retry, invalidation intelligente. Optimistic Updates (`onMutate`). |
| **Client State** | Zustand | État global minimaliste (Session, UI preferences). Sélecteurs pour éviter les re-renders. |

### 2.5 Sécurité & Données (Zod + TypeScript)

*   **Validation Runtime (Zero Trust)** : Validation des réponses API via Zod (dans les fetchers). Transformation API (snake_case) -> Domain (camelCase) automatique.
*   **Inférence** : `z.infer<typeof schema>` pour une source de vérité unique.
*   **Formulaires** : React Hook Form + Zod Resolver.
*   **TypeScript Strict** : `noImplicitAny`, `strictNullChecks`.

### 2.6 Tooling

*   **Build** : Vite (HMR rapide).
*   **Linting/Formatting** : ESLint Flat Config + Plugin TanStack Query + Prettier.
