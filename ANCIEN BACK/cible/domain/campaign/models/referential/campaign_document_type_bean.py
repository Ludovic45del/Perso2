from dataclasses import dataclass

from cible.domain.campaign.models.referential.campaign_document_subtype_bean import (
    CampaignDocumentSubtypeBean,
)


@dataclass
class CampaignDocumentTypeBean:
    id: int
    label: str
    subtype: list[CampaignDocumentSubtypeBean] = None
