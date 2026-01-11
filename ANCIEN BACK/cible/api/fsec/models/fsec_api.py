from dataclasses import dataclass
from typing import Optional

from cible.domain.campaign.models.campaign_bean import CampaignBean
from cible.domain.fsec.models.referential.fsec_category_bean import FsecCategoryBean
from cible.domain.fsec.models.referential.fsec_rack_bean import FsecRackBean
from cible.domain.fsec.models.referential.fsec_status_bean import FsecStatusBean


@dataclass
class FsecApi:
    versionUuid: str
    fsecUuid: str
    name: str
    campaign: CampaignBean
    comments: str
    status: FsecStatusBean
    category: FsecCategoryBean
    lastUpdated: str
    rack: FsecRackBean
    deliveryDate: Optional[str] = None
    embase: Optional[str] = None
    shootingDate: Optional[str] = None
