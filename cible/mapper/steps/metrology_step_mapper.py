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
    return entity


def metrology_step_mapper_api_to_bean(data: Dict[str, Any]) -> MetrologyStepBean:
    """Convertit des données API en MetrologyStepBean."""
    return MetrologyStepBean(
        uuid=data.get("uuid", ""),
        fsec_version_id=data.get("fsec_version_id", ""),
        machine_id=data.get("machine_id"),
        date=data.get("date"),
        comments=data.get("comments"),
    )


def metrology_step_mapper_bean_to_api(bean: MetrologyStepBean) -> Dict[str, Any]:
    """Convertit un MetrologyStepBean en données API."""
    return {
        "uuid": bean.uuid,
        "fsec_version_id": bean.fsec_version_id,
        "machine_id": bean.machine_id,
        "date": bean.date.isoformat() if bean.date else None,
        "comments": bean.comments,
    }
