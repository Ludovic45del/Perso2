from uuid import UUID

from cible.domain.fsec.models.fsec_team_bean import FsecTeamBean
from cible.domain.fsec.models.referential.fsec_role_bean import FsecRoleBean
from cible.repository.fsec.models.fsec_team import FsecTeamEntity
from cible.repository.fsec.models.referential.fsec_role import FsecRoleEntity


def fsec_role_mapper_bean_to_entity(
    fsec_role_bean: FsecRoleBean,
) -> FsecRoleEntity:
    return FsecRoleEntity(id=fsec_role_bean.id, label=fsec_role_bean.label)


def fsec_role_mapper_entity_to_bean(
    fsec_role_entity: FsecRoleEntity,
) -> FsecRoleBean:
    return FsecRoleBean(id=fsec_role_entity.id, label=fsec_role_entity.label)


def fsec_team_role_mapper_api_to_bean(json: dict) -> FsecRoleBean:
    return FsecRoleBean(
        id=json["id"] if "id" in json else None,
        label=json["label"] if "label" in json else None,
    )


def fsec_team_mapper_bean_to_entity(
    fsec_team: FsecTeamBean,
) -> FsecTeamEntity:
    return FsecTeamEntity(
        uuid=UUID(fsec_team.uuid) if fsec_team.uuid else None,
        name=fsec_team.name,
        role=fsec_role_mapper_bean_to_entity(fsec_team.role),
        fsec=(UUID(fsec_team.fsecVersionUuid) if fsec_team.fsecVersionUuid else None),
    )


def fsec_duplicated_team_mapper_bean_to_entity(
    fsec_team: FsecTeamBean,
) -> FsecTeamEntity:
    return FsecTeamEntity(
        name=fsec_team.name,
        role=fsec_role_mapper_bean_to_entity(fsec_team.role),
    )


def fsec_team_mapper_entity_to_bean(
    fsec_team_entity: FsecTeamEntity,
) -> FsecTeamBean:
    return FsecTeamBean(
        uuid=str(fsec_team_entity.uuid),
        name=fsec_team_entity.name,
        role=fsec_role_mapper_entity_to_bean(fsec_team_entity.role),
        fsecVersionUuid=str(fsec_team_entity.fsec.version_uuid),
    )


def fsec_team_mapper_api_to_bean(json: dict) -> FsecTeamBean:
    return FsecTeamBean(
        uuid=json["uuid"] if "uuid" in json else None,
        fsecVersionUuid=json["fsecVersionUuid"] if "fsecVersionUuid" in json else None,
        name=str(json["name"]).strip() if "name" in json else None,
        role=(
            fsec_team_role_mapper_api_to_bean(json["role"]) if "role" in json else None
        ),
    )
