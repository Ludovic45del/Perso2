import abc

from cible.domain.campaign.models.campaign_bean import CampaignBean


class ICampaignRepository:

    @abc.abstractmethod
    def get_all_campaigns(self) -> list[CampaignBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_campaign_by_name(self, campaign_name) -> CampaignBean:
        raise NotImplementedError

    @abc.abstractmethod
    def create_campaign(self, campaign: CampaignBean) -> CampaignBean:
        raise NotImplementedError

    @abc.abstractmethod
    def update_campaign(self, campaign: CampaignBean) -> CampaignBean:
        raise NotImplementedError

    @abc.abstractmethod
    def delete_campaign(self, uuid) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def does_campaign_exist_by_name_year_and_semester(
        self, name, year, semester
    ) -> bool:
        raise NotImplementedError

    @abc.abstractmethod
    def calculate_campaign_increment(self, name) -> str:
        raise NotImplementedError
