"""Bean DesignStep - Étape de design."""
from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class DesignStepBean:
    """Bean représentant une étape de design."""

    uuid: str = ""
    fsec_version_id: str = ""

    # Champs métier spécifiques au Design
    drawing_reference: Optional[str] = None
    specifications: Optional[str] = None
    notes: Optional[str] = None
    comments: Optional[str] = None

    # Champs communs à tous les steps
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    completed_by: Optional[str] = None
    is_validated: bool = False
