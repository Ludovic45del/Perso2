from dataclasses import dataclass
from typing import Optional


@dataclass
class ConsumablesGluesBean:
    uuid: str
    item: str
    stocks: str
    unit: str
    reference: str
    buyingType: str
    supplier: str
    expiryDate: str
    additionalComment: Optional[str] = None
