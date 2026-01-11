"""Mapper Fsec - Conversion Entity ↔ Bean ↔ API."""
from typing import Any, Dict

from cible.domain.fsec.models.fsec_bean import FsecBean
from cible.mapper.utils import parse_date_string
from cible.repository.fsec.models.fsec_entity import FsecEntity


def fsec_mapper_entity_to_bean(entity: FsecEntity) -> FsecBean:
    """Convertit une FsecEntity en FsecBean."""
    return FsecBean(
        version_uuid=str(entity.version_uuid),
        fsec_uuid=str(entity.fsec_uuid),
        campaign_id=str(entity.campaign_id_id) if entity.campaign_id_id else None,
        status_id=entity.status_id_id if entity.status_id_id is not None else None,
        category_id=entity.category_id_id if entity.category_id_id is not None else None,
        rack_id=entity.rack_id_id if entity.rack_id_id is not None else None,
        name=entity.name,
        comments=entity.comments,
        last_updated=entity.last_updated,
        is_active=entity.is_active,
        created_at=entity.created_at,
        delivery_date=entity.delivery_date,
        shooting_date=entity.shooting_date,
        preshooting_pressure=entity.preshooting_pressure,
        experience_srxx=entity.experience_srxx,
        localisation=entity.localisation,
        depressurization_failed=entity.depressurization_failed,
        # Map relations (Lazy load or prefetch)
        teams=[
            {
                "uuid": str(t.uuid),
                "name": t.name,
                "role_id": t.role_id_id,
                "step_type": t.step_type,
                "step_uuid": str(t.step_uuid) if t.step_uuid else None
            } 
            for t in entity.teams.all()
        ],
        documents=[
            {
                "uuid": str(d.uuid),
                "name": d.name,
                "path": d.path,
                "subtype_id": d.subtype_id_id,
                "step_type": d.step_type,
                "step_uuid": str(d.step_uuid) if d.step_uuid else None
            } 
            for d in entity.documents.all()
        ],
    )


def fsec_mapper_bean_to_entity(bean: FsecBean) -> FsecEntity:
    """Convertit un FsecBean en FsecEntity."""
    entity = FsecEntity()
    if bean.version_uuid:
        entity.version_uuid = bean.version_uuid
    if bean.fsec_uuid:
        entity.fsec_uuid = bean.fsec_uuid
    entity.campaign_id_id = bean.campaign_id
    entity.status_id_id = bean.status_id
    entity.category_id_id = bean.category_id
    entity.rack_id_id = bean.rack_id
    entity.name = bean.name
    entity.comments = bean.comments
    entity.is_active = bean.is_active if bean.is_active is not None else True
    entity.delivery_date = bean.delivery_date
    entity.shooting_date = bean.shooting_date
    entity.preshooting_pressure = bean.preshooting_pressure
    entity.experience_srxx = bean.experience_srxx
    entity.localisation = bean.localisation
    entity.depressurization_failed = bean.depressurization_failed
    return entity


def fsec_mapper_api_to_bean(data: Dict[str, Any]) -> FsecBean:
    """Convertit des données API en FsecBean."""
    return FsecBean(
        version_uuid=data.get("version_uuid", ""),
        fsec_uuid=data.get("fsec_uuid", ""),
        campaign_id=data.get("campaign_id"),
        status_id=data.get("status_id"),
        category_id=data.get("category_id"),
        rack_id=data.get("rack_id"),
        name=data.get("name", ""),
        comments=data.get("comments"),
        is_active=data.get("is_active", True),
        delivery_date=parse_date_string(data.get("delivery_date")),
        shooting_date=parse_date_string(data.get("shooting_date")),
        preshooting_pressure=data.get("preshooting_pressure"),
        experience_srxx=data.get("experience_srxx"),
        localisation=data.get("localisation"),
        depressurization_failed=data.get("depressurization_failed"),
        teams=data.get("fsec_team", []),
        documents=data.get("fsec_documents", []),
    )


def fsec_mapper_bean_to_api(bean: FsecBean) -> Dict[str, Any]:
    """Convertit un FsecBean en données API."""
    return {
        "version_uuid": bean.version_uuid,
        "fsec_uuid": bean.fsec_uuid,
        "campaign_id": bean.campaign_id,
        "status_id": bean.status_id,
        "category_id": bean.category_id,
        "rack_id": bean.rack_id,
        "name": bean.name,
        "comments": bean.comments,
        "last_updated": bean.last_updated.isoformat() if bean.last_updated else None,
        "is_active": bean.is_active,
        "created_at": bean.created_at.isoformat() if bean.created_at else None,
        "delivery_date": bean.delivery_date.isoformat() if bean.delivery_date else None,
        "shooting_date": bean.shooting_date.isoformat() if bean.shooting_date else None,
        "preshooting_pressure": bean.preshooting_pressure,
        "experience_srxx": bean.experience_srxx,
        "localisation": bean.localisation,
        "depressurization_failed": bean.depressurization_failed,
        # Relations (flat or nested?)
        # Frontend expects camelCase in response usually or keeps snake_case?
        # The mapper converts to snake_case for API response.
        "fsec_team": bean.teams if bean.teams else [],
        "fsec_documents": bean.documents if bean.documents else [],
    }
