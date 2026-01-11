from cible.domain.campaign.interface.i_campaign_installation_repository import (
    ICampaignInstallationRepository,
)
from cible.domain.campaign.models.referential.campaign_installation_bean import (
    CampaignInstallationBean,
)
from cible.mapper.campaign.campaign_mapper import (
    campaign_installation_mapper_entity_to_bean,
)
from cible.repository.campaign.models.referential.campaign_installation import (
    CampaignInstallationEntity,
)


class CampaignInstallationRepository(ICampaignInstallationRepository):

    def get_campaign_installations(self) -> list[CampaignInstallationBean]:
        types = CampaignInstallationEntity.objects.all()
        if len(types) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: campaign_installation_mapper_entity_to_bean(x),
                    types,
                )
            )
