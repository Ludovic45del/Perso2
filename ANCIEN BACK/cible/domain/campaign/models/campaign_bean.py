from dataclasses import dataclass
from typing import Optional

from cible.domain.campaign.models.campaign_document_bean import CampaignDocumentBean
from cible.domain.campaign.models.campaign_team_bean import CampaignTeamBean
from cible.domain.campaign.models.referential.campaign_installation_bean import (
    CampaignInstallationBean,
)
from cible.domain.campaign.models.referential.campaign_status_bean import (
    CampaignStatusBean,
)
from cible.domain.campaign.models.referential.campaign_type_bean import CampaignTypeBean


@dataclass
class CampaignBean:
    uuid: str
    name: str
    semester: str
    lastUpdated: str
    year: int
    type: CampaignTypeBean
    installation: CampaignInstallationBean

    startDate: Optional[str] = None
    endDate: Optional[str] = None
    description: Optional[str] = None
    dtriNumber: Optional[int] = None
    status: Optional[CampaignStatusBean] = None
    campaignTeam: list[CampaignTeamBean] = None
    campaignDocuments: list[CampaignDocumentBean] = None
    toBeDuplicated: Optional[bool] = None
