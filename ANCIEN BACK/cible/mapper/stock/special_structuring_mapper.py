from datetime import datetime

from cible.domain.stock.models.special_structuring_bean import SpecialStructuringBean
from cible.repository.stock.models.structuring.special_structuring import (
    SpecialStructuringEntity,
)


def special_structuring_mapper_bean_to_entity(
    special_structuring_bean: SpecialStructuringBean,
) -> SpecialStructuringEntity:
    return SpecialStructuringEntity(
        uuid=special_structuring_bean.uuid,
        who=special_structuring_bean.who,
        fulfillment_date=special_structuring_bean.fulfillmentDate,
        structuring_number=special_structuring_bean.structuringNumber,
        pams_number=special_structuring_bean.pamsNumber,
        localisation=special_structuring_bean.localisation,
        fsec=special_structuring_bean.fsec,
        usage_date=special_structuring_bean.usageDate,
        comments=special_structuring_bean.comments,
        materials_mat=special_structuring_bean.materialsMat,
        additional_comment=special_structuring_bean.additionalComment,
    )


def special_structuring_mapper_entity_to_bean(
    special_structuring_entity: SpecialStructuringEntity,
) -> SpecialStructuringBean:
    return SpecialStructuringBean(
        uuid=str(special_structuring_entity.uuid),
        who=special_structuring_entity.who,
        fulfillmentDate=str(special_structuring_entity.fulfillment_date),
        structuringNumber=special_structuring_entity.structuring_number,
        pamsNumber=special_structuring_entity.pams_number,
        localisation=special_structuring_entity.localisation,
        fsec=special_structuring_entity.fsec,
        usageDate=str(special_structuring_entity.usage_date),
        comments=special_structuring_entity.comments,
        materialsMat=special_structuring_entity.materials_mat,
        additionalComment=special_structuring_entity.additional_comment,
    )


def special_structuring_mapper_api_to_bean(json: dict) -> SpecialStructuringBean:
    return SpecialStructuringBean(
        uuid=json.get("uuid"),
        who=json["who"] if "who" in json else None,
        fulfillmentDate=(
            str(
                datetime.strptime(
                    json["fulfillmentDate"], "%Y-%m-%dT%H:%M:%S.%fZ"
                ).date()
            )
            if "fulfillmentDate" in json and json["fulfillmentDate"] is not None
            else None
        ),
        structuringNumber=(
            json["structuringNumber"] if "structuringNumber" in json else None
        ),
        pamsNumber=json["pamsNumber"] if "pamsNumber" in json else None,
        localisation=json["localisation"] if "localisation" in json else None,
        fsec=json["usedCampaign"] if "usedCampaign" in json else None,
        usageDate=(
            str(datetime.strptime(json["usageDate"], "%Y-%m-%dT%H:%M:%S.%fZ").date())
            if "usageDate" in json and json["usageDate"] is not None
            else None
        ),
        comments=str(json["comments"]).strip() if "comments" in json else None,
        materialsMat=json["materialsMat"] if "materialsMat" in json else None,
        additionalComment=(
            json["additionalComment"] if "additionalComment" in json else None
        ),
    )
