"""Bean FsecRack - Rack de stockage FSEC."""
from dataclasses import dataclass
from typing import Optional


@dataclass
class FsecRackBean:
    """Bean représentant un rack de stockage FSEC."""

    id: Optional[int] = None
    label: str = ""
    color: str = ""
    is_full: bool = False
