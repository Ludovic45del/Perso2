from dataclasses import dataclass

from cible.domain.campaign.models.referential.campaign_role_bean import CampaignRoleBean


@dataclass
class CampaignTeamBean:
    name: str
    role: CampaignRoleBean
    campaign_uuid: str
    uuid: str = None
