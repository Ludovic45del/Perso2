from cible.domain.campaign.interface.i_campaign_role_repository import (
    ICampaignRoleRepository,
)
from cible.domain.campaign.models.referential.campaign_role_bean import CampaignRoleBean


def get_campaign_roles(
    repository: ICampaignRoleRepository,
) -> list[CampaignRoleBean]:
    return repository.get_campaign_roles()
