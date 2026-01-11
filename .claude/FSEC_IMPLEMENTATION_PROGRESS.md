# 📋 FSEC Sans Gaz - Suivi d'Implémentation

**Date de création** : 2026-01-11
**Modèle de référence** : `/home/baptiste-rossi/Desktop/Perso2-main./Perso2-main/.claude/fsec_sans_gaz_model.mermaid` (FAIT FOI)
**Architecture cible** : Clean Architecture 4 couches (API → Domain → Mapper → Repository)

---

## 🎯 Objectif Global

Adapter les modèles FSEC du nouveau dossier `cible` pour qu'ils correspondent STRICTEMENT au modèle Mermaid de référence, en suivant l'architecture de l'ancien BACK mais avec la nouvelle structure 4 couches.

**Scope** : Uniquement workflow Sans Gaz (8 steps)

---

## ✅ Phase 1 : Préparation - TERMINÉE

### Actions réalisées

1. **Structure répertoires créée** ✅
   ```
   cible/
   ├── repository/referential/models/
   ├── repository/referential/repositories/
   ├── domain/referential/models/
   ├── domain/referential/interface/
   ├── mapper/referential/
   └── api/referential/
   ```

2. **Backup complet effectué** ✅
   - Localisation : `/home/baptiste-rossi/Desktop/Perso2-main./Perso2-main/cible/.backup/`
   - Contenu : fsec/, domain/fsec/, mapper/fsec/, api/fsec/

3. **Fichiers de constantes créés** ✅
   - `/home/baptiste-rossi/Desktop/Perso2-main./Perso2-main/cible/domain/fsec/constants.py`
     - `WORKFLOW_SANS_GAZ` : Liste des 8 steps
     - `REQUIRED_ROLES` : Rôles requis par step
     - `REQUIRED_SUBTYPES_DOCS` : Documents requis par step
     - Constantes de statuts

   - `/home/baptiste-rossi/Desktop/Perso2-main./Perso2-main/cible/domain/fsec/types.py`
     - Enums : `StepStatus`, `FsecStatus`, `WorkflowStep`
     - Type aliases

4. **Template référentiel Campaign créé** ✅
   - Entity : `repository/referential/models/campaign_entity.py`
   - Bean : `domain/referential/models/campaign_bean.py`
   - Interface : `domain/referential/interface/campaign_repository.py`
   - Repository : `repository/referential/repositories/campaign_repository.py`
   - Mapper : `mapper/referential/campaign_mapper.py` (4 fonctions)

---

## 📊 État Actuel du Système

### Modèles EXISTANTS (à compléter)

#### FSEC Principal
- ✅ **FsecEntity** existe avec versioning (`version_uuid` + `fsec_uuid`)
- ⚠️ Manque certains champs vs Mermaid (voir section "Écarts" ci-dessous)
- Localisation : `cible/repository/fsec/models/fsec_entity.py`

#### Steps Sans Gaz (8 steps)
Tous les steps EXISTENT déjà mais sont **INCOMPLETS** :

| Step | Entity | Bean | Mapper | Status |
|------|--------|------|--------|--------|
| Design | ✅ | ✅ | ✅ | ⚠️ Incomplet |
| Assembly | ✅ | ✅ | ✅ | ⚠️ Incomplet |
| Metrology | ✅ | ✅ | ✅ | ⚠️ Incomplet |
| Sealing | ✅ | ✅ | ✅ | ⚠️ Incomplet |
| Pictures | ✅ | ✅ | ✅ | ⚠️ Incomplet |
| Usable | ✅ | ✅ | ✅ | ⚠️ Incomplet |
| Installed | ✅ | ✅ | ✅ | ⚠️ Incomplet |
| Shot | ❌ | ❌ | ❌ | ❌ Manquant |

**Localisation steps** :
- Entities : `cible/repository/steps/models/*_step_entity.py`
- Beans : `cible/domain/steps/models/*_step_bean.py`
- Mappers : `cible/mapper/steps/*_step_mapper.py`
- Controllers : `cible/api/steps/*_step_controller.py`

#### Référentiels FSEC
Existent déjà :
- ✅ FsecCategoryEntity
- ✅ FsecStatusEntity
- ✅ FsecRackEntity
- ✅ FsecRolesEntity
- ✅ FsecDocumentTypesEntity
- ✅ FsecDocumentSubtypesEntity
- ✅ FsecTeamsEntity
- ✅ FsecDocumentsEntity

#### Steps Gaz (hors scope)
Existent mais on ne les touche PAS :
- AirtightnessTestLpStep
- GasFillingBpStep
- GasFillingHpStep
- PermeationStep
- DepressurizationStep
- RepressurizationStep

---

## 🔴 Écarts Identifiés - Modèle Mermaid vs Code Actuel

### FSEC Principal (fsec_entity.py)

**Mermaid dit** :
```python
version_uuid (PK)
fsec_uuid (identifiant logique)
version_number (int)
is_current_version (bool)
serial_number (string)
campaign_uuid (FK)
installation_uuid (FK)  # ⚠️ MANQUANT
category_uuid (FK)
status_uuid (FK)
current_step_uuid (FK)  # ⚠️ MANQUANT ou mal nommé
created_at, updated_at
created_by, updated_by  # ⚠️ MANQUANTS
```

**Code actuel a** :
- ✅ version_uuid, fsec_uuid
- ❌ version_number (manquant)
- ❌ is_current_version (manquant)
- ✅ name (au lieu de serial_number ?)
- ✅ campaign_id (FK)
- ❌ installation_id (manquant)
- ✅ category_id, status_id, rack_id
- ❌ current_step (pas de FK, juste un champ ?)
- ✅ created_at, last_updated
- ❌ created_by, updated_by (manquants)

### DesignStep (design_step_entity.py)

**Mermaid dit** :
```python
uuid (PK)
fsec_version_uuid (FK)
drawing_reference
specifications
notes
started_at
completed_at
completed_by
is_validated
```

**Code actuel a** :
- ✅ uuid
- ✅ fsec_version_id (FK)
- ✅ comments
- ❌ drawing_reference (manquant)
- ❌ specifications (manquant)
- ❌ started_at, completed_at, completed_by (manquants)
- ❌ is_validated (manquant)

### AssemblyStep

**Mermaid dit** :
```python
bench_uuid (FK vers AssemblyBench)
assembly_date
assembly_notes
components_used (JSON)
started_at, completed_at, completed_by
is_validated
```

**À vérifier** : Fichier `cible/repository/steps/models/assembly_step_entity.py`

### MetrologyStep

**Mermaid dit** :
```python
machine_uuid (FK vers MetrologyMachine)
measurement_date
measurements (JSON)
is_conform
non_conformity_reason
started_at, completed_at, completed_by
is_validated
```

### SealingStep

**Mermaid dit** :
```python
sealing_date
seal_reference
sealing_method
leak_test_passed
started_at, completed_at, completed_by
is_validated
```

### PicturesStep

**Mermaid dit** :
```python
pictures_count
all_angles_captured
storage_path
started_at, completed_at, completed_by
is_validated
```

### UsableStep

**Mermaid dit** :
```python
quality_check_passed
documentation_complete
usability_notes
approved_by
started_at, completed_at, completed_by
is_validated
```

### InstalledStep

**Mermaid dit** :
```python
rack_uuid (FK)
installation_date
position_in_rack
connection_details
installed_by
started_at, completed_at, completed_by
is_validated
```

### ShotStep (⚠️ MANQUANT TOTALEMENT)

**Mermaid dit** :
```python
shot_date
shot_reference
shot_parameters (JSON)
shot_successful
result_summary
started_at, completed_at, completed_by
is_validated
```

---

## 📝 Plan d'Action Détaillé

### Phase A : Compléter les Steps (8 steps)

#### A.1 - DesignStep (EXEMPLE TEMPLATE)

**Fichiers à modifier** :

1. **Entity** : `cible/repository/steps/models/design_step_entity.py`
   ```python
   # AJOUTER :
   drawing_reference = models.CharField(max_length=100, null=True, blank=True)
   specifications = models.TextField(null=True, blank=True)
   notes = models.TextField(null=True, blank=True)

   started_at = models.DateTimeField(null=True, blank=True)
   completed_at = models.DateTimeField(null=True, blank=True)
   completed_by = models.UUIDField(null=True, blank=True)
   is_validated = models.BooleanField(default=False)
   ```

2. **Bean** : `cible/domain/steps/models/design_step_bean.py`
   ```python
   # AJOUTER les mêmes champs en dataclass
   drawing_reference: Optional[str] = None
   specifications: Optional[str] = None
   notes: Optional[str] = None
   started_at: Optional[datetime] = None
   completed_at: Optional[datetime] = None
   completed_by: Optional[UUID] = None
   is_validated: bool = False
   ```

3. **Mapper** : `cible/mapper/steps/design_step_mapper.py`
   - Mettre à jour `entity_to_bean()` et `bean_to_entity()` avec nouveaux champs
   - Mettre à jour `api_to_bean()` et `bean_to_api()`

4. **Service** : Vérifier `cible/domain/steps/services/design_step_service.py`

#### A.2 - AssemblyStep
- Même process que DesignStep
- Vérifier FK vers `AssemblyBench`
- Ajouter champ JSON `components_used`

#### A.3 - MetrologyStep
- Même process
- Vérifier FK vers `MetrologyMachine`
- Ajouter champ JSON `measurements`

#### A.4 - SealingStep
- Même process
- Ajouter `seal_reference`, `sealing_method`, `leak_test_passed`

#### A.5 - PicturesStep
- Même process
- Ajouter `pictures_count`, `all_angles_captured`, `storage_path`

#### A.6 - UsableStep
- Même process
- Ajouter `quality_check_passed`, `documentation_complete`, `approved_by`

#### A.7 - InstalledStep
- Même process
- Vérifier FK vers `Rack`
- Ajouter `position_in_rack`, `connection_details`, `installed_by`

#### A.8 - ShotStep (⚠️ À CRÉER DE ZÉRO)
**Créer 4 fichiers** :
1. `cible/repository/steps/models/shot_step_entity.py`
2. `cible/domain/steps/models/shot_step_bean.py`
3. `cible/mapper/steps/shot_step_mapper.py`
4. `cible/api/steps/shot_step_controller.py` (optionnel)

**Structure ShotStep** :
```python
class ShotStepEntity(models.Model):
    uuid = models.UUIDField(primary_key=True, ...)
    fsec_version_id = models.ForeignKey(FsecEntity, ...)

    shot_date = models.DateField(...)
    shot_reference = models.CharField(max_length=100, ...)
    shot_parameters = models.JSONField(default=dict, ...)
    shot_successful = models.BooleanField(default=False)
    result_summary = models.TextField(...)

    started_at = models.DateTimeField(...)
    completed_at = models.DateTimeField(...)
    completed_by = models.UUIDField(...)
    is_validated = models.BooleanField(default=False)

    class Meta:
        app_label = "cible"
        db_table = "SHOT_STEP"
```

---

### Phase B : Compléter FSEC Principal

**Fichier** : `cible/repository/fsec/models/fsec_entity.py`

**Champs à AJOUTER** :
```python
# Versioning
version_number = models.IntegerField(default=1)
is_current_version = models.BooleanField(default=True, db_index=True)

# Relations manquantes
installation_id = models.ForeignKey(
    InstallationEntity,  # ⚠️ Créer si n'existe pas
    on_delete=models.PROTECT,
    null=True, blank=True
)

# Workflow
current_step = models.CharField(
    max_length=50,
    choices=[
        ('design', 'Design'),
        ('assembly', 'Assembly'),
        # ... 8 steps
    ],
    default='design'
)

# Audit
created_by = models.UUIDField(null=True, blank=True)
updated_by = models.UUIDField(null=True, blank=True)
```

**Contraintes à ajouter** :
```python
class Meta:
    constraints = [
        models.UniqueConstraint(
            fields=['fsec_uuid'],
            condition=models.Q(is_current_version=True),
            name='unique_current_version_per_fsec'
        )
    ]
    indexes = [
        models.Index(fields=['fsec_uuid', 'is_current_version']),
        models.Index(fields=['current_step']),
    ]
```

**Bean correspondant** : `cible/domain/fsec/models/fsec_bean.py`

---

### Phase C : Services Métier

#### C.1 - workflow_service.py

**Créer** : `cible/domain/fsec/services/workflow_service.py`

```python
"""
Workflow service - State machine pour FSEC sans gaz.
"""

from typing import Optional, List, Tuple
from ..constants import WORKFLOW_SANS_GAZ
from ..models.fsec_bean import FsecBean


def get_step_index(step_name: str) -> int:
    """Retourne l'index du step dans le workflow."""
    try:
        return WORKFLOW_SANS_GAZ.index(step_name)
    except ValueError:
        raise ValueError(f"Step inconnu: {step_name}")


def get_next_step(current_step: str) -> Optional[str]:
    """Retourne le step suivant ou None si dernier."""
    index = get_step_index(current_step)
    if index < len(WORKFLOW_SANS_GAZ) - 1:
        return WORKFLOW_SANS_GAZ[index + 1]
    return None


def get_previous_step(current_step: str) -> Optional[str]:
    """Retourne le step précédent ou None si premier."""
    index = get_step_index(current_step)
    if index > 0:
        return WORKFLOW_SANS_GAZ[index - 1]
    return None


def can_advance_to_next_step(
    fsec: FsecBean,
    current_step_validated: bool,
    required_roles_satisfied: bool,
    required_docs_satisfied: bool
) -> Tuple[bool, List[str]]:
    """
    Vérifie si le FSEC peut avancer au step suivant.

    Returns:
        (can_advance, list_of_blocking_reasons)
    """
    blocking_reasons = []

    if not current_step_validated:
        blocking_reasons.append(f"Step {fsec.current_step} non validé")

    if not required_roles_satisfied:
        blocking_reasons.append(f"Rôles requis non satisfaits")

    if not required_docs_satisfied:
        blocking_reasons.append(f"Documents requis manquants")

    next_step = get_next_step(fsec.current_step)
    if next_step is None:
        blocking_reasons.append("Dernier step atteint")

    return (len(blocking_reasons) == 0, blocking_reasons)


def advance_step(fsec: FsecBean) -> FsecBean:
    """Avance le FSEC au step suivant."""
    next_step = get_next_step(fsec.current_step)
    if next_step is None:
        raise ValueError("Impossible d'avancer: dernier step atteint")

    fsec.current_step = next_step
    return fsec


def get_workflow_progress(current_step: str) -> dict:
    """Retourne la progression dans le workflow."""
    index = get_step_index(current_step)
    total_steps = len(WORKFLOW_SANS_GAZ)

    return {
        "current_step": current_step,
        "current_index": index,
        "total_steps": total_steps,
        "progress_percent": int((index + 1) / total_steps * 100),
        "next_step": get_next_step(current_step),
        "previous_step": get_previous_step(current_step),
        "is_first": index == 0,
        "is_last": index == total_steps - 1,
    }
```

#### C.2 - validation_service.py

**Créer** : `cible/domain/fsec/services/validation_service.py`

```python
"""
Validation service - Validation des rôles et documents requis.
"""

from typing import List, Tuple, Dict
from ..constants import REQUIRED_ROLES, REQUIRED_SUBTYPES_DOCS


def check_required_roles(
    step_name: str,
    assigned_roles: List[str]
) -> Tuple[bool, List[str]]:
    """
    Vérifie que tous les rôles requis sont assignés.

    Args:
        step_name: Nom du step (ex: "design")
        assigned_roles: Liste des codes de rôles assignés (ex: ["concepteur", "verificateur"])

    Returns:
        (is_satisfied, missing_roles)
    """
    required = set(REQUIRED_ROLES.get(step_name, []))
    assigned = set(assigned_roles)

    missing = required - assigned
    return (len(missing) == 0, list(missing))


def check_required_documents(
    step_name: str,
    validated_doc_subtypes: List[str]
) -> Tuple[bool, List[str]]:
    """
    Vérifie que tous les documents requis sont validés.

    Args:
        step_name: Nom du step
        validated_doc_subtypes: Liste des sous-types de documents validés

    Returns:
        (is_satisfied, missing_subtypes)
    """
    required = set(REQUIRED_SUBTYPES_DOCS.get(step_name, []))
    validated = set(validated_doc_subtypes)

    missing = required - validated
    return (len(missing) == 0, list(missing))


def get_step_validation_status(
    step_name: str,
    assigned_roles: List[str],
    validated_doc_subtypes: List[str]
) -> Dict:
    """
    Retourne le statut complet de validation d'un step.

    Returns:
        {
            "step": "design",
            "roles_satisfied": True/False,
            "missing_roles": [...],
            "documents_satisfied": True/False,
            "missing_documents": [...],
            "can_validate": True/False
        }
    """
    roles_ok, missing_roles = check_required_roles(step_name, assigned_roles)
    docs_ok, missing_docs = check_required_documents(step_name, validated_doc_subtypes)

    return {
        "step": step_name,
        "roles_satisfied": roles_ok,
        "missing_roles": missing_roles,
        "documents_satisfied": docs_ok,
        "missing_documents": missing_docs,
        "can_validate": roles_ok and docs_ok,
    }
```

---

### Phase D : Migrations Django

**Après avoir modifié les Entity** :

```bash
cd /home/baptiste-rossi/Desktop/Perso2-main./Perso2-main/

# Générer les migrations
python manage.py makemigrations cible

# Vérifier les migrations générées
python manage.py showmigrations cible

# Appliquer les migrations
python manage.py migrate cible
```

**Migrations attendues** :
1. Ajout champs FSEC (`version_number`, `is_current_version`, `created_by`, `updated_by`, `installation_id`)
2. Ajout champs DesignStep
3. Ajout champs AssemblyStep
4. Ajout champs MetrologyStep
5. Ajout champs SealingStep
6. Ajout champs PicturesStep
7. Ajout champs UsableStep
8. Ajout champs InstalledStep
9. Création table ShotStep

---

## 🔧 Templates de Code

### Template Entity Step

```python
"""Entité {STEP_NAME}_STEP."""
import uuid
from django.db import models
from cible.repository.fsec.models.fsec_entity import FsecEntity


class {StepName}StepEntity(models.Model):
    """Entité représentant une étape de {step_name}."""

    class Meta:
        app_label = "cible"
        db_table = "{STEP_NAME}_STEP"

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fsec_version_id = models.ForeignKey(
        FsecEntity,
        on_delete=models.CASCADE,
        db_column="fsec_version_id",
        related_name="{step_name}_steps",
        to_field="version_uuid",
    )

    # Champs métier spécifiques
    # ... (selon Mermaid)

    # Champs communs à tous les steps
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    completed_by = models.UUIDField(null=True, blank=True)
    is_validated = models.BooleanField(default=False)
```

### Template Bean Step

```python
"""Bean {StepName}Step - Domain Model."""
from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from uuid import UUID


@dataclass
class {StepName}StepBean:
    """Domain model for {StepName} step."""

    uuid: Optional[UUID] = None
    fsec_version_uuid: Optional[UUID] = None

    # Champs métier spécifiques
    # ... (selon Mermaid)

    # Champs communs
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    completed_by: Optional[UUID] = None
    is_validated: bool = False
```

### Template Mapper Step

```python
"""Mapper {StepName}Step."""
from typing import Dict, Any
from cible.domain.steps.models.{step_name}_step_bean import {StepName}StepBean
from cible.repository.steps.models.{step_name}_step_entity import {StepName}StepEntity


def {step_name}_step_mapper_entity_to_bean(entity: {StepName}StepEntity) -> {StepName}StepBean:
    """Convert Entity to Bean."""
    return {StepName}StepBean(
        uuid=entity.uuid,
        fsec_version_uuid=entity.fsec_version_id_id,
        # ... tous les champs
        started_at=entity.started_at,
        completed_at=entity.completed_at,
        completed_by=entity.completed_by,
        is_validated=entity.is_validated,
    )


def {step_name}_step_mapper_bean_to_entity(bean: {StepName}StepBean) -> {StepName}StepEntity:
    """Convert Bean to Entity."""
    entity = {StepName}StepEntity()
    if bean.uuid:
        entity.uuid = bean.uuid
    # ... assignation champs
    return entity


def {step_name}_step_mapper_api_to_bean(data: Dict[str, Any]) -> {StepName}StepBean:
    """Convert API JSON to Bean."""
    # ... parsing
    pass


def {step_name}_step_mapper_bean_to_api(bean: {StepName}StepBean) -> Dict[str, Any]:
    """Convert Bean to API JSON."""
    return {
        "uuid": str(bean.uuid) if bean.uuid else None,
        # ... tous les champs
    }
```

---

## 📂 Structure Fichiers Complète

```
cible/
├── domain/
│   ├── fsec/
│   │   ├── constants.py                 ✅ CRÉÉ
│   │   ├── types.py                     ✅ CRÉÉ
│   │   ├── models/
│   │   │   └── fsec_bean.py             ⚠️ À COMPLÉTER
│   │   ├── services/
│   │   │   ├── fsec_service.py          ⚠️ À VÉRIFIER
│   │   │   ├── workflow_service.py      ❌ À CRÉER
│   │   │   └── validation_service.py    ❌ À CRÉER
│   │   └── interface/
│   │       └── fsec_repository.py
│   ├── steps/
│   │   ├── models/
│   │   │   ├── design_step_bean.py      ⚠️ À COMPLÉTER
│   │   │   ├── assembly_step_bean.py    ⚠️ À COMPLÉTER
│   │   │   ├── metrology_step_bean.py   ⚠️ À COMPLÉTER
│   │   │   ├── sealing_step_bean.py     ⚠️ À COMPLÉTER
│   │   │   ├── pictures_step_bean.py    ⚠️ À COMPLÉTER
│   │   │   ├── usable_step_bean.py      ⚠️ À COMPLÉTER
│   │   │   ├── installed_step_bean.py   ⚠️ À COMPLÉTER
│   │   │   └── shot_step_bean.py        ❌ À CRÉER
│   │   └── services/
│   │       └── {step}_service.py        ⚠️ À VÉRIFIER
│   └── referential/
│       ├── models/
│       │   └── campaign_bean.py         ✅ CRÉÉ (template)
│       └── interface/
│           └── campaign_repository.py   ✅ CRÉÉ (template)
│
├── repository/
│   ├── fsec/
│   │   └── models/
│   │       └── fsec_entity.py           ⚠️ À COMPLÉTER
│   ├── steps/
│   │   └── models/
│   │       ├── design_step_entity.py    ⚠️ À COMPLÉTER
│   │       ├── assembly_step_entity.py  ⚠️ À COMPLÉTER
│   │       ├── metrology_step_entity.py ⚠️ À COMPLÉTER
│   │       ├── sealing_step_entity.py   ⚠️ À COMPLÉTER
│   │       ├── pictures_step_entity.py  ⚠️ À COMPLÉTER
│   │       ├── usable_step_entity.py    ⚠️ À COMPLÉTER
│   │       ├── installed_step_entity.py ⚠️ À COMPLÉTER
│   │       └── shot_step_entity.py      ❌ À CRÉER
│   └── referential/
│       ├── models/
│       │   └── campaign_entity.py       ✅ CRÉÉ (template)
│       └── repositories/
│           └── campaign_repository.py   ✅ CRÉÉ (template)
│
├── mapper/
│   ├── fsec/
│   │   └── fsec_mapper.py               ⚠️ À VÉRIFIER
│   ├── steps/
│   │   ├── design_step_mapper.py        ⚠️ À COMPLÉTER
│   │   ├── assembly_step_mapper.py      ⚠️ À COMPLÉTER
│   │   ├── metrology_step_mapper.py     ⚠️ À COMPLÉTER
│   │   ├── sealing_step_mapper.py       ⚠️ À COMPLÉTER
│   │   ├── pictures_step_mapper.py      ⚠️ À COMPLÉTER
│   │   ├── usable_step_mapper.py        ⚠️ À COMPLÉTER
│   │   ├── installed_step_mapper.py     ⚠️ À COMPLÉTER
│   │   └── shot_step_mapper.py          ❌ À CRÉER
│   └── referential/
│       └── campaign_mapper.py           ✅ CRÉÉ (template)
│
└── api/
    ├── fsec/
    │   └── fsec_controller.py           ⚠️ À VÉRIFIER
    ├── steps/
    │   ├── design_step_controller.py    ⚠️ À VÉRIFIER
    │   ├── assembly_step_controller.py  ⚠️ À VÉRIFIER
    │   ├── metrology_step_controller.py ⚠️ À VÉRIFIER
    │   ├── sealing_step_controller.py   ⚠️ À VÉRIFIER
    │   ├── pictures_step_controller.py  ⚠️ À VÉRIFIER
    │   ├── usable_step_controller.py    ⚠️ À VÉRIFIER
    │   ├── installed_step_controller.py ⚠️ À VÉRIFIER
    │   └── shot_step_controller.py      ❌ À CRÉER (optionnel)
    └── referential/
        └── (pas encore créé)
```

**Légende** :
- ✅ Créé et complet
- ⚠️ Existe mais incomplet (à compléter selon Mermaid)
- ❌ N'existe pas (à créer)

---

## 🎯 Prochaines Actions (par priorité)

### Action 1 : Compléter DesignStep (TEMPLATE)
1. Modifier `repository/steps/models/design_step_entity.py`
2. Modifier `domain/steps/models/design_step_bean.py`
3. Mettre à jour `mapper/steps/design_step_mapper.py`
4. Tester

### Action 2 : Répliquer pour les 6 autres steps
- AssemblyStep
- MetrologyStep
- SealingStep
- PicturesStep
- UsableStep
- InstalledStep

### Action 3 : Créer ShotStep de zéro
- 4 fichiers (Entity, Bean, Mapper, Controller)

### Action 4 : Compléter FsecEntity
- Ajouter champs manquants
- Ajouter contraintes versioning

### Action 5 : Créer les services métier
- workflow_service.py
- validation_service.py

### Action 6 : Migrations Django
```bash
python manage.py makemigrations cible
python manage.py migrate cible
```

### Action 7 : Tests
- Vérifier que tout compile
- Tests unitaires des services
- Tests d'intégration API

---

## 🔍 Commandes Utiles

### Vérifier la structure
```bash
cd /home/baptiste-rossi/Desktop/Perso2-main./Perso2-main/

# Voir tous les steps
find cible/repository/steps/models -name "*_step_entity.py"

# Voir tous les beans
find cible/domain/steps/models -name "*_step_bean.py"
```

### Migrations
```bash
# Générer migrations
python manage.py makemigrations cible

# Voir SQL généré
python manage.py sqlmigrate cible 0001

# Appliquer
python manage.py migrate cible

# Rollback
python manage.py migrate cible 0000
```

### Tests
```bash
# Tous les tests
pytest cible/tests/

# Tests steps uniquement
pytest cible/tests/unit/steps/

# Test spécifique
pytest cible/tests/unit/steps/test_design_step.py -v
```

---

## 📌 Notes Importantes

1. **Ne PAS toucher aux steps gaz** : Airtightness, GasFillingBp/Hp, Permeation, Depressurization, Repressurization

2. **Respecter le Mermaid strictement** : Tous les champs du Mermaid doivent être dans le code

3. **Versioning FSEC** :
   - `version_uuid` = PK technique (unique par version)
   - `fsec_uuid` = Identifiant logique (partagé entre toutes les versions)
   - Contrainte : 1 seul `is_current_version=True` par `fsec_uuid`

4. **Champs communs à tous les steps** :
   - `started_at`, `completed_at`, `completed_by`, `is_validated`

5. **FK importantes** :
   - AssemblyStep → AssemblyBench
   - MetrologyStep → MetrologyMachine
   - InstalledStep → Rack
   - FSEC → Installation (⚠️ à créer si manquant)

---

## 📊 Statistiques

- **Fichiers créés** : 10 (constantes, types, campaign template)
- **Fichiers à modifier** : ~30 (steps + fsec + mappers)
- **Fichiers à créer** : ~10 (ShotStep, services, migrations)
- **Total estimé** : 50 fichiers touchés

**Temps estimé** : 8-12 heures de développement

---

## ✅ Checklist Finale de Validation

Avant de considérer le travail terminé :

- [ ] Tous les steps ont les champs du Mermaid
- [ ] ShotStep créé et fonctionnel
- [ ] FsecEntity a `version_number`, `is_current_version`, `created_by`, `updated_by`
- [ ] Contrainte unique versioning ajoutée
- [ ] workflow_service.py créé et testé
- [ ] validation_service.py créé et testé
- [ ] Migrations générées et appliquées
- [ ] Aucune erreur au démarrage Django
- [ ] Tests unitaires passent
- [ ] API endpoints fonctionnent

---

**Fin du document**
