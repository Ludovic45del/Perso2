"""Bean InstalledStep - Étape installée."""
from dataclasses import dataclass
from datetime import date, datetime
from typing import Optional


@dataclass
class InstalledStepBean:
    """Bean représentant une étape installée (tir)."""

    uuid: str = ""
    fsec_version_id: str = ""

    # Champs métier spécifiques à Installed
    shooting_date: Optional[date] = None
    preshooting_pressure: Optional[float] = None
    experience_srxx: Optional[str] = None

    # Champs communs à tous les steps
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    completed_by: Optional[str] = None
    is_validated: bool = False
