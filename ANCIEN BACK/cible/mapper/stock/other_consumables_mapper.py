from cible.domain.stock.models.other_consumables_bean import OtherConsumablesBean
from cible.repository.stock.models.consumables.other_consumables import (
    OtherConsumablesEntity,
)


def other_consumables_mapper_bean_to_entity(
    other_consumables_bean: OtherConsumablesBean,
) -> OtherConsumablesEntity:
    return OtherConsumablesEntity(
        uuid=other_consumables_bean.uuid,
        item=other_consumables_bean.item,
        stocks=other_consumables_bean.stocks,
        unit=other_consumables_bean.unit,
        reference=other_consumables_bean.reference,
        buying_type=other_consumables_bean.buyingType,
        supplier=other_consumables_bean.supplier,
        additional_comment=other_consumables_bean.additionalComment,
    )


def other_consumables_mapper_entity_to_bean(
    other_consumables_entity: OtherConsumablesEntity,
) -> OtherConsumablesBean:
    return OtherConsumablesBean(
        uuid=str(other_consumables_entity.uuid),
        item=other_consumables_entity.item,
        stocks=other_consumables_entity.stocks,
        unit=other_consumables_entity.unit,
        reference=other_consumables_entity.reference,
        buyingType=str(other_consumables_entity.buying_type),
        supplier=other_consumables_entity.supplier,
        additionalComment=other_consumables_entity.additional_comment,
    )


def other_consumables_mapper_api_to_bean(json: dict) -> OtherConsumablesBean:
    return OtherConsumablesBean(
        uuid=json.get("uuid"),
        item=json["item"] if "item" in json else None,
        stocks=json["stocks"] if "stocks" in json else None,
        unit=json["unit"] if "unit" in json else None,
        reference=json["reference"] if "reference" in json else None,
        buyingType=json["buyingType"] if "buyingType" in json else None,
        supplier=json["supplier"] if "supplier" in json else None,
        additionalComment=(
            json["additionalComment"] if "additionalComment" in json else None
        ),
    )
