from cible.domain.fsec.models.referential.fsec_rack_bean import FsecRackBean
from cible.repository.fsec.models.referential.fsec_rack import FsecRackEntity


def fsec_rack_mapper_api_to_bean(json: dict) -> FsecRackBean:
    return FsecRackBean(
        id=json["id"] if "id" in json else None,
        label=json["label"] if "label" in json else None,
        color=json["color"] if "color" in json else None,
        isFull=json["isFull"] if "isFull" in json else None,
    )


def fsec_rack_mapper_bean_to_entity(fsec_rack_bean: FsecRackBean) -> FsecRackEntity:
    return FsecRackEntity(
        id=fsec_rack_bean.id,
        label=fsec_rack_bean.label,
        color=fsec_rack_bean.color,
        is_full=fsec_rack_bean.isFull,
    )


def fsec_rack_mapper_entity_to_bean(
    fsec_rack_entity: FsecRackEntity,
) -> FsecRackBean:
    return FsecRackBean(
        id=fsec_rack_entity.id,
        label=fsec_rack_entity.label,
        color=fsec_rack_entity.color,
        isFull=fsec_rack_entity.is_full,
    )
