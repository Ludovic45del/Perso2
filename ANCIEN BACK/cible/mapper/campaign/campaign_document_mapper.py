from django.utils import timezone
from django.utils.dateformat import datetime

from cible.domain.campaign.models.campaign_document_bean import CampaignDocumentBean
from cible.domain.campaign.models.referential.campaign_document_subtype_bean import (
    CampaignDocumentSubtypeBean,
)
from cible.domain.campaign.models.referential.campaign_document_type_bean import (
    CampaignDocumentTypeBean,
)
from cible.repository.campaign.models.campaign_documents import CampaignDocumentEntity
from cible.repository.campaign.models.referential.campaign_document_subtype import (
    CampaignDocumentSubtypeEntity,
)
from cible.repository.campaign.models.referential.campaign_document_type import (
    CampaignDocumentTypeEntity,
)


def campaign_document_type_mapper_entity_to_bean(
    campaign_document_type_entity: CampaignDocumentTypeEntity,
) -> CampaignDocumentTypeBean:
    return CampaignDocumentTypeBean(
        id=campaign_document_type_entity.id, label=campaign_document_type_entity.label
    )


def campaign_document_type_mapper_bean_to_entity(
    campaign_document_type_bean: CampaignDocumentTypeBean,
) -> CampaignDocumentTypeEntity:
    return CampaignDocumentTypeEntity(
        id=campaign_document_type_bean.id, label=campaign_document_type_bean.label
    )


def campaign_document_subtype_mapper_entity_to_bean(
    campaign_document_subtype_entity: CampaignDocumentSubtypeEntity,
) -> CampaignDocumentSubtypeBean:
    return CampaignDocumentSubtypeBean(
        id=campaign_document_subtype_entity.id,
        label=campaign_document_subtype_entity.label,
    )


def campaign_document_subtype_mapper_bean_to_entity(
    campaign_document_subtype_bean: CampaignDocumentSubtypeBean,
    campaign_document_type_bean: CampaignDocumentTypeBean,
) -> CampaignDocumentSubtypeEntity:
    return CampaignDocumentSubtypeEntity(
        id=campaign_document_subtype_bean.id,
        label=campaign_document_subtype_bean.label,
        type=campaign_document_type_mapper_bean_to_entity(campaign_document_type_bean),
    )


def campaign_document_mapper_entity_to_bean(
    campaign_document_entity: CampaignDocumentEntity,
) -> CampaignDocumentBean:
    return CampaignDocumentBean(
        uuid=str(campaign_document_entity.uuid),
        campaign_uuid=str(campaign_document_entity.campaign_uuid),
        type=campaign_document_type_mapper_entity_to_bean(
            campaign_document_entity.type
        ),
        subtype=campaign_document_subtype_mapper_entity_to_bean(
            campaign_document_entity.subtype
        ),
        name=campaign_document_entity.name,
        path=campaign_document_entity.path,
        date=(
            str(campaign_document_entity.date)
            if campaign_document_entity.date
            else None
        ),
    )


def campaign_document_mapper_bean_to_entity(
    campaign_document_bean: CampaignDocumentBean,
) -> CampaignDocumentEntity:
    return CampaignDocumentEntity(
        uuid=str(campaign_document_bean.uuid) if campaign_document_bean.uuid else None,
        campaign_uuid=(
            str(campaign_document_bean.campaign_uuid)
            if campaign_document_bean.campaign_uuid
            else None
        ),
        subtype=campaign_document_subtype_mapper_bean_to_entity(
            campaign_document_bean.subtype,
            campaign_document_bean.type,
        ),
        name=campaign_document_bean.name,
        path=campaign_document_bean.path,
        date=timezone.now(),
    )


def campaign_document_type_mapper_api_to_bean(json: dict) -> CampaignDocumentTypeBean:
    return CampaignDocumentTypeBean(
        id=json["id"] if "id" in json else None,
        label=json["label"] if "label" in json else None,
    )


def campaign_document_subtype_mapper_api_to_bean(
    json: dict,
) -> CampaignDocumentSubtypeBean:
    return CampaignDocumentSubtypeBean(
        id=json["id"] if "id" in json else None,
        label=json["label"] if "label" in json else None,
    )


def campaign_document_mapper_api_to_bean(json: dict) -> CampaignDocumentBean:
    return CampaignDocumentBean(
        uuid=str(json["uuid"]) if "uuid" in json else None,
        campaign_uuid=str(json["campaign_uuid"]) if "campaign_uuid" in json else None,
        name=str(json["name"]).strip() if "name" in json else None,
        date=(
            datetime.fromisoformat(json["date"])
            if "date" in json and json["date"] is not None
            else None
        ),
        path=str(json["path"]).strip() if "path" in json else None,
        type=(
            campaign_document_type_mapper_api_to_bean(json["type"])
            if "type" in json and json["type"] is not None
            else None
        ),
        subtype=(
            campaign_document_subtype_mapper_api_to_bean(json["subtype"])
            if "subtype" in json and json["subtype"] is not None
            else None
        ),
    )
