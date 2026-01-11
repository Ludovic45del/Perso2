from cible.domain.stock.models.inventory_ec_structuring_bean import (
    InventoryEcStructuringBean,
)
from cible.repository.stock.models.inventory.inventory_ec_structuring import (
    InventoryEcStructuringEntity,
)


def inventory_ec_structuring_mapper_bean_to_entity(
    inventory_ec_structuring_bean: InventoryEcStructuringBean,
) -> InventoryEcStructuringEntity:
    return InventoryEcStructuringEntity(
        uuid=inventory_ec_structuring_bean.uuid,
        item=inventory_ec_structuring_bean.item,
        stocks=inventory_ec_structuring_bean.stocks,
        unit=inventory_ec_structuring_bean.unit,
        reference=inventory_ec_structuring_bean.reference,
        buying_type=inventory_ec_structuring_bean.buyingType,
        supplier=inventory_ec_structuring_bean.supplier,
        fsec=inventory_ec_structuring_bean.fsec,
        additional_comment=inventory_ec_structuring_bean.additionalComment,
    )


def inventory_ec_structuring_mapper_entity_to_bean(
    inventory_ec_structuring_entity: InventoryEcStructuringEntity,
) -> InventoryEcStructuringBean:
    return InventoryEcStructuringBean(
        uuid=str(inventory_ec_structuring_entity.uuid),
        item=inventory_ec_structuring_entity.item,
        stocks=inventory_ec_structuring_entity.stocks,
        unit=inventory_ec_structuring_entity.unit,
        reference=inventory_ec_structuring_entity.reference,
        buyingType=inventory_ec_structuring_entity.buying_type,
        supplier=inventory_ec_structuring_entity.supplier,
        fsec=inventory_ec_structuring_entity.fsec,
        additionalComment=inventory_ec_structuring_entity.additional_comment,
    )


def inventory_ec_structuring_mapper_api_to_bean(
    json: dict,
) -> InventoryEcStructuringBean:
    return InventoryEcStructuringBean(
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
        fsec=json["usedCampaign"] if "usedCampaign" in json else None,
    )
