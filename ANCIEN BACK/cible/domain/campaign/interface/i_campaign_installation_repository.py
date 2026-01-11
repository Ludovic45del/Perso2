import abc

from cible.domain.campaign.models.referential.campaign_installation_bean import (
    CampaignInstallationBean,
)


class ICampaignInstallationRepository:

    @abc.abstractmethod
    def get_campaign_installations(self) -> list[CampaignInstallationBean]:
        raise NotImplementedError
