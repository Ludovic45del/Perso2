from datetime import datetime

from cible.domain.fsec.models.referential.fsec_assembly_bench_bean import (
    FsecAssemblyBenchBean,
)
from cible.domain.fsec.models.steps.fsec_assembly_step_bean import FsecAssemblyStepBean
from cible.mapper.fsec.fsec_team_mapper import fsec_team_mapper_api_to_bean
from cible.repository.fsec.models.referential.fsec_assembly_bench import (
    FsecAssemblyBenchEntity,
)
from cible.repository.fsec.models.steps.assembly_step import AssemblyStepEntity


def assembly_bench_mapper_bean_to_entity(
    assembly_bench_bean: FsecAssemblyBenchBean,
) -> FsecAssemblyBenchEntity:
    return FsecAssemblyBenchEntity(
        id=assembly_bench_bean.id,
        label=assembly_bench_bean.label,
        color=assembly_bench_bean.color,
    )


def assembly_bench_mapper_entity_to_bean(
    assembly_bench_entity: FsecAssemblyBenchEntity,
) -> FsecAssemblyBenchBean:
    return FsecAssemblyBenchBean(
        id=assembly_bench_entity.id,
        label=assembly_bench_entity.label,
        color=assembly_bench_entity.color,
    )


def fsec_assembly_bench_api_to_bean(json: dict) -> FsecAssemblyBenchBean:
    return FsecAssemblyBenchBean(
        id=json["id"] if "id" in json else None,
        label=json["label"] if "label" in json else None,
        color=json["color"] if "color" in json else None,
    )


def assembly_step_mapper_bean_to_entity(
    fsec_assembly_step_bean: FsecAssemblyStepBean,
) -> AssemblyStepEntity:
    benches = fsec_assembly_step_bean.assemblyBench or []
    entity = AssemblyStepEntity(
        hydrometric_temperature=fsec_assembly_step_bean.hydrometricTemperature,
        start_date=fsec_assembly_step_bean.startDate,
        end_date=fsec_assembly_step_bean.endDate,
        comments=fsec_assembly_step_bean.comments,
    )

    bench_entities = []
    if benches:
        bench_entities = list(
            map(
                lambda x: assembly_bench_mapper_bean_to_entity(x),
                benches,
            )
        )

    entity.assembly_bench.set(bench_entities)

    return entity


def assembly_step_mapper_entity_to_bean(
    fsec_assembly_step_entity: AssemblyStepEntity,
) -> FsecAssemblyStepBean:
    benches = (
        fsec_assembly_step_entity.assembly_bench.all()
        if fsec_assembly_step_entity.assembly_bench.all()
        else []
    )
    return FsecAssemblyStepBean(
        hydrometricTemperature=fsec_assembly_step_entity.hydrometric_temperature,
        startDate=str(fsec_assembly_step_entity.start_date),
        endDate=str(fsec_assembly_step_entity.end_date),
        comments=fsec_assembly_step_entity.comments,
        versionUuid=str(fsec_assembly_step_entity.fsec_version.version_uuid),
        assemblyBench=list(
            map(
                lambda x: assembly_bench_mapper_entity_to_bean(x),
                benches,
            )
        ),
    )


def fsec_assembly_mapper_api_to_bean(json: dict) -> FsecAssemblyStepBean:
    benches = json["assemblyBench"] or []
    return FsecAssemblyStepBean(
        hydrometricTemperature=0,
        versionUuid=json["versionUuid"] if "versionUuid" in json else None,
        startDate=(
            datetime.strptime(json["startDate"], "%Y-%m-%dT%H:%M:%S.%fZ")
            if "startDate" in json and json["startDate"] is not None
            else None
        ),
        endDate=(
            datetime.strptime(json["endDate"], "%Y-%m-%dT%H:%M:%S.%fZ")
            if "endDate" in json and json["endDate"] is not None
            else None
        ),
        fsecTeam=list(
            map(
                lambda x: fsec_team_mapper_api_to_bean(x),
                json["fsecTeam"] if "fsecTeam" in json else [],
            )
        ),
        comments=str(json["comments"]).strip() if "comments" in json else None,
        assemblyBench=(
            list(
                map(
                    lambda x: fsec_assembly_bench_api_to_bean(x),
                    benches,
                )
            )
            if "assemblyBench" in json and json["assemblyBench"] is not None
            else None
        ),
    )


def assembly_workflow_step_mapper_bean_to_entity(
    fsec_assembly_step_bean: FsecAssemblyStepBean,
) -> AssemblyStepEntity:

    entity = AssemblyStepEntity(
        hydrometric_temperature=fsec_assembly_step_bean.hydrometricTemperature,
        start_date=fsec_assembly_step_bean.startDate,
        end_date=fsec_assembly_step_bean.endDate,
        comments=fsec_assembly_step_bean.comments,
    )

    return entity
