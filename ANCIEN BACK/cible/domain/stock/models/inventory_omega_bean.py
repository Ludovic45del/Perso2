from dataclasses import dataclass
from typing import Optional


@dataclass
class InventoryOmegaBean:
    uuid: str
    iec: str
    elementsOrTargetDescription: str
    digitsIfUntaggedElement: str
    targetsOrElementNumber: str
    boxNumberOrBoxDescription: str
    localisation: str
    deliveryDate: str
    exitDate: str
    drmnCampaignNumber: str
    additionalComment: Optional[str] = None
    fsec: Optional[str] = None
