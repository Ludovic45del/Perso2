import abc

from cible.domain.campaign.models.referential.campaign_role_bean import CampaignRoleBean


class ICampaignRoleRepository:

    @abc.abstractmethod
    def get_campaign_roles(self) -> list[CampaignRoleBean]:
        raise NotImplementedError
