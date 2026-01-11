"""Mapper UsableStep - Conversion Entity ↔ Bean ↔ API."""
from typing import Any, Dict

from cible.domain.steps.models.usable_step_bean import UsableStepBean
from cible.repository.steps.models.usable_step_entity import UsableStepEntity


def usable_step_mapper_entity_to_bean(entity: UsableStepEntity) -> UsableStepBean:
    """Convertit une UsableStepEntity en UsableStepBean."""
    return UsableStepBean(
        uuid=str(entity.uuid),
        fsec_version_id=str(entity.fsec_version_id_id) if entity.fsec_version_id_id else "",
        delivery_date=entity.delivery_date,
        started_at=entity.started_at,
        completed_at=entity.completed_at,
        completed_by=str(entity.completed_by) if entity.completed_by else None,
        is_validated=entity.is_validated,
    )


def usable_step_mapper_bean_to_entity(bean: UsableStepBean) -> UsableStepEntity:
    """Convertit un UsableStepBean en UsableStepEntity."""
    entity = UsableStepEntity()
    if bean.uuid:
        entity.uuid = bean.uuid
    entity.fsec_version_id_id = bean.fsec_version_id
    entity.delivery_date = bean.delivery_date
    entity.started_at = bean.started_at
    entity.completed_at = bean.completed_at
    entity.completed_by = bean.completed_by
    entity.is_validated = bean.is_validated
    return entity


def usable_step_mapper_api_to_bean(data: Dict[str, Any]) -> UsableStepBean:
    """Convertit des données API en UsableStepBean."""
    from datetime import datetime

    return UsableStepBean(
        uuid=data.get("uuid", ""),
        fsec_version_id=data.get("fsec_version_id", ""),
        delivery_date=data.get("delivery_date"),
        started_at=datetime.fromisoformat(data["started_at"]) if data.get("started_at") else None,
        completed_at=datetime.fromisoformat(data["completed_at"]) if data.get("completed_at") else None,
        completed_by=data.get("completed_by"),
        is_validated=data.get("is_validated", False),
    )


def usable_step_mapper_bean_to_api(bean: UsableStepBean) -> Dict[str, Any]:
    """Convertit un UsableStepBean en données API."""
    return {
        "uuid": bean.uuid,
        "fsec_version_id": bean.fsec_version_id,
        "delivery_date": bean.delivery_date.isoformat() if bean.delivery_date else None,
        "started_at": bean.started_at.isoformat() if bean.started_at else None,
        "completed_at": bean.completed_at.isoformat() if bean.completed_at else None,
        "completed_by": bean.completed_by,
        "is_validated": bean.is_validated,
    }
