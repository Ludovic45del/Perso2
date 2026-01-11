from dataclasses import dataclass
from typing import Optional


@dataclass
class TransfersBean:
    uuid: str
    equipment: str
    equipmentType: str
    initialStock: str
    units: str
    currentStock: str
    entryDate: str
    exitDate: str
    date: str
    additionalComment: Optional[str] = None
