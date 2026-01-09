"""Bean MetrologyStep - Étape de métrologie."""
from dataclasses import dataclass
from datetime import date
from typing import Optional


@dataclass
class MetrologyStepBean:
    """Bean représentant une étape de métrologie."""

    uuid: str = ""
    fsec_version_id: str = ""
    machine_id: Optional[int] = None
    date: Optional[date] = None
    comments: Optional[str] = None
