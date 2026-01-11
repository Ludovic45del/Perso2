from cible.domain.fsec.models.referential.metrology_machine_bean import (
    MetrologyMachineBean,
)
from cible.domain.fsec.models.steps.fsec_metrology_step_bean import (
    FsecMetrologyStepBean,
)
from cible.mapper.fsec.fsec_document_mapper import fsec_document_mapper_api_to_bean
from cible.mapper.fsec.fsec_rack_mapper import fsec_rack_mapper_api_to_bean
from cible.mapper.fsec.fsec_team_mapper import fsec_team_mapper_api_to_bean
from cible.repository.fsec.models.referential.metrology_machine import (
    MetrologyMachineEntity,
)
from cible.repository.fsec.models.steps.metrology_step import MetrologyStepEntity


def metrology_machine_mapper_bean_to_entity(
    metrology_machine_bean: MetrologyMachineBean,
) -> MetrologyMachineEntity:
    return MetrologyMachineEntity(
        id=metrology_machine_bean.id,
        label=metrology_machine_bean.label,
        color=metrology_machine_bean.color,
    )


def metrology_machine_mapper_entity_to_bean(
    metrology_machine_entity: MetrologyMachineEntity,
) -> MetrologyMachineBean:
    return MetrologyMachineBean(
        id=metrology_machine_entity.id,
        label=metrology_machine_entity.label,
        color=metrology_machine_entity.color,
    )


def fsec_machine_mapper_api_to_bean(json: dict) -> MetrologyMachineBean:
    return MetrologyMachineBean(
        id=json["id"] if "id" in json else None,
        label=json["label"] if "label" in json else None,
        color=json["color"] if "color" in json else None,
    )


def metrology_step_mapper_bean_to_entity(
    metrology_step_bean: FsecMetrologyStepBean,
) -> MetrologyStepEntity:
    return MetrologyStepEntity(
        machine=(
            metrology_machine_mapper_bean_to_entity(metrology_step_bean.machine)
            if metrology_step_bean.machine
            else None
        ),
        comments=metrology_step_bean.comments,
        date=metrology_step_bean.date,
    )


def metrology_step_mapper_entity_to_bean(
    metrology_step_entity: MetrologyStepEntity,
) -> FsecMetrologyStepBean:
    return FsecMetrologyStepBean(
        machine=(
            metrology_machine_mapper_entity_to_bean(metrology_step_entity.machine)
            if metrology_step_entity.machine
            else None
        ),
        comments=metrology_step_entity.comments,
        versionUuid=str(metrology_step_entity.fsec_version.version_uuid),
        date=str(metrology_step_entity.date) if metrology_step_entity.date else None,
    )


def fsec_metrology_mapper_api_to_bean(json: dict) -> FsecMetrologyStepBean:
    return FsecMetrologyStepBean(
        machine=(
            fsec_machine_mapper_api_to_bean(json["machine"])
            if "machine" in json and json["machine"] is not None
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
        date=(
            json["date"][:10] if "date" in json and json["date"] is not None else None
        ),
    )


def fsec_metrology_workflow_mapper_api_to_bean(json: dict) -> FsecMetrologyStepBean:
    return FsecMetrologyStepBean(
        machine=(
            fsec_machine_mapper_api_to_bean(json["machine"])
            if "machine" in json and json["machine"] is not None
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
        date=(
            json["date"][:10] if "date" in json and json["date"] is not None else None
        ),
        rack=(
            fsec_rack_mapper_api_to_bean(json["rack"])
            if "rack" in json and json["rack"] is not None
            else None
        ),
    )
