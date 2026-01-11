"""Bean AssemblyBench - Banc d'assemblage."""
from dataclasses import dataclass
from typing import Optional


@dataclass
class AssemblyBenchBean:
    """Bean représentant un banc d'assemblage."""

    id: Optional[int] = None
    label: str = ""
    color: str = ""
