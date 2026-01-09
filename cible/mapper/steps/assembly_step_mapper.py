"""Mapper AssemblyStep - Conversion Entity ↔ Bean ↔ API."""
from typing import Any, Dict, List

from cible.domain.steps.models.assembly_step_bean import AssemblyStepBean
from cible.repository.steps.models.assembly_step_entity import AssemblyStepEntity


def assembly_step_mapper_entity_to_bean(entity: AssemblyStepEntity) -> AssemblyStepBean:
    """Convertit une AssemblyStepEntity en AssemblyStepBean."""
    return AssemblyStepBean(
        uuid=str(entity.uuid),
        fsec_version_id=str(entity.fsec_version_id_id) if entity.fsec_version_id_id else "",
        hydrometric_temperature=entity.hydrometric_temperature,
        start_date=entity.start_date,
        end_date=entity.end_date,
        comments=entity.comments,
        assembly_bench_ids=[bench.id for bench in entity.assembly_bench.all()],
    )


def assembly_step_mapper_bean_to_entity(bean: AssemblyStepBean) -> AssemblyStepEntity:
    """Convertit un AssemblyStepBean en AssemblyStepEntity."""
    entity = AssemblyStepEntity()
    if bean.uuid:
        entity.uuid = bean.uuid
    entity.fsec_version_id_id = bean.fsec_version_id
    entity.hydrometric_temperature = bean.hydrometric_temperature
    entity.start_date = bean.start_date
    entity.end_date = bean.end_date
    entity.comments = bean.comments
    return entity


def assembly_step_mapper_api_to_bean(data: Dict[str, Any]) -> AssemblyStepBean:
    """Convertit des données API en AssemblyStepBean."""
    return AssemblyStepBean(
        uuid=data.get("uuid", ""),
        fsec_version_id=data.get("fsec_version_id", ""),
        hydrometric_temperature=data.get("hydrometric_temperature"),
        start_date=data.get("start_date"),
        end_date=data.get("end_date"),
        comments=data.get("comments"),
        assembly_bench_ids=data.get("assembly_bench_ids", []),
    )


def assembly_step_mapper_bean_to_api(bean: AssemblyStepBean) -> Dict[str, Any]:
    """Convertit un AssemblyStepBean en données API."""
    return {
        "uuid": bean.uuid,
        "fsec_version_id": bean.fsec_version_id,
        "hydrometric_temperature": bean.hydrometric_temperature,
        "start_date": bean.start_date.isoformat() if bean.start_date else None,
        "end_date": bean.end_date.isoformat() if bean.end_date else None,
        "comments": bean.comments,
        "assembly_bench_ids": bean.assembly_bench_ids,
    }
