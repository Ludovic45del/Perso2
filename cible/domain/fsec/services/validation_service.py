"""
Validation service - Validation des rôles et documents requis.

Ce service gère la validation des prérequis pour chaque étape du workflow FSEC,
en vérifiant que les rôles et documents nécessaires sont présents.
"""

from typing import List, Tuple, Dict
from ..constants import REQUIRED_ROLES, REQUIRED_SUBTYPES_DOCS


def check_required_roles(
    step_name: str,
    assigned_roles: List[str]
) -> Tuple[bool, List[str]]:
    """
    Vérifie que tous les rôles requis sont assignés pour un step.

    Args:
        step_name: Nom du step (ex: "design", "assembly")
        assigned_roles: Liste des codes de rôles assignés (ex: ["concepteur", "verificateur"])

    Returns:
        Tuple contenant:
        - bool: True si tous les rôles requis sont présents
        - List[str]: Liste des rôles manquants (vide si tout est OK)
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
    Vérifie que tous les documents requis sont validés pour un step.

    Args:
        step_name: Nom du step (ex: "design", "assembly")
        validated_doc_subtypes: Liste des sous-types de documents validés
                                (ex: ["plan_conception", "note_calcul"])

    Returns:
        Tuple contenant:
        - bool: True si tous les documents requis sont présents
        - List[str]: Liste des sous-types de documents manquants (vide si tout est OK)
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

    Args:
        step_name: Nom du step à valider
        assigned_roles: Liste des rôles assignés
        validated_doc_subtypes: Liste des documents validés

    Returns:
        Dictionnaire contenant:
        - step: Nom du step
        - roles_satisfied: True si tous les rôles requis sont présents
        - missing_roles: Liste des rôles manquants
        - documents_satisfied: True si tous les documents requis sont présents
        - missing_documents: Liste des documents manquants
        - can_validate: True si le step peut être validé (rôles ET documents OK)
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


def get_required_roles_for_step(step_name: str) -> List[str]:
    """
    Retourne la liste des rôles requis pour un step.

    Args:
        step_name: Nom du step

    Returns:
        Liste des codes de rôles requis
    """
    return REQUIRED_ROLES.get(step_name, [])


def get_required_documents_for_step(step_name: str) -> List[str]:
    """
    Retourne la liste des sous-types de documents requis pour un step.

    Args:
        step_name: Nom du step

    Returns:
        Liste des sous-types de documents requis
    """
    return REQUIRED_SUBTYPES_DOCS.get(step_name, [])


def validate_step_completion(
    step_name: str,
    assigned_roles: List[str],
    validated_doc_subtypes: List[str],
    step_is_validated: bool
) -> Tuple[bool, List[str]]:
    """
    Vérifie si un step peut être considéré comme complété.

    Un step est complété si:
    - Tous les rôles requis sont assignés
    - Tous les documents requis sont validés
    - Le flag is_validated du step est True

    Args:
        step_name: Nom du step
        assigned_roles: Liste des rôles assignés
        validated_doc_subtypes: Liste des documents validés
        step_is_validated: Flag de validation du step

    Returns:
        Tuple contenant:
        - bool: True si le step est complété
        - List[str]: Liste des raisons de non-complétion (vide si complété)
    """
    blocking_reasons = []

    roles_ok, missing_roles = check_required_roles(step_name, assigned_roles)
    if not roles_ok:
        blocking_reasons.append(f"Rôles manquants: {', '.join(missing_roles)}")

    docs_ok, missing_docs = check_required_documents(step_name, validated_doc_subtypes)
    if not docs_ok:
        blocking_reasons.append(f"Documents manquants: {', '.join(missing_docs)}")

    if not step_is_validated:
        blocking_reasons.append("Step non validé (is_validated=False)")

    return (len(blocking_reasons) == 0, blocking_reasons)


def get_completion_percentage(
    step_name: str,
    assigned_roles: List[str],
    validated_doc_subtypes: List[str],
    step_is_validated: bool
) -> Dict:
    """
    Calcule le pourcentage de complétion d'un step.

    Args:
        step_name: Nom du step
        assigned_roles: Liste des rôles assignés
        validated_doc_subtypes: Liste des documents validés
        step_is_validated: Flag de validation du step

    Returns:
        Dictionnaire contenant:
        - step: Nom du step
        - total_criteria: Nombre total de critères (rôles + documents + validation)
        - satisfied_criteria: Nombre de critères satisfaits
        - completion_percent: Pourcentage de complétion (0-100)
        - is_complete: True si 100% complété
    """
    required_roles = set(REQUIRED_ROLES.get(step_name, []))
    required_docs = set(REQUIRED_SUBTYPES_DOCS.get(step_name, []))
    assigned = set(assigned_roles)
    validated = set(validated_doc_subtypes)

    # Calcul des critères satisfaits
    roles_satisfied = len(required_roles & assigned)
    docs_satisfied = len(required_docs & validated)
    validation_satisfied = 1 if step_is_validated else 0

    # Calcul du total
    total_roles = len(required_roles)
    total_docs = len(required_docs)
    total_criteria = total_roles + total_docs + 1  # +1 pour le flag is_validated
    satisfied_criteria = roles_satisfied + docs_satisfied + validation_satisfied

    completion_percent = int((satisfied_criteria / total_criteria * 100)) if total_criteria > 0 else 0

    return {
        "step": step_name,
        "total_criteria": total_criteria,
        "satisfied_criteria": satisfied_criteria,
        "completion_percent": completion_percent,
        "is_complete": completion_percent == 100,
        "details": {
            "roles": {
                "required": total_roles,
                "satisfied": roles_satisfied,
            },
            "documents": {
                "required": total_docs,
                "satisfied": docs_satisfied,
            },
            "validation": {
                "required": 1,
                "satisfied": validation_satisfied,
            }
        }
    }
