from dataclasses import dataclass
from typing import Optional


@dataclass
class InventoryBasicPartsCatalogBean:
    uuid: str
    elementName: str
    availability: str
    boxNumberOrBoxDescription: str
    deliveryDate: str
    exitDate: str
    usedCampaign: str
    additionalComment: Optional[str] = None
    fsec: Optional[str] = None
