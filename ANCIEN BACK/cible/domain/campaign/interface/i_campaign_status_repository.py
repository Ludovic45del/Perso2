import abc

from cible.domain.campaign.models.campaign_bean import CampaignStatusBean


class ICampaignStatusRepository:

    @abc.abstractmethod
    def get_campaign_status(self) -> list[CampaignStatusBean]:
        raise NotImplementedError
