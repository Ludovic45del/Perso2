from cible.domain.campaign.interface.i_campaign_status_repository import (
    ICampaignStatusRepository,
)
from cible.domain.campaign.models.referential.campaign_status_bean import (
    CampaignStatusBean,
)


def get_campaign_status(
    repository: ICampaignStatusRepository,
) -> list[CampaignStatusBean]:
    return repository.get_campaign_status()
