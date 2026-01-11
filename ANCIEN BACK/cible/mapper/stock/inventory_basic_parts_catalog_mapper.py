from datetime import datetime

from cible.domain.stock.models.inventory_basic_parts_catalog_bean import (
    InventoryBasicPartsCatalogBean,
)
from cible.repository.stock.models.inventory.inventory_basic_parts_catalog import (
    InventoryBasicPartsCatalogEntity,
)


def inventory_basic_parts_catalog_mapper_bean_to_entity(
    inventory_basic_parts_catalog_bean: InventoryBasicPartsCatalogBean,
) -> InventoryBasicPartsCatalogEntity:
    return InventoryBasicPartsCatalogEntity(
        uuid=inventory_basic_parts_catalog_bean.uuid,
        element_name=inventory_basic_parts_catalog_bean.elementName,
        availability=(inventory_basic_parts_catalog_bean.availability),
        box_number_or_box_description=(
            inventory_basic_parts_catalog_bean.boxNumberOrBoxDescription
        ),
        delivery_date=inventory_basic_parts_catalog_bean.deliveryDate,
        exit_date=inventory_basic_parts_catalog_bean.exitDate,
        used_campaign=inventory_basic_parts_catalog_bean.usedCampaign,
        fsec=inventory_basic_parts_catalog_bean.fsec,
        additional_comment=inventory_basic_parts_catalog_bean.additionalComment,
    )


def inventory_basic_parts_catalog_mapper_entity_to_bean(
    inventory_basic_parts_catalog_entity: InventoryBasicPartsCatalogEntity,
) -> InventoryBasicPartsCatalogBean:
    return InventoryBasicPartsCatalogBean(
        uuid=str(inventory_basic_parts_catalog_entity.uuid),
        elementName=inventory_basic_parts_catalog_entity.element_name,
        availability=inventory_basic_parts_catalog_entity.availability,
        boxNumberOrBoxDescription=(
            inventory_basic_parts_catalog_entity.box_number_or_box_description
        ),
        deliveryDate=str(inventory_basic_parts_catalog_entity.delivery_date),
        exitDate=str(inventory_basic_parts_catalog_entity.exit_date),
        usedCampaign=inventory_basic_parts_catalog_entity.used_campaign,
        fsec=inventory_basic_parts_catalog_entity.fsec,
        additionalComment=inventory_basic_parts_catalog_entity.additional_comment,
    )


def inventory_basic_parts_catalog_mapper_api_to_bean(
    json: dict,
) -> InventoryBasicPartsCatalogBean:
    return InventoryBasicPartsCatalogBean(
        uuid=json.get("uuid"),
        elementName=json["elementName"] if "elementName" in json else None,
        availability=json["availability"] if "availability" in json else None,
        boxNumberOrBoxDescription=(
            json["boxNumberOrBoxDescription"]
            if "boxNumberOrBoxDescription" in json
            else None
        ),
        deliveryDate=(
            str(datetime.strptime(json["deliveryDate"], "%Y-%m-%dT%H:%M:%S.%fZ").date())
            if "deliveryDate" in json and json["deliveryDate"] is not None
            else None
        ),
        exitDate=(
            str(datetime.strptime(json["exitDate"], "%Y-%m-%dT%H:%M:%S.%fZ").date())
            if "exitDate" in json and json["exitDate"] is not None
            else None
        ),
        usedCampaign=json["usedCampaign"] if "usedCampaign" in json else None,
        additionalComment=(
            json["additionalComment"] if "additionalComment" in json else None
        ),
        fsec=json["usedCampaign"] if "usedCampaign" in json else None,
    )
