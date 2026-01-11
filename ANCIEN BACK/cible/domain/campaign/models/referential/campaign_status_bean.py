from dataclasses import dataclass


@dataclass
class CampaignStatusBean:
    id: int
    label: str = None
    color: str = None
