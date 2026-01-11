from datetime import datetime

from cible.domain.stock.models.inventory_lmj_bean import InventoryLmjBean
from cible.repository.stock.models.inventory.inventory_lmj import InventoryLmjEntity


def inventory_lmj_mapper_bean_to_entity(
    inventory_lmj_bean: InventoryLmjBean,
) -> InventoryLmjEntity:
    return InventoryLmjEntity(
        uuid=inventory_lmj_bean.uuid,
        iec=inventory_lmj_bean.iec,
        elements_or_target_description=inventory_lmj_bean.elementsOrTargetDescription,
        digits_if_untagged_element=inventory_lmj_bean.digitsIfUntaggedElement,
        targets_or_element_number=inventory_lmj_bean.targetsOrElementNumber,
        box_number_or_box_description=inventory_lmj_bean.boxNumberOrBoxDescription,
        localisation=inventory_lmj_bean.localisation,
        delivery_date=inventory_lmj_bean.deliveryDate,
        exit_date=inventory_lmj_bean.exitDate,
        campaign_dtri_number=inventory_lmj_bean.campaignDtriNumber,
        fsec=inventory_lmj_bean.fsec,
        additional_comment=inventory_lmj_bean.additionalComment,
    )


def inventory_lmj_mapper_entity_to_bean(
    inventory_lmj_entity: InventoryLmjEntity,
) -> InventoryLmjBean:
    return InventoryLmjBean(
        uuid=str(inventory_lmj_entity.uuid),
        iec=inventory_lmj_entity.iec,
        elementsOrTargetDescription=inventory_lmj_entity.elements_or_target_description,
        digitsIfUntaggedElement=inventory_lmj_entity.digits_if_untagged_element,
        targetsOrElementNumber=inventory_lmj_entity.targets_or_element_number,
        boxNumberOrBoxDescription=inventory_lmj_entity.box_number_or_box_description,
        localisation=inventory_lmj_entity.localisation,
        deliveryDate=str(inventory_lmj_entity.delivery_date),
        exitDate=str(inventory_lmj_entity.exit_date),
        campaignDtriNumber=inventory_lmj_entity.campaign_dtri_number,
        fsec=inventory_lmj_entity.fsec,
        additionalComment=inventory_lmj_entity.additional_comment,
    )


def inventory_lmj_mapper_api_to_bean(json: dict) -> InventoryLmjBean:
    return InventoryLmjBean(
        uuid=json.get("uuid"),
        iec=json["iec"] if "iec" in json else None,
        elementsOrTargetDescription=(
            json["elementsOrTargetDescription"]
            if "elementsOrTargetDescription" in json
            else None
        ),
        digitsIfUntaggedElement=(
            json["digitsIfUntaggedElement"]
            if "digitsIfUntaggedElement" in json
            else None
        ),
        targetsOrElementNumber=(
            json["targetsOrElementNumber"] if "targetsOrElementNumber" in json else None
        ),
        boxNumberOrBoxDescription=(
            json["boxNumberOrBoxDescription"]
            if "boxNumberOrBoxDescription" in json
            else None
        ),
        localisation=json["localisation"] if "localisation" in json else None,
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
        campaignDtriNumber=(
            json["campaignDtriNumber"] if "campaignDtriNumber" in json else None
        ),
        additionalComment=(
            json["additionalComment"] if "additionalComment" in json else None
        ),
        fsec=json["usedCampaign"] if "usedCampaign" in json else None,
    )
