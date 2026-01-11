"""Bean ShotStep - Étape de tir."""
from dataclasses import dataclass, field
from datetime import date, datetime
from typing import Dict, Optional


@dataclass
class ShotStepBean:
    """Bean représentant une étape de tir."""

    uuid: str = ""
    fsec_version_id: str = ""

    # Champs métier spécifiques à Shot
    shot_date: Optional[date] = None
    shot_reference: Optional[str] = None
    shot_parameters: Dict = field(default_factory=dict)
    shot_successful: bool = False
    result_summary: Optional[str] = None

    # Champs communs à tous les steps
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    completed_by: Optional[str] = None
    is_validated: bool = False
