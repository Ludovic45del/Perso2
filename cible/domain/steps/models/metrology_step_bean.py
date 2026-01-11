"""Bean MetrologyStep - Étape de métrologie."""
from dataclasses import dataclass
from datetime import date, datetime
from typing import Optional


@dataclass
class MetrologyStepBean:
    """Bean représentant une étape de métrologie."""

    uuid: str = ""
    fsec_version_id: str = ""

    # Champs métier spécifiques à Metrology
    machine_id: Optional[int] = None
    date: Optional[date] = None
    comments: Optional[str] = None

    # Champs communs à tous les steps
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    completed_by: Optional[str] = None
    is_validated: bool = False
