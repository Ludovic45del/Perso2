"""Mapper MetrologyStep - Conversion Entity ↔ Bean ↔ API."""
from typing import Any, Dict

from cible.domain.steps.models.metrology_step_bean import MetrologyStepBean
from cible.repository.steps.models.metrology_step_entity import MetrologyStepEntity


def metrology_step_mapper_entity_to_bean(entity: MetrologyStepEntity) -> MetrologyStepBean:
    """Convertit une MetrologyStepEntity en MetrologyStepBean."""
    return MetrologyStepBean(
        uuid=str(entity.uuid),
        fsec_version_id=str(entity.fsec_version_id_id) if entity.fsec_version_id_id else "",
        machine_id=entity.machine_id_id if entity.machine_id_id else None,
        date=entity.date,
        comments=entity.comments,
        started_at=entity.started_at,
        completed_at=entity.completed_at,
        completed_by=str(entity.completed_by) if entity.completed_by else None,
        is_validated=entity.is_validated,
    )


def metrology_step_mapper_bean_to_entity(bean: MetrologyStepBean) -> MetrologyStepEntity:
    """Convertit un MetrologyStepBean en MetrologyStepEntity."""
    entity = MetrologyStepEntity()
    if bean.uuid:
        entity.uuid = bean.uuid
    entity.fsec_version_id_id = bean.fsec_version_id
    entity.machine_id_id = bean.machine_id
    entity.date = bean.date
    entity.comments = bean.comments
    entity.started_at = bean.started_at
    entity.completed_at = bean.completed_at
    entity.completed_by = bean.completed_by
    entity.is_validated = bean.is_validated
    return entity


def metrology_step_mapper_api_to_bean(data: Dict[str, Any]) -> MetrologyStepBean:
    """Convertit des données API en MetrologyStepBean."""
    from datetime import datetime

    return MetrologyStepBean(
        uuid=data.get("uuid", ""),
        fsec_version_id=data.get("fsec_version_id", ""),
        machine_id=data.get("machine_id"),
        date=data.get("date"),
        comments=data.get("comments"),
        started_at=datetime.fromisoformat(data["started_at"]) if data.get("started_at") else None,
        completed_at=datetime.fromisoformat(data["completed_at"]) if data.get("completed_at") else None,
        completed_by=data.get("completed_by"),
        is_validated=data.get("is_validated", False),
    )


def metrology_step_mapper_bean_to_api(bean: MetrologyStepBean) -> Dict[str, Any]:
    """Convertit un MetrologyStepBean en données API."""
    return {
        "uuid": bean.uuid,
        "fsec_version_id": bean.fsec_version_id,
        "machine_id": bean.machine_id,
        "date": bean.date.isoformat() if bean.date else None,
        "comments": bean.comments,
        "started_at": bean.started_at.isoformat() if bean.started_at else None,
        "completed_at": bean.completed_at.isoformat() if bean.completed_at else None,
        "completed_by": bean.completed_by,
        "is_validated": bean.is_validated,
    }
