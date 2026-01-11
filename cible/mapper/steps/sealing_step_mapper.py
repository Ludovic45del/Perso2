"""Mapper SealingStep - Conversion Entity ↔ Bean ↔ API."""
from typing import Any, Dict

from cible.domain.steps.models.sealing_step_bean import SealingStepBean
from cible.repository.steps.models.sealing_step_entity import SealingStepEntity


def sealing_step_mapper_entity_to_bean(entity: SealingStepEntity) -> SealingStepBean:
    """Convertit une SealingStepEntity en SealingStepBean."""
    return SealingStepBean(
        uuid=str(entity.uuid),
        fsec_version_id=str(entity.fsec_version_id_id) if entity.fsec_version_id_id else "",
        interface_io=entity.interface_io,
        comments=entity.comments,
        started_at=entity.started_at,
        completed_at=entity.completed_at,
        completed_by=str(entity.completed_by) if entity.completed_by else None,
        is_validated=entity.is_validated,
    )


def sealing_step_mapper_bean_to_entity(bean: SealingStepBean) -> SealingStepEntity:
    """Convertit un SealingStepBean en SealingStepEntity."""
    entity = SealingStepEntity()
    if bean.uuid:
        entity.uuid = bean.uuid
    entity.fsec_version_id_id = bean.fsec_version_id
    entity.interface_io = bean.interface_io
    entity.comments = bean.comments
    entity.started_at = bean.started_at
    entity.completed_at = bean.completed_at
    entity.completed_by = bean.completed_by
    entity.is_validated = bean.is_validated
    return entity


def sealing_step_mapper_api_to_bean(data: Dict[str, Any]) -> SealingStepBean:
    """Convertit des données API en SealingStepBean."""
    from datetime import datetime

    return SealingStepBean(
        uuid=data.get("uuid", ""),
        fsec_version_id=data.get("fsec_version_id", ""),
        interface_io=data.get("interface_io"),
        comments=data.get("comments"),
        started_at=datetime.fromisoformat(data["started_at"]) if data.get("started_at") else None,
        completed_at=datetime.fromisoformat(data["completed_at"]) if data.get("completed_at") else None,
        completed_by=data.get("completed_by"),
        is_validated=data.get("is_validated", False),
    )


def sealing_step_mapper_bean_to_api(bean: SealingStepBean) -> Dict[str, Any]:
    """Convertit un SealingStepBean en données API."""
    return {
        "uuid": bean.uuid,
        "fsec_version_id": bean.fsec_version_id,
        "interface_io": bean.interface_io,
        "comments": bean.comments,
        "started_at": bean.started_at.isoformat() if bean.started_at else None,
        "completed_at": bean.completed_at.isoformat() if bean.completed_at else None,
        "completed_by": bean.completed_by,
        "is_validated": bean.is_validated,
    }
