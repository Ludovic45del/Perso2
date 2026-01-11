"""Mapper DesignStep - Conversion Entity ↔ Bean ↔ API."""
from typing import Any, Dict

from cible.domain.steps.models.design_step_bean import DesignStepBean
from cible.repository.steps.models.design_step_entity import DesignStepEntity


def design_step_mapper_entity_to_bean(entity: DesignStepEntity) -> DesignStepBean:
    """Convertit une DesignStepEntity en DesignStepBean."""
    return DesignStepBean(
        uuid=str(entity.uuid),
        fsec_version_id=str(entity.fsec_version_id_id) if entity.fsec_version_id_id else "",
        drawing_reference=entity.drawing_reference,
        specifications=entity.specifications,
        notes=entity.notes,
        comments=entity.comments,
        started_at=entity.started_at,
        completed_at=entity.completed_at,
        completed_by=str(entity.completed_by) if entity.completed_by else None,
        is_validated=entity.is_validated,
    )


def design_step_mapper_bean_to_entity(bean: DesignStepBean) -> DesignStepEntity:
    """Convertit un DesignStepBean en DesignStepEntity."""
    entity = DesignStepEntity()
    if bean.uuid:
        entity.uuid = bean.uuid
    entity.fsec_version_id_id = bean.fsec_version_id
    entity.drawing_reference = bean.drawing_reference
    entity.specifications = bean.specifications
    entity.notes = bean.notes
    entity.comments = bean.comments
    entity.started_at = bean.started_at
    entity.completed_at = bean.completed_at
    entity.completed_by = bean.completed_by
    entity.is_validated = bean.is_validated
    return entity


def design_step_mapper_api_to_bean(data: Dict[str, Any]) -> DesignStepBean:
    """Convertit des données API en DesignStepBean."""
    from datetime import datetime

    return DesignStepBean(
        uuid=data.get("uuid", ""),
        fsec_version_id=data.get("fsec_version_id", ""),
        drawing_reference=data.get("drawing_reference"),
        specifications=data.get("specifications"),
        notes=data.get("notes"),
        comments=data.get("comments"),
        started_at=datetime.fromisoformat(data["started_at"]) if data.get("started_at") else None,
        completed_at=datetime.fromisoformat(data["completed_at"]) if data.get("completed_at") else None,
        completed_by=data.get("completed_by"),
        is_validated=data.get("is_validated", False),
    )


def design_step_mapper_bean_to_api(bean: DesignStepBean) -> Dict[str, Any]:
    """Convertit un DesignStepBean en données API."""
    return {
        "uuid": bean.uuid,
        "fsec_version_id": bean.fsec_version_id,
        "drawing_reference": bean.drawing_reference,
        "specifications": bean.specifications,
        "notes": bean.notes,
        "comments": bean.comments,
        "started_at": bean.started_at.isoformat() if bean.started_at else None,
        "completed_at": bean.completed_at.isoformat() if bean.completed_at else None,
        "completed_by": bean.completed_by,
        "is_validated": bean.is_validated,
    }
