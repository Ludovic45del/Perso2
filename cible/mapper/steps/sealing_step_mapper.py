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
    )


def sealing_step_mapper_bean_to_entity(bean: SealingStepBean) -> SealingStepEntity:
    """Convertit un SealingStepBean en SealingStepEntity."""
    entity = SealingStepEntity()
    if bean.uuid:
        entity.uuid = bean.uuid
    entity.fsec_version_id_id = bean.fsec_version_id
    entity.interface_io = bean.interface_io
    entity.comments = bean.comments
    return entity


def sealing_step_mapper_api_to_bean(data: Dict[str, Any]) -> SealingStepBean:
    """Convertit des données API en SealingStepBean."""
    return SealingStepBean(
        uuid=data.get("uuid", ""),
        fsec_version_id=data.get("fsec_version_id", ""),
        interface_io=data.get("interface_io"),
        comments=data.get("comments"),
    )


def sealing_step_mapper_bean_to_api(bean: SealingStepBean) -> Dict[str, Any]:
    """Convertit un SealingStepBean en données API."""
    return {
        "uuid": bean.uuid,
        "fsec_version_id": bean.fsec_version_id,
        "interface_io": bean.interface_io,
        "comments": bean.comments,
    }
