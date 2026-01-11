import abc

from cible.domain.campaign.models.campaign_document_bean import CampaignDocumentBean
from cible.domain.campaign.models.referential.campaign_document_type_bean import (
    CampaignDocumentTypeBean,
)


class ICampaignDocumentRepository:

    @abc.abstractmethod
    def get_campaign_documents_by_campaign_name(
        self, campaign
    ) -> list[CampaignDocumentBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_campaign_documents_type(self) -> list[CampaignDocumentTypeBean]:
        raise NotImplementedError
