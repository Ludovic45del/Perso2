from datetime import datetime

from cible.domain.stock.models.structuring_bean import StructuringBean
from cible.repository.stock.models.structuring.structuring import StructuringEntity


def structuring_mapper_bean_to_entity(
    structuring_bean: StructuringBean,
) -> StructuringEntity:
    return StructuringEntity(
        uuid=structuring_bean.uuid,
        who=structuring_bean.who,
        fulfillment_date=structuring_bean.fulfillmentDate,
        structuring_number=structuring_bean.structuringNumber,
        pams_number=structuring_bean.pamsNumber,
        localisation=structuring_bean.localisation,
        fsec=structuring_bean.fsec,
        usage_date=structuring_bean.usageDate,
        comments=structuring_bean.comments,
        additional_comment=structuring_bean.additionalComment,
    )


def structuring_mapper_entity_to_bean(
    structuring_entity: StructuringEntity,
) -> StructuringBean:
    return StructuringBean(
        uuid=str(structuring_entity.uuid),
        who=structuring_entity.who,
        fulfillmentDate=str(structuring_entity.fulfillment_date),
        structuringNumber=structuring_entity.structuring_number,
        pamsNumber=structuring_entity.pams_number,
        localisation=structuring_entity.localisation,
        fsec=structuring_entity.fsec,
        usageDate=str(structuring_entity.usage_date),
        comments=structuring_entity.comments,
        additionalComment=structuring_entity.additional_comment,
    )


def structuring_mapper_api_to_bean(json: dict) -> StructuringBean:
    return StructuringBean(
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
        additionalComment=(
            json["additionalComment"] if "additionalComment" in json else None
        ),
    )
