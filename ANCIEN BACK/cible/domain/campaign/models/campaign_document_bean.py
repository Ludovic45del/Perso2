from dataclasses import dataclass
from typing import Optional

from cible.domain.campaign.models.referential.campaign_document_subtype_bean import (
    CampaignDocumentSubtypeBean,
)
from cible.domain.campaign.models.referential.campaign_document_type_bean import (
    CampaignDocumentTypeBean,
)


@dataclass
class CampaignDocumentBean:
    uuid: str
    campaign_uuid: str
    name: Optional[str] = None
    path: Optional[str] = None
    date: Optional[str] = None
    type: Optional[CampaignDocumentTypeBean] = None
    subtype: Optional[CampaignDocumentSubtypeBean] = None
