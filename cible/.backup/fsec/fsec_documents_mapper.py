"""Mapper FsecDocuments - Conversion Entity ↔ Bean ↔ API."""
from typing import Any, Dict

from cible.domain.fsec.models.fsec_documents_bean import FsecDocumentsBean
from cible.repository.fsec.models.fsec_documents_entity import FsecDocumentsEntity


def fsec_documents_mapper_entity_to_bean(
    entity: FsecDocumentsEntity,
) -> FsecDocumentsBean:
    """Convertit une FsecDocumentsEntity en FsecDocumentsBean."""
    return FsecDocumentsBean(
        uuid=str(entity.uuid),
        fsec_id=str(entity.fsec_id_id) if entity.fsec_id_id else "",
        subtype_id=entity.subtype_id_id if entity.subtype_id_id else None,
        name=entity.name,
        path=entity.path,
        date=entity.date,
        step_type=entity.step_type,
        step_uuid=entity.step_uuid,
    )


def fsec_documents_mapper_bean_to_entity(
    bean: FsecDocumentsBean,
) -> FsecDocumentsEntity:
    """Convertit un FsecDocumentsBean en FsecDocumentsEntity."""
    entity = FsecDocumentsEntity()
    if bean.uuid:
        entity.uuid = bean.uuid
    entity.fsec_id_id = bean.fsec_id
    entity.subtype_id_id = bean.subtype_id
    entity.name = bean.name
    entity.path = bean.path
    entity.date = bean.date
    entity.step_type = bean.step_type
    entity.step_uuid = bean.step_uuid
    return entity


def fsec_documents_mapper_api_to_bean(data: Dict[str, Any]) -> FsecDocumentsBean:
    """Convertit des données API en FsecDocumentsBean."""
    return FsecDocumentsBean(
        uuid=data.get("uuid", ""),
        fsec_id=data.get("fsec_id", ""),
        subtype_id=data.get("subtype_id"),
        name=data.get("name", ""),
        path=data.get("path", ""),
        date=data.get("date"),
        step_type=data.get("step_type"),
        step_uuid=data.get("step_uuid"),
    )


def fsec_documents_mapper_bean_to_api(bean: FsecDocumentsBean) -> Dict[str, Any]:
    """Convertit un FsecDocumentsBean en données API."""
    return {
        "uuid": bean.uuid,
        "fsec_id": bean.fsec_id,
        "subtype_id": bean.subtype_id,
        "name": bean.name,
        "path": bean.path,
        "date": bean.date.isoformat() if bean.date else None,
        "step_type": bean.step_type,
        "step_uuid": bean.step_uuid,
    }
