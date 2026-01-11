"""Bean AssemblyStep - Étape d'assemblage."""
from dataclasses import dataclass, field
from datetime import date, datetime
from typing import List, Optional


@dataclass
class AssemblyStepBean:
    """Bean représentant une étape d'assemblage."""

    uuid: str = ""
    fsec_version_id: str = ""

    # Champs métier spécifiques à l'Assembly
    hydrometric_temperature: Optional[float] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    comments: Optional[str] = None
    assembly_bench_ids: List[int] = field(default_factory=list)

    # Champs communs à tous les steps
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    completed_by: Optional[str] = None
    is_validated: bool = False
