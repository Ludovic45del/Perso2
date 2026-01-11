from cible.domain.campaign.interface.i_campaign_status_repository import (
    ICampaignStatusRepository,
)
from cible.domain.campaign.models.referential.campaign_status_bean import (
    CampaignStatusBean,
)
from cible.mapper.campaign.campaign_mapper import campaign_status_mapper_entity_to_bean
from cible.repository.campaign.models.referential.campaign_status import (
    CampaignStatusEntity,
)


class CampaignStatusRepository(ICampaignStatusRepository):

    def get_campaign_status(self) -> list[CampaignStatusBean]:
        types = CampaignStatusEntity.objects.all()
        if len(types) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: campaign_status_mapper_entity_to_bean(x),
                    types,
                )
            )
