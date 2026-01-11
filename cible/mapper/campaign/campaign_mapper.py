"""Mapper Campaign - Conversion Entity ↔ Bean ↔ API."""
from typing import Any, Dict

from cible.domain.campaign.models.campaign_bean import CampaignBean
from cible.mapper.utils import parse_date_string
from cible.repository.campaign.models.campaign_entity import CampaignEntity


def campaign_mapper_entity_to_bean(entity: CampaignEntity) -> CampaignBean:
    """Convertit une CampaignEntity en CampaignBean."""
    return CampaignBean(
        uuid=str(entity.uuid),
        type_id=entity.type_id_id if entity.type_id_id is not None else None,
        status_id=entity.status_id_id if entity.status_id_id is not None else None,
        installation_id=entity.installation_id_id if entity.installation_id_id is not None else None,
        name=entity.name,
        year=entity.year,
        semester=entity.semester,
        last_updated=entity.last_updated,
        start_date=entity.start_date,
        end_date=entity.end_date,
        dtri_number=entity.dtri_number,
        description=entity.description,
    )


def campaign_mapper_bean_to_entity(bean: CampaignBean) -> CampaignEntity:
    """Convertit un CampaignBean en CampaignEntity."""
    entity = CampaignEntity()
    if bean.uuid:
        entity.uuid = bean.uuid
    entity.type_id_id = bean.type_id
    entity.status_id_id = bean.status_id
    entity.installation_id_id = bean.installation_id
    entity.name = bean.name
    entity.year = bean.year
    entity.semester = bean.semester
    entity.start_date = bean.start_date
    entity.end_date = bean.end_date
    entity.dtri_number = bean.dtri_number
    entity.description = bean.description
    return entity


def campaign_mapper_api_to_bean(data: Dict[str, Any]) -> CampaignBean:
    """Convertit des données API en CampaignBean."""
    return CampaignBean(
        uuid=data.get("uuid", ""),
        type_id=data.get("type_id"),
        status_id=data.get("status_id"),
        installation_id=data.get("installation_id"),
        name=data.get("name", ""),
        year=data.get("year", 0),
        semester=data.get("semester", ""),
        start_date=parse_date_string(data.get("start_date")),
        end_date=parse_date_string(data.get("end_date")),
        dtri_number=data.get("dtri_number"),
        description=data.get("description"),
    )


def campaign_mapper_bean_to_api(bean: CampaignBean) -> Dict[str, Any]:
    """Convertit un CampaignBean en données API."""
    return {
        "uuid": bean.uuid,
        "type_id": bean.type_id,
        "status_id": bean.status_id,
        "installation_id": bean.installation_id,
        "name": bean.name,
        "year": bean.year,
        "semester": bean.semester,
        "last_updated": bean.last_updated.isoformat() if bean.last_updated else None,
        "start_date": bean.start_date.isoformat() if bean.start_date else None,
        "end_date": bean.end_date.isoformat() if bean.end_date else None,
        "dtri_number": bean.dtri_number,
        "description": bean.description,
    }
