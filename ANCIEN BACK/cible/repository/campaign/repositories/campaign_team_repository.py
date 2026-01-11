from cible.domain.campaign.interface.i_campaign_team_repository import (
    ICampaignTeamRepository,
)
from cible.domain.campaign.models.campaign_team_bean import CampaignTeamBean
from cible.mapper.campaign.campaign_team_mapper import (
    campaign_team_mapper_entity_to_bean,
)
from cible.repository.campaign.models.campaign_team import CampaignTeamEntity


class CampaignTeamRepository(ICampaignTeamRepository):

    def get_campaign_team_by_campaign(self, campaign_uuid) -> list[CampaignTeamBean]:
        campaigns_team = CampaignTeamEntity.objects.filter(campaign_uuid=campaign_uuid)
        if len(campaigns_team) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: campaign_team_mapper_entity_to_bean(x),
                    campaigns_team,
                )
            )
