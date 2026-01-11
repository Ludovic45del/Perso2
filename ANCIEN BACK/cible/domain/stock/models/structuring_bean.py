from dataclasses import dataclass
from typing import Optional


@dataclass
class StructuringBean:
    uuid: str
    who: str
    fulfillmentDate: str
    structuringNumber: str
    pamsNumber: str
    localisation: str
    usageDate: str
    comments: str
    fsec: Optional[str] = None
    additionalComment: Optional[str] = None
