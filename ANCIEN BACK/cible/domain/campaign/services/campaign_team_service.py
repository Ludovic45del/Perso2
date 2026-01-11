from cible.domain.campaign.interface.i_campaign_team_repository import (
    ICampaignTeamRepository,
)
from cible.domain.campaign.models.campaign_team_bean import CampaignTeamBean


def get_campaign_team_by_campaign(
    campaign_uuid, repository: ICampaignTeamRepository
) -> list[CampaignTeamBean]:
    return repository.get_campaign_team_by_campaign(campaign_uuid)
