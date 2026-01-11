import abc

from cible.domain.campaign.models.campaign_bean import CampaignTeamBean


class ICampaignTeamRepository:

    @abc.abstractmethod
    def get_campaign_team_by_campaign(
        self, campaign_uuid: str
    ) -> list[CampaignTeamBean]:
        raise NotImplementedError
