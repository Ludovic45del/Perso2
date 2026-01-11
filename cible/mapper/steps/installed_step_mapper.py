"""Mapper InstalledStep - Conversion Entity ↔ Bean ↔ API."""
from typing import Any, Dict

from cible.domain.steps.models.installed_step_bean import InstalledStepBean
from cible.repository.steps.models.installed_step_entity import InstalledStepEntity


def installed_step_mapper_entity_to_bean(entity: InstalledStepEntity) -> InstalledStepBean:
    """Convertit une InstalledStepEntity en InstalledStepBean."""
    return InstalledStepBean(
        uuid=str(entity.uuid),
        fsec_version_id=str(entity.fsec_version_id_id) if entity.fsec_version_id_id else "",
        shooting_date=entity.shooting_date,
        preshooting_pressure=entity.preshooting_pressure,
        experience_srxx=entity.experience_srxx,
        started_at=entity.started_at,
        completed_at=entity.completed_at,
        completed_by=str(entity.completed_by) if entity.completed_by else None,
        is_validated=entity.is_validated,
    )


def installed_step_mapper_bean_to_entity(bean: InstalledStepBean) -> InstalledStepEntity:
    """Convertit un InstalledStepBean en InstalledStepEntity."""
    entity = InstalledStepEntity()
    if bean.uuid:
        entity.uuid = bean.uuid
    entity.fsec_version_id_id = bean.fsec_version_id
    entity.shooting_date = bean.shooting_date
    entity.preshooting_pressure = bean.preshooting_pressure
    entity.experience_srxx = bean.experience_srxx
    entity.started_at = bean.started_at
    entity.completed_at = bean.completed_at
    entity.completed_by = bean.completed_by
    entity.is_validated = bean.is_validated
    return entity


def installed_step_mapper_api_to_bean(data: Dict[str, Any]) -> InstalledStepBean:
    """Convertit des données API en InstalledStepBean."""
    from datetime import datetime

    return InstalledStepBean(
        uuid=data.get("uuid", ""),
        fsec_version_id=data.get("fsec_version_id", ""),
        shooting_date=data.get("shooting_date"),
        preshooting_pressure=data.get("preshooting_pressure"),
        experience_srxx=data.get("experience_srxx"),
        started_at=datetime.fromisoformat(data["started_at"]) if data.get("started_at") else None,
        completed_at=datetime.fromisoformat(data["completed_at"]) if data.get("completed_at") else None,
        completed_by=data.get("completed_by"),
        is_validated=data.get("is_validated", False),
    )


def installed_step_mapper_bean_to_api(bean: InstalledStepBean) -> Dict[str, Any]:
    """Convertit un InstalledStepBean en données API."""
    return {
        "uuid": bean.uuid,
        "fsec_version_id": bean.fsec_version_id,
        "shooting_date": bean.shooting_date.isoformat() if bean.shooting_date else None,
        "preshooting_pressure": bean.preshooting_pressure,
        "experience_srxx": bean.experience_srxx,
        "started_at": bean.started_at.isoformat() if bean.started_at else None,
        "completed_at": bean.completed_at.isoformat() if bean.completed_at else None,
        "completed_by": bean.completed_by,
        "is_validated": bean.is_validated,
    }
