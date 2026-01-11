from cible.domain.campaign.interface.i_campaign_type_repository import (
    ICampaignTypeRepository,
)
from cible.domain.campaign.models.campaign_bean import CampaignTypeBean
from cible.mapper.campaign.campaign_mapper import campaign_type_mapper_entity_to_bean
from cible.repository.campaign.models.campaign import CampaignTypeEntity


class CampaignTypeRepository(ICampaignTypeRepository):

    def get_campaign_types(self) -> list[CampaignTypeBean]:
        types = CampaignTypeEntity.objects.all()
        if len(types) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: campaign_type_mapper_entity_to_bean(x),
                    types,
                )
            )
