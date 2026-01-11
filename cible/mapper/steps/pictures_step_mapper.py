"""Mapper PicturesStep - Conversion Entity ↔ Bean ↔ API."""
from typing import Any, Dict

from cible.domain.steps.models.pictures_step_bean import PicturesStepBean
from cible.repository.steps.models.pictures_step_entity import PicturesStepEntity


def pictures_step_mapper_entity_to_bean(entity: PicturesStepEntity) -> PicturesStepBean:
    """Convertit une PicturesStepEntity en PicturesStepBean."""
    return PicturesStepBean(
        uuid=str(entity.uuid),
        fsec_version_id=str(entity.fsec_version_id_id) if entity.fsec_version_id_id else "",
        last_updated=entity.last_updated,
        comments=entity.comments,
        started_at=entity.started_at,
        completed_at=entity.completed_at,
        completed_by=str(entity.completed_by) if entity.completed_by else None,
        is_validated=entity.is_validated,
    )


def pictures_step_mapper_bean_to_entity(bean: PicturesStepBean) -> PicturesStepEntity:
    """Convertit un PicturesStepBean en PicturesStepEntity."""
    entity = PicturesStepEntity()
    if bean.uuid:
        entity.uuid = bean.uuid
    entity.fsec_version_id_id = bean.fsec_version_id
    entity.last_updated = bean.last_updated
    entity.comments = bean.comments
    entity.started_at = bean.started_at
    entity.completed_at = bean.completed_at
    entity.completed_by = bean.completed_by
    entity.is_validated = bean.is_validated
    return entity


def pictures_step_mapper_api_to_bean(data: Dict[str, Any]) -> PicturesStepBean:
    """Convertit des données API en PicturesStepBean."""
    from datetime import datetime

    return PicturesStepBean(
        uuid=data.get("uuid", ""),
        fsec_version_id=data.get("fsec_version_id", ""),
        last_updated=data.get("last_updated"),
        comments=data.get("comments"),
        started_at=datetime.fromisoformat(data["started_at"]) if data.get("started_at") else None,
        completed_at=datetime.fromisoformat(data["completed_at"]) if data.get("completed_at") else None,
        completed_by=data.get("completed_by"),
        is_validated=data.get("is_validated", False),
    )


def pictures_step_mapper_bean_to_api(bean: PicturesStepBean) -> Dict[str, Any]:
    """Convertit un PicturesStepBean en données API."""
    return {
        "uuid": bean.uuid,
        "fsec_version_id": bean.fsec_version_id,
        "last_updated": bean.last_updated.isoformat() if bean.last_updated else None,
        "comments": bean.comments,
        "started_at": bean.started_at.isoformat() if bean.started_at else None,
        "completed_at": bean.completed_at.isoformat() if bean.completed_at else None,
        "completed_by": bean.completed_by,
        "is_validated": bean.is_validated,
    }
