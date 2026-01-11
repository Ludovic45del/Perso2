from cible.domain.campaign.interface.i_campaign_installation_repository import (
    ICampaignInstallationRepository,
)
from cible.domain.campaign.models.referential.campaign_installation_bean import (
    CampaignInstallationBean,
)


def get_campaign_installations(
    repository: ICampaignInstallationRepository,
) -> list[CampaignInstallationBean]:
    return repository.get_campaign_installations()
