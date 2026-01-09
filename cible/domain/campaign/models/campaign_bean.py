"""Bean Campaign - Campagne principale."""
from dataclasses import dataclass, field
from datetime import date, datetime
from typing import Optional


@dataclass
class CampaignBean:
    """Bean représentant une campagne."""

    uuid: str = ""
    type_id: Optional[int] = None
    status_id: Optional[int] = None
    installation_id: Optional[int] = None
    name: str = ""
    year: int = 0
    semester: str = ""
    last_updated: Optional[datetime] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    dtri_number: Optional[int] = None
    description: Optional[str] = None
