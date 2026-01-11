from datetime import datetime

from cible.domain.stock.models.inventory_omega_bean import InventoryOmegaBean
from cible.mapper.fsec.fsec_mapper import (
    fsec_mapper_api_to_active_bean,
)
from cible.repository.stock.models.inventory.inventory_omega import InventoryOmegaEntity


def inventory_omega_mapper_bean_to_entity(
    inventory_omega_bean: InventoryOmegaBean,
) -> InventoryOmegaEntity:
    return InventoryOmegaEntity(
        uuid=inventory_omega_bean.uuid,
        iec=inventory_omega_bean.iec,
        elements_or_target_description=inventory_omega_bean.elementsOrTargetDescription,
        digits_if_untagged_element=inventory_omega_bean.digitsIfUntaggedElement,
        targets_or_element_number=inventory_omega_bean.targetsOrElementNumber,
        box_number_or_box_description=inventory_omega_bean.boxNumberOrBoxDescription,
        localisation=inventory_omega_bean.localisation,
        delivery_date=inventory_omega_bean.deliveryDate,
        exit_date=inventory_omega_bean.exitDate,
        drmn_campaign_number=inventory_omega_bean.drmnCampaignNumber,
        fsec=inventory_omega_bean.fsec,
        additional_comment=inventory_omega_bean.additionalComment,
    )


def inventory_omega_mapper_entity_to_bean(
    inventory_omega_entity: InventoryOmegaEntity,
) -> InventoryOmegaBean:
    return InventoryOmegaBean(
        uuid=str(inventory_omega_entity.uuid),
        iec=inventory_omega_entity.iec,
        elementsOrTargetDescription=(
            inventory_omega_entity.elements_or_target_description
        ),
        digitsIfUntaggedElement=inventory_omega_entity.digits_if_untagged_element,
        targetsOrElementNumber=inventory_omega_entity.targets_or_element_number,
        boxNumberOrBoxDescription=inventory_omega_entity.box_number_or_box_description,
        localisation=inventory_omega_entity.localisation,
        deliveryDate=str(inventory_omega_entity.delivery_date),
        exitDate=str(inventory_omega_entity.exit_date),
        drmnCampaignNumber=inventory_omega_entity.drmn_campaign_number,
        fsec=inventory_omega_entity.fsec,
        additionalComment=inventory_omega_entity.additional_comment,
    )


def inventory_omega_mapper_api_to_bean(json: dict) -> InventoryOmegaBean:
    return InventoryOmegaBean(
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
        drmnCampaignNumber=(
            json["drmnCampaignNumber"] if "drmnCampaignNumber" in json else None
        ),
        additionalComment=(
            json["additionalComment"] if "additionalComment" in json else None
        ),
        fsec=(
            fsec_mapper_api_to_active_bean(json["fsec"])
            if "fsec" in json and json["fsec"] is not None
            else None
        ),
    )
