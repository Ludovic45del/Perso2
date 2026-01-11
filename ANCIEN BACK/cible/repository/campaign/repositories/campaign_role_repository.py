from cible.domain.campaign.interface.i_campaign_role_repository import (
    ICampaignRoleRepository,
)
from cible.domain.campaign.models.referential.campaign_role_bean import CampaignRoleBean
from cible.mapper.campaign.campaign_team_mapper import (
    campaign_role_mapper_entity_to_bean,
)
from cible.repository.campaign.models.referential.campaign_role import (
    CampaignRoleEntity,
)


class CampaignRoleRepository(ICampaignRoleRepository):

    def get_campaign_roles(self) -> list[CampaignRoleBean]:
        roles = CampaignRoleEntity.objects.all()
        if len(roles) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: campaign_role_mapper_entity_to_bean(x),
                    roles,
                )
            )
