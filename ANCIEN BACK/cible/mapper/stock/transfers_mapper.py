from datetime import datetime

from cible.domain.stock.models.transfers_bean import TransfersBean
from cible.repository.stock.models.transfers import TransfersEntity


def transfers_mapper_bean_to_entity(
    transfers_bean: TransfersBean,
) -> TransfersEntity:
    return TransfersEntity(
        uuid=transfers_bean.uuid,
        equipment=transfers_bean.equipment,
        equipment_type=transfers_bean.equipmentType,
        initial_stock=transfers_bean.initialStock,
        units=transfers_bean.units,
        current_stock=transfers_bean.currentStock,
        entry_date=transfers_bean.entryDate,
        exit_date=transfers_bean.exitDate,
        date=transfers_bean.date,
    )


def transfers_mapper_entity_to_bean(
    transfers_entity: TransfersEntity,
) -> TransfersBean:
    return TransfersBean(
        uuid=str(transfers_entity.uuid),
        equipment=transfers_entity.equipment,
        equipmentType=transfers_entity.equipment_type,
        initialStock=transfers_entity.initial_stock,
        units=transfers_entity.units,
        currentStock=transfers_entity.current_stock,
        entryDate=str(transfers_entity.entry_date),
        exitDate=str(transfers_entity.exit_date),
        date=str(transfers_entity.date),
    )


def transfers_mapper_api_to_bean(json: dict) -> TransfersBean:
    return TransfersBean(
        uuid=json.get("uuid"),
        equipment=json["equipment"] if "equipment" in json else None,
        equipmentType=json["equipmentType"] if "equipmentType" in json else None,
        initialStock=json["initialStock"] if "initialStock" in json else None,
        units=json["units"] if "units" in json else None,
        currentStock=json["currentStock"] if "currentStock" in json else None,
        entryDate=(
            str(datetime.strptime(json["entryDate"], "%Y-%m-%dT%H:%M:%S.%fZ").date())
            if "entryDate" in json and json["entryDate"] is not None
            else None
        ),
        exitDate=(
            str(datetime.strptime(json["exitDate"], "%Y-%m-%dT%H:%M:%S.%fZ").date())
            if "exitDate" in json and json["exitDate"] is not None
            else None
        ),
        date=(
            str(datetime.strptime(json["date"], "%Y-%m-%dT%H:%M:%S.%fZ").date())
            if "date" in json and json["date"] is not None
            else None
        ),
        additionalComment=(
            json["additionalComment"] if "additionalComment" in json else None
        ),
    )
