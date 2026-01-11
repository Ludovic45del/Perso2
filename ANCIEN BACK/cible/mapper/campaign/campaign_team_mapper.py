from uuid import UUID

from cible.domain.campaign.models.campaign_bean import CampaignTeamBean
from cible.domain.campaign.models.referential.campaign_role_bean import CampaignRoleBean
from cible.repository.campaign.models.campaign_team import CampaignTeamEntity
from cible.repository.campaign.models.referential.campaign_role import (
    CampaignRoleEntity,
)


def campaign_role_mapper_entity_to_bean(
    campaign_role_entity: CampaignRoleEntity,
) -> CampaignRoleBean:
    return CampaignRoleBean(
        id=campaign_role_entity.id, label=campaign_role_entity.label
    )


def campaign_role_mapper_bean_to_entity(
    campaign_role_bean: CampaignRoleBean,
) -> CampaignRoleEntity:
    return CampaignRoleEntity(id=campaign_role_bean.id, label=campaign_role_bean.label)


def campaign_team_mapper_bean_to_entity(
    campaign_team_bean: CampaignTeamBean,
) -> CampaignTeamEntity:
    return CampaignTeamEntity(
        uuid=UUID(campaign_team_bean.uuid) if campaign_team_bean.uuid else None,
        name=campaign_team_bean.name,
        role=campaign_role_mapper_bean_to_entity(campaign_team_bean.role),
        campaign_uuid=(
            UUID(campaign_team_bean.campaign_uuid)
            if campaign_team_bean.campaign_uuid
            else None
        ),
    )


def campaign_team_mapper_entity_to_bean(
    campaign_team_entity: CampaignTeamEntity,
) -> CampaignTeamBean:
    return CampaignTeamBean(
        uuid=str(campaign_team_entity.uuid),
        name=campaign_team_entity.name,
        role=campaign_role_mapper_entity_to_bean(campaign_team_entity.role),
        campaign_uuid=str(campaign_team_entity.campaign_uuid),
    )


def campaign_team_role_mapper_api_to_bean(json: dict) -> CampaignRoleBean:
    return CampaignRoleBean(
        id=json["id"] if "id" in json else None,
        label=json["label"] if "label" in json else None,
    )


def campaign_team_mapper_api_to_bean(json: dict) -> CampaignTeamBean:
    return CampaignTeamBean(
        uuid=json["uuid"] if "uuid" in json else None,
        campaign_uuid=json["campaign_uuid"] if "campaign_uuid" in json else None,
        name=str(json["name"]).strip() if "name" in json else None,
        role=(
            campaign_team_role_mapper_api_to_bean(json["role"])
            if "role" in json
            else None
        ),
    )
