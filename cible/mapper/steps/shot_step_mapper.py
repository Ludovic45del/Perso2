"""Mapper ShotStep - Conversion Entity ↔ Bean ↔ API."""
from typing import Any, Dict

from cible.domain.steps.models.shot_step_bean import ShotStepBean
from cible.repository.steps.models.shot_step_entity import ShotStepEntity


def shot_step_mapper_entity_to_bean(entity: ShotStepEntity) -> ShotStepBean:
    """Convertit une ShotStepEntity en ShotStepBean."""
    return ShotStepBean(
        uuid=str(entity.uuid),
        fsec_version_id=str(entity.fsec_version_id_id) if entity.fsec_version_id_id else "",
        shot_date=entity.shot_date,
        shot_reference=entity.shot_reference,
        shot_parameters=entity.shot_parameters if entity.shot_parameters else {},
        shot_successful=entity.shot_successful,
        result_summary=entity.result_summary,
        started_at=entity.started_at,
        completed_at=entity.completed_at,
        completed_by=str(entity.completed_by) if entity.completed_by else None,
        is_validated=entity.is_validated,
    )


def shot_step_mapper_bean_to_entity(bean: ShotStepBean) -> ShotStepEntity:
    """Convertit un ShotStepBean en ShotStepEntity."""
    entity = ShotStepEntity()
    if bean.uuid:
        entity.uuid = bean.uuid
    entity.fsec_version_id_id = bean.fsec_version_id
    entity.shot_date = bean.shot_date
    entity.shot_reference = bean.shot_reference
    entity.shot_parameters = bean.shot_parameters
    entity.shot_successful = bean.shot_successful
    entity.result_summary = bean.result_summary
    entity.started_at = bean.started_at
    entity.completed_at = bean.completed_at
    entity.completed_by = bean.completed_by
    entity.is_validated = bean.is_validated
    return entity


def shot_step_mapper_api_to_bean(data: Dict[str, Any]) -> ShotStepBean:
    """Convertit des données API en ShotStepBean."""
    from datetime import datetime

    return ShotStepBean(
        uuid=data.get("uuid", ""),
        fsec_version_id=data.get("fsec_version_id", ""),
        shot_date=data.get("shot_date"),
        shot_reference=data.get("shot_reference"),
        shot_parameters=data.get("shot_parameters", {}),
        shot_successful=data.get("shot_successful", False),
        result_summary=data.get("result_summary"),
        started_at=datetime.fromisoformat(data["started_at"]) if data.get("started_at") else None,
        completed_at=datetime.fromisoformat(data["completed_at"]) if data.get("completed_at") else None,
        completed_by=data.get("completed_by"),
        is_validated=data.get("is_validated", False),
    )


def shot_step_mapper_bean_to_api(bean: ShotStepBean) -> Dict[str, Any]:
    """Convertit un ShotStepBean en données API."""
    return {
        "uuid": bean.uuid,
        "fsec_version_id": bean.fsec_version_id,
        "shot_date": bean.shot_date.isoformat() if bean.shot_date else None,
        "shot_reference": bean.shot_reference,
        "shot_parameters": bean.shot_parameters,
        "shot_successful": bean.shot_successful,
        "result_summary": bean.result_summary,
        "started_at": bean.started_at.isoformat() if bean.started_at else None,
        "completed_at": bean.completed_at.isoformat() if bean.completed_at else None,
        "completed_by": bean.completed_by,
        "is_validated": bean.is_validated,
    }
