from cible.domain.campaign.interface.i_campaign_document_repository import (
    ICampaignDocumentRepository,
)
from cible.domain.campaign.models.campaign_document_bean import CampaignDocumentBean
from cible.domain.campaign.models.referential.campaign_document_type_bean import (
    CampaignDocumentTypeBean,
)
from cible.repository.campaign.repositories.campaign_repository import (
    CampaignRepository,
)


def get_campaign_documents_by_campaign_name(
    campaign_name, repository: ICampaignDocumentRepository
) -> list[CampaignDocumentBean]:
    campaign = CampaignRepository.get_campaign_by_name(
        campaign_name=campaign_name, self=CampaignRepository()
    )
    return repository.get_campaign_documents_by_campaign_name(campaign)


def get_campaign_documents_type(
    repository: ICampaignDocumentRepository,
) -> list[CampaignDocumentTypeBean]:
    return repository.get_campaign_documents_type()
