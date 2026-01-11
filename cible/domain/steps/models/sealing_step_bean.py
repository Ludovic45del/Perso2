"""Bean SealingStep - Étape de scellement."""
from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class SealingStepBean:
    """Bean représentant une étape de scellement."""

    uuid: str = ""
    fsec_version_id: str = ""

    # Champs métier spécifiques à Sealing
    interface_io: Optional[str] = None
    comments: Optional[str] = None

    # Champs communs à tous les steps
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    completed_by: Optional[str] = None
    is_validated: bool = False
