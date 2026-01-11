from uuid import UUID

from django.utils import timezone
from django.utils.dateformat import datetime

from cible.domain.fsec.models.fsec_document_bean import FsecDocumentBean
from cible.domain.fsec.models.referential.fsec_document_subtype_bean import (
    FsecDocumentSubtypeBean,
)
from cible.domain.fsec.models.referential.fsec_document_type_bean import (
    FsecDocumentTypeBean,
)
from cible.repository.fsec.models.fsec_documents import FsecDocumentEntity
from cible.repository.fsec.models.referential.fsec_document_subtype import (
    FsecDocumentSubtypeEntity,
)
from cible.repository.fsec.models.referential.fsec_document_type import (
    FsecDocumentTypeEntity,
)


def fsec_document_type_mapper_entity_to_bean(
    fsec_document_type_entity: FsecDocumentTypeEntity,
) -> FsecDocumentTypeBean:
    return FsecDocumentTypeBean(
        id=fsec_document_type_entity.id, label=fsec_document_type_entity.label
    )


def fsec_document_type_mapper_bean_to_entity(
    fsec_document_type_bean: FsecDocumentTypeBean,
) -> FsecDocumentTypeEntity:
    return FsecDocumentTypeEntity(
        id=fsec_document_type_bean.id, label=fsec_document_type_bean.label
    )


def fsec_document_subtype_mapper_entity_to_bean(
    fsec_document_subtype_entity: FsecDocumentSubtypeEntity,
) -> FsecDocumentSubtypeBean:
    return FsecDocumentSubtypeBean(
        id=fsec_document_subtype_entity.id,
        label=fsec_document_subtype_entity.label,
    )


def fsec_document_subtype_mapper_bean_to_entity(
    fsec_document_subtype_bean: FsecDocumentSubtypeBean,
    fsec_document_type_bean: FsecDocumentTypeBean,
) -> FsecDocumentSubtypeEntity:
    return FsecDocumentSubtypeEntity(
        id=fsec_document_subtype_bean.id,
        label=fsec_document_subtype_bean.label,
        type=fsec_document_type_mapper_bean_to_entity(fsec_document_type_bean),
    )


def fsec_document_type_mapper_api_to_bean(json: dict) -> FsecDocumentTypeBean:
    return FsecDocumentTypeBean(
        id=json["id"] if "id" in json else None,
        label=json["label"] if "label" in json else None,
    )


def fsec_document_subtype_mapper_api_to_bean(
    json: dict,
) -> FsecDocumentSubtypeBean:
    return FsecDocumentSubtypeBean(
        id=json["id"] if "id" in json else None,
        label=json["label"] if "label" in json else None,
    )


def fsec_document_mapper_entity_to_bean(
    fsec_document_entity: FsecDocumentEntity,
) -> FsecDocumentBean:
    return FsecDocumentBean(
        uuid=str(fsec_document_entity.uuid),
        fsecVersionUuid=str(fsec_document_entity.fsec.version_uuid),
        type=fsec_document_type_mapper_entity_to_bean(fsec_document_entity.type),
        subtype=fsec_document_subtype_mapper_entity_to_bean(
            fsec_document_entity.subtype
        ),
        name=fsec_document_entity.name,
        path=fsec_document_entity.path,
        date=(str(fsec_document_entity.date) if fsec_document_entity.date else None),
    )


def fsec_duplicated_document_mapper_bean_to_entity(
    fsec_document_bean: FsecDocumentBean,
) -> FsecDocumentEntity:
    return FsecDocumentEntity(
        subtype=fsec_document_subtype_mapper_bean_to_entity(
            fsec_document_bean.subtype, fsec_document_bean.type
        ),
        name=fsec_document_bean.name,
        path=fsec_document_bean.path,
        date=timezone.now(),
    )


def fsec_document_mapper_bean_to_entity(
    fsec_document_bean: FsecDocumentBean,
) -> FsecDocumentEntity:
    return FsecDocumentEntity(
        uuid=UUID(fsec_document_bean.uuid) if fsec_document_bean.uuid else None,
        fsec=(
            UUID(fsec_document_bean.fsecVersionUuid)
            if fsec_document_bean.fsecVersionUuid
            else None
        ),
        subtype=fsec_document_subtype_mapper_bean_to_entity(
            fsec_document_bean.subtype, fsec_document_bean.type
        ),
        name=fsec_document_bean.name,
        path=fsec_document_bean.path,
        date=timezone.now(),
    )


def fsec_document_mapper_api_to_bean(json: dict) -> FsecDocumentBean:
    return FsecDocumentBean(
        uuid=str(json["uuid"]) if "uuid" in json else None,
        fsecVersionUuid=(
            str(json["fsecVersionUuid"]) if "fsecVersionUuid" in json else None
        ),
        name=str(json["name"]).strip() if "name" in json else None,
        date=(
            datetime.fromisoformat(json["date"])
            if "date" in json and json["date"] is not None
            else None
        ),
        path=str(json["path"]).strip() if "path" in json else None,
        type=(
            fsec_document_type_mapper_api_to_bean(json["type"])
            if "type" in json and json["type"] is not None
            else None
        ),
        subtype=(
            fsec_document_subtype_mapper_api_to_bean(json["subtype"])
            if "subtype" in json and json["subtype"] is not None
            else None
        ),
    )
