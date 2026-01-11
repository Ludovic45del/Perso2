"""
Workflow service - State machine pour FSEC sans gaz.

Ce service gère la progression dans le workflow des 8 étapes du FSEC sans gaz,
permettant de naviguer entre les étapes et de valider les transitions.
"""

from typing import Optional, List, Tuple, Dict
from ..constants import WORKFLOW_SANS_GAZ, STEP_LABELS
from ..models.fsec_bean import FsecBean


def get_step_index(step_name: str) -> int:
    """
    Retourne l'index du step dans le workflow.

    Args:
        step_name: Nom du step (ex: "design", "assembly")

    Returns:
        Index du step (0-7)

    Raises:
        ValueError: Si le step n'existe pas
    """
    try:
        return WORKFLOW_SANS_GAZ.index(step_name)
    except ValueError:
        raise ValueError(f"Step inconnu: {step_name}")


def get_next_step(current_step: str) -> Optional[str]:
    """
    Retourne le step suivant ou None si dernier.

    Args:
        current_step: Nom du step actuel

    Returns:
        Nom du step suivant ou None si c'est le dernier step
    """
    index = get_step_index(current_step)
    if index < len(WORKFLOW_SANS_GAZ) - 1:
        return WORKFLOW_SANS_GAZ[index + 1]
    return None


def get_previous_step(current_step: str) -> Optional[str]:
    """
    Retourne le step précédent ou None si premier.

    Args:
        current_step: Nom du step actuel

    Returns:
        Nom du step précédent ou None si c'est le premier step
    """
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

    Args:
        fsec: Bean FSEC à vérifier
        current_step_validated: True si le step actuel est validé
        required_roles_satisfied: True si tous les rôles requis sont assignés
        required_docs_satisfied: True si tous les documents requis sont présents

    Returns:
        Tuple contenant:
        - bool: True si le FSEC peut avancer
        - List[str]: Liste des raisons bloquantes (vide si peut avancer)
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
    """
    Avance le FSEC au step suivant.

    Args:
        fsec: Bean FSEC à faire avancer

    Returns:
        Bean FSEC mis à jour avec le nouveau step

    Raises:
        ValueError: Si impossible d'avancer (dernier step atteint)
    """
    next_step = get_next_step(fsec.current_step)
    if next_step is None:
        raise ValueError("Impossible d'avancer: dernier step atteint")

    fsec.current_step = next_step
    return fsec


def get_workflow_progress(current_step: str) -> Dict:
    """
    Retourne la progression dans le workflow.

    Args:
        current_step: Nom du step actuel

    Returns:
        Dictionnaire contenant les informations de progression:
        - current_step: Nom du step actuel
        - current_step_label: Label d'affichage du step actuel
        - current_index: Index du step (0-7)
        - total_steps: Nombre total de steps (8)
        - progress_percent: Pourcentage de progression (0-100)
        - next_step: Nom du step suivant ou None
        - next_step_label: Label du step suivant ou None
        - previous_step: Nom du step précédent ou None
        - previous_step_label: Label du step précédent ou None
        - is_first: True si premier step
        - is_last: True si dernier step
    """
    index = get_step_index(current_step)
    total_steps = len(WORKFLOW_SANS_GAZ)
    next_step = get_next_step(current_step)
    previous_step = get_previous_step(current_step)

    return {
        "current_step": current_step,
        "current_step_label": STEP_LABELS.get(current_step, current_step),
        "current_index": index,
        "total_steps": total_steps,
        "progress_percent": int((index + 1) / total_steps * 100),
        "next_step": next_step,
        "next_step_label": STEP_LABELS.get(next_step) if next_step else None,
        "previous_step": previous_step,
        "previous_step_label": STEP_LABELS.get(previous_step) if previous_step else None,
        "is_first": index == 0,
        "is_last": index == total_steps - 1,
    }


def is_valid_step(step_name: str) -> bool:
    """
    Vérifie si un nom de step est valide.

    Args:
        step_name: Nom du step à vérifier

    Returns:
        True si le step existe dans le workflow
    """
    return step_name in WORKFLOW_SANS_GAZ


def get_all_steps() -> List[Dict[str, str]]:
    """
    Retourne la liste complète des steps du workflow.

    Returns:
        Liste de dictionnaires contenant name et label pour chaque step
    """
    return [
        {
            "name": step,
            "label": STEP_LABELS.get(step, step),
            "index": index
        }
        for index, step in enumerate(WORKFLOW_SANS_GAZ)
    ]
