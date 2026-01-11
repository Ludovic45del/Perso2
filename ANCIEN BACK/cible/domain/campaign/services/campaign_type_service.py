from cible.domain.campaign.interface.i_campaign_type_repository import (
    ICampaignTypeRepository,
)
from cible.domain.campaign.models.campaign_bean import CampaignTypeBean


def get_campaign_types(repository: ICampaignTypeRepository) -> list[CampaignTypeBean]:
    return repository.get_campaign_types()
