"""Bean UsableStep - Étape utilisable."""
from dataclasses import dataclass
from datetime import date, datetime
from typing import Optional


@dataclass
class UsableStepBean:
    """Bean représentant une étape utilisable (livraison)."""

    uuid: str = ""
    fsec_version_id: str = ""

    # Champs métier spécifiques à Usable
    delivery_date: Optional[date] = None

    # Champs communs à tous les steps
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    completed_by: Optional[str] = None
    is_validated: bool = False
