from datetime import datetime

from cible.domain.stock.models.consumables_glues_bean import ConsumablesGluesBean
from cible.repository.stock.models.consumables.consumables_glues import (
    ConsumablesGluesEntity,
)


def consumables_glues_mapper_bean_to_entity(
    consumable_glues_bean: ConsumablesGluesBean,
) -> ConsumablesGluesEntity:
    return ConsumablesGluesEntity(
        uuid=consumable_glues_bean.uuid,
        item=consumable_glues_bean.item,
        stocks=consumable_glues_bean.stocks,
        unit=consumable_glues_bean.unit,
        reference=consumable_glues_bean.reference,
        buying_type=consumable_glues_bean.buyingType,
        supplier=consumable_glues_bean.supplier,
        expiry_date=consumable_glues_bean.expiryDate,
        additional_comment=consumable_glues_bean.additionalComment,
    )


def consumables_glues_mapper_entity_to_bean(
    consumable_glues_entity: ConsumablesGluesEntity,
) -> ConsumablesGluesBean:
    return ConsumablesGluesBean(
        uuid=str(consumable_glues_entity.uuid),
        item=consumable_glues_entity.item,
        stocks=consumable_glues_entity.stocks,
        unit=consumable_glues_entity.unit,
        reference=consumable_glues_entity.reference,
        buyingType=str(consumable_glues_entity.buying_type),
        supplier=consumable_glues_entity.supplier,
        expiryDate=str(consumable_glues_entity.expiry_date),
        additionalComment=consumable_glues_entity.additional_comment,
    )


def consumables_glues_mapper_api_to_bean(json: dict) -> ConsumablesGluesBean:
    return ConsumablesGluesBean(
        uuid=json.get("uuid"),
        item=json["item"] if "item" in json else None,
        stocks=json["stocks"] if "stocks" in json else None,
        unit=json["unit"] if "unit" in json else None,
        reference=json["reference"] if "reference" in json else None,
        buyingType=json["buyingType"] if "buyingType" in json else None,
        supplier=json["supplier"] if "supplier" in json else None,
        expiryDate=(
            str(datetime.strptime(json["expiryDate"], "%Y-%m-%dT%H:%M:%S.%fZ").date())
            if "expiryDate" in json and json["expiryDate"] is not None
            else None
        ),
        additionalComment=(
            json["additionalComment"] if "additionalComment" in json else None
        ),
    )
