import abc

from cible.domain.campaign.models.campaign_bean import CampaignTypeBean


class ICampaignTypeRepository:

    @abc.abstractmethod
    def get_campaign_types(self) -> list[CampaignTypeBean]:
        raise NotImplementedError
