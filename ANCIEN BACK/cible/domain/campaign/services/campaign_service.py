from cible.domain.campaign.interface.i_campaign_repository import ICampaignRepository
from cible.domain.campaign.models.campaign_bean import CampaignBean
from cible.domain.campaign.models.referential.campaign_status_bean import (
    CampaignStatusBean,
)
from cible.exceptions.conflict_exception import ConflictException
from cible.exceptions.date_exception import DateException
from cible.exceptions.missing_data_exception import MissingDataException


def get_all_campaigns(repository: ICampaignRepository) -> list[CampaignBean]:
    return repository.get_all_campaigns()


def get_campaign_by_name(
    campaign_name: str, repository: ICampaignRepository
) -> CampaignBean:
    return repository.get_campaign_by_name(campaign_name)


def create_campaign(
    repository: ICampaignRepository, campaign: CampaignBean
) -> CampaignBean:
    if (
        campaign.startDate is not None
        and campaign.endDate is not None
        and campaign.startDate > campaign.endDate
    ):
        raise DateException(
            "Date",
            f"{campaign.startDate} {campaign.endDate}",
        )

    mandatory_fields = {
        "nom": campaign.name,
        "semestre": campaign.semester,
        "année": campaign.year,
        "type": campaign.type,
        "installation": campaign.installation,
    }

    for field, value in mandatory_fields.items():
        if value is None:
            raise MissingDataException(field)

    if campaign.toBeDuplicated:
        buffer_name = repository.calculate_campaign_increment(campaign.name)
        if buffer_name != 0:
            campaign.name = buffer_name

    campaign_exists = repository.does_campaign_exist_by_name_year_and_semester(
        campaign.name, campaign.year, campaign.semester
    )

    if campaign_exists:
        raise ConflictException(
            "campagne", f"{campaign.name} - {campaign.semester} - {campaign.year}"
        )

    campaign.status = CampaignStatusBean(id=0)

    return repository.create_campaign(campaign)


def update_campaign(
    repository: ICampaignRepository, campaign: CampaignBean
) -> CampaignBean:
    return repository.update_campaign(campaign)


def delete_campaign(uuid: str, repository: ICampaignRepository) -> None:
    return repository.delete_campaign(uuid)


def does_campaign_exist_by_name_year_and_semester(
    name: str, year: int, semester: str, repository: ICampaignRepository
) -> bool:
    return repository.does_campaign_exist_by_name_year_and_semester(
        name, year, semester
    )
