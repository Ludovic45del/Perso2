from dataclasses import dataclass
from typing import Optional


@dataclass
class OtherConsumablesBean:
    uuid: str
    item: str
    stocks: str
    unit: str
    reference: str
    buyingType: str
    supplier: str
    additionalComment: Optional[str] = None
