"""Bean CampaignStatus - Statut de campagne."""
from dataclasses import dataclass
from typing import Optional


@dataclass
class CampaignStatusBean:
    """Bean représentant un statut de campagne."""

    id: Optional[int] = None
    label: str = ""
    color: str = ""
