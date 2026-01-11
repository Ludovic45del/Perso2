from dataclasses import dataclass
from typing import Optional


@dataclass
class InventoryLmjBean:
    uuid: str
    iec: str
    elementsOrTargetDescription: str
    digitsIfUntaggedElement: str
    targetsOrElementNumber: str
    boxNumberOrBoxDescription: str
    localisation: str
    deliveryDate: str
    exitDate: str
    campaignDtriNumber: str
    additionalComment: Optional[str] = None
    fsec: Optional[str] = None
