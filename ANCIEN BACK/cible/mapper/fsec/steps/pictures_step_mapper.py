from datetime import datetime

from cible.domain.fsec.models.steps.fsec_pictures_step_bean import FsecPicturesStepBean
from cible.mapper.fsec.fsec_document_mapper import fsec_document_mapper_api_to_bean
from cible.mapper.fsec.fsec_team_mapper import fsec_team_mapper_api_to_bean
from cible.repository.fsec.models.steps.pictures_step import PicturesStepEntity


def pictures_step_mapper_bean_to_entity(
    pictures_step_bean: FsecPicturesStepBean,
) -> PicturesStepEntity:
    return PicturesStepEntity(
        last_updated=pictures_step_bean.lastUpdated,
        comments=pictures_step_bean.comments,
    )


def pictures_step_mapper_entity_to_bean(
    pictures_step_entity: PicturesStepEntity,
) -> FsecPicturesStepBean:
    return FsecPicturesStepBean(
        lastUpdated=str(pictures_step_entity.last_updated),
        comments=pictures_step_entity.comments,
        versionUuid=str(pictures_step_entity.fsec_version.version_uuid),
    )


def fsec_pictures_mapper_api_to_bean(json: dict) -> FsecPicturesStepBean:
    return FsecPicturesStepBean(
        lastUpdated=(
            datetime.strptime(json["lastUpdated"], "%Y-%m-%dT%H:%M:%S.%fZ")
            if "lastUpdated" in json and json["lastUpdated"] is not None
            else None
        ),
        comments=str(json["comments"]).strip() if "comments" in json else None,
        fsecTeam=list(
            map(
                lambda x: fsec_team_mapper_api_to_bean(x),
                json["fsecTeam"] if "fsecTeam" in json else [],
            )
        ),
        fsecDocuments=list(
            map(
                lambda x: fsec_document_mapper_api_to_bean(x),
                json["fsecDocuments"] if "fsecDocuments" in json else [],
            )
        ),
        versionUuid=json["versionUuid"] if "versionUuid" in json else None,
    )
