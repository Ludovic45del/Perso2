"""Bean SealingStep - Étape de scellement."""
from dataclasses import dataclass
from typing import Optional


@dataclass
class SealingStepBean:
    """Bean représentant une étape de scellement."""

    uuid: str = ""
    fsec_version_id: str = ""
    interface_io: Optional[str] = None
    comments: Optional[str] = None
