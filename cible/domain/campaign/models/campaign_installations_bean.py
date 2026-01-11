"""Bean CampaignInstallations - Installation de campagne."""
from dataclasses import dataclass
from typing import Optional


@dataclass
class CampaignInstallationsBean:
    """Bean représentant une installation de campagne."""

    id: Optional[int] = None
    label: str = ""
    color: str = ""
