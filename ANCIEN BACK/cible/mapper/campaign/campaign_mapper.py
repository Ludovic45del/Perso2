from uuid import UUID

from django.utils import timezone

from cible.domain.campaign.models.campaign_bean import (
    CampaignBean,
    CampaignInstallationBean,
    CampaignStatusBean,
    CampaignTypeBean,
)
from cible.mapper.campaign.campaign_document_mapper import (
    campaign_document_mapper_api_to_bean,
    campaign_document_mapper_entity_to_bean,
)
from cible.mapper.campaign.campaign_team_mapper import (
    campaign_team_mapper_api_to_bean,
    campaign_team_mapper_entity_to_bean,
)
from cible.repository.campaign.models.campaign import (
    CampaignEntity,
    CampaignInstallationEntity,
    CampaignStatusEntity,
    CampaignTypeEntity,
)
from cible.repository.campaign.models.campaign_documents import CampaignDocumentEntity
from cible.repository.campaign.models.campaign_team import CampaignTeamEntity


def campaign_status_mapper_bean_to_entity(
    campaign_status_bean: CampaignStatusBean,
) -> CampaignStatusEntity:
    return CampaignStatusEntity(
        id=campaign_status_bean.id,
        label=campaign_status_bean.label,
        color=campaign_status_bean.color,
    )


def campaign_status_mapper_entity_to_bean(
    campaign_status_entity: CampaignStatusEntity,
) -> CampaignStatusBean:
    return CampaignStatusBean(
        id=campaign_status_entity.id,
        label=campaign_status_entity.label,
        color=campaign_status_entity.color,
    )


def campaign_type_mapper_bean_to_entity(
    campaign_type_bean: CampaignTypeBean,
) -> CampaignTypeEntity:
    return CampaignTypeEntity(
        id=campaign_type_bean.id,
        label=campaign_type_bean.label,
        color=campaign_type_bean.color,
    )


def campaign_type_mapper_entity_to_bean(
    campaign_type_entity: CampaignTypeEntity,
) -> CampaignTypeBean:
    return CampaignTypeBean(
        id=campaign_type_entity.id,
        label=campaign_type_entity.label,
        color=campaign_type_entity.color,
    )


def campaign_installation_mapper_bean_to_entity(
    campaign_installation_bean: CampaignInstallationBean,
) -> CampaignInstallationEntity:
    return CampaignInstallationEntity(
        id=campaign_installation_bean.id,
        label=campaign_installation_bean.label,
        color=campaign_installation_bean.color,
    )


def campaign_installation_mapper_entity_to_bean(
    campaign_installation_entity: CampaignInstallationEntity,
) -> CampaignInstallationBean:
    return CampaignInstallationBean(
        id=campaign_installation_entity.id,
        label=campaign_installation_entity.label,
        color=campaign_installation_entity.color,
    )


def campaign_mapper_entity_to_bean(
    campaign_entity: CampaignEntity,
) -> CampaignBean:
    return CampaignBean(
        uuid=str(campaign_entity.uuid),
        name=campaign_entity.name,
        year=campaign_entity.year,
        semester=campaign_entity.semester,
        lastUpdated=str(campaign_entity.last_updated),
        startDate=(
            str(campaign_entity.start_date) if campaign_entity.start_date else None
        ),
        endDate=(str(campaign_entity.end_date) if campaign_entity.end_date else None),
        dtriNumber=campaign_entity.dtri_number,
        description=campaign_entity.description,
        type=campaign_type_mapper_entity_to_bean(campaign_entity.type),
        status=campaign_status_mapper_entity_to_bean(campaign_entity.status),
        installation=campaign_installation_mapper_entity_to_bean(
            campaign_entity.installation
        ),
    )


def campaign_data_mapper_entity_to_bean(
    campaign_entity: CampaignEntity,
    campaign_documents_entity: [CampaignDocumentEntity],
    campaign_teams_entity: [CampaignTeamEntity],
) -> CampaignBean:
    return CampaignBean(
        uuid=str(campaign_entity.uuid),
        name=campaign_entity.name,
        year=campaign_entity.year,
        semester=campaign_entity.semester,
        lastUpdated=str(campaign_entity.last_updated),
        startDate=(
            str(campaign_entity.start_date) if campaign_entity.start_date else None
        ),
        endDate=(str(campaign_entity.end_date) if campaign_entity.end_date else None),
        dtriNumber=campaign_entity.dtri_number,
        description=campaign_entity.description,
        type=campaign_type_mapper_entity_to_bean(campaign_entity.type),
        status=campaign_status_mapper_entity_to_bean(campaign_entity.status),
        installation=campaign_installation_mapper_entity_to_bean(
            campaign_entity.installation
        ),
        campaignDocuments=list(
            map(
                lambda x: campaign_document_mapper_entity_to_bean(x),
                campaign_documents_entity,
            )
        ),
        campaignTeam=list(
            map(lambda x: campaign_team_mapper_entity_to_bean(x), campaign_teams_entity)
        ),
    )


def campaign_mapper_bean_to_entity(
    campaign_bean: CampaignBean,
) -> CampaignEntity:
    return CampaignEntity(
        uuid=UUID(campaign_bean.uuid) if campaign_bean.uuid else None,
        name=campaign_bean.name,
        year=campaign_bean.year,
        semester=campaign_bean.semester,
        last_updated=timezone.now(),
        start_date=(campaign_bean.startDate if campaign_bean.startDate else None),
        end_date=(campaign_bean.endDate if campaign_bean.endDate else None),
        dtri_number=campaign_bean.dtriNumber,
        description=campaign_bean.description,
        status=(
            campaign_status_mapper_bean_to_entity(campaign_bean.status)
            if campaign_bean.status is not None
            else None
        ),
        type=(
            campaign_type_mapper_bean_to_entity(campaign_bean.type)
            if campaign_bean.type is not None
            else None
        ),
        installation=(
            campaign_installation_mapper_bean_to_entity(campaign_bean.installation)
            if campaign_bean.installation is not None
            else None
        ),
    )


def campaign_type_mapper_api_to_bean(json: dict) -> CampaignTypeBean:
    return CampaignTypeBean(
        id=json["id"] if "id" in json else None,
        label=json["label"] if "label" in json else None,
        color=json["color"] if "color" in json else None,
    )


def campaign_installation_mapper_api_to_bean(json: dict) -> CampaignInstallationBean:
    return CampaignInstallationBean(
        id=json["id"] if "id" in json else None,
        label=json["label"] if "label" in json else None,
        color=json["color"] if "color" in json else None,
    )


def campaign_status_mapper_api_to_bean(json: dict) -> CampaignStatusBean:
    return CampaignStatusBean(
        id=json["id"] if "id" in json else None,
        label=json["label"] if "label" in json else None,
        color=json["color"] if "color" in json else None,
    )


def campaign_mapper_api_to_bean(json: dict) -> CampaignBean:
    return CampaignBean(
        uuid=json.get("uuid"),
        name=str(json["name"]).strip().upper(),
        startDate=(
            json["startDate"][:10]
            if "startDate" in json and json["startDate"] is not None
            else None
        ),
        endDate=(
            json["endDate"][:10]
            if "endDate" in json and json["endDate"] is not None
            else None
        ),
        description=str(json["goal"]).strip() if "goal" in json else None,
        year=int(json["year"]),
        semester=json["semester"] if "semester" in json else None,
        status=(
            campaign_status_mapper_api_to_bean(json["status"])
            if "status" in json and json["status"] is not None
            else None
        ),
        type=(
            campaign_type_mapper_api_to_bean(json["type"])
            if "type" in json and json["type"] is not None
            else None
        ),
        installation=(
            campaign_installation_mapper_api_to_bean(json["installation"])
            if "installation" in json and json["installation"] is not None
            else None
        ),
        lastUpdated=json["lastUpdated"] if "lastUpdated" in json else None,
        dtriNumber=json["dtriNumber"] if "dtriNumber" in json else None,
        campaignTeam=list(
            map(
                lambda x: campaign_team_mapper_api_to_bean(x),
                json.get("campaignTeam") or [],
            )
        ),
        campaignDocuments=list(
            map(
                lambda x: campaign_document_mapper_api_to_bean(x),
                json.get("campaignDocuments") or [],
            )
        ),
        toBeDuplicated=json["toBeDuplicated"] if "toBeDuplicated" in json else None,
    )
