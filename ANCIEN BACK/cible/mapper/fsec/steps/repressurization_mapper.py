from datetime import datetime

from cible.domain.fsec.models.steps.fsec_repressurization_bean import (
    FsecRepressurizationStepBean,
)
from cible.repository.fsec.models.steps.repressurization import RepressurizationEntity


def repressurization_mapper_bean_to_entity(
    fsec_repressurization_step_bean: FsecRepressurizationStepBean,
) -> RepressurizationEntity:
    return RepressurizationEntity(
        operator=fsec_repressurization_step_bean.operator,
        gas_type=fsec_repressurization_step_bean.gasType,
        sensor_pressure=fsec_repressurization_step_bean.sensorPressure,
        computed_pressure=fsec_repressurization_step_bean.computedPressure,
        start_date=fsec_repressurization_step_bean.startDate,
        estimated_end_date=fsec_repressurization_step_bean.estimatedEndDate,
        fsec_version=fsec_repressurization_step_bean.versionUuid,
    )


def repressurization_mapper_entity_to_bean(
    repressurization_entity: RepressurizationEntity,
) -> FsecRepressurizationStepBean:
    return FsecRepressurizationStepBean(
        operator=repressurization_entity.operator,
        gasType=repressurization_entity.gas_type,
        sensorPressure=repressurization_entity.sensor_pressure,
        computedPressure=repressurization_entity.computed_pressure,
        estimatedEndDate=str(repressurization_entity.estimated_end_date),
        startDate=str(repressurization_entity.start_date),
        versionUuid=str(repressurization_entity.fsec_version),
    )


def repressurization_mapper_api_to_bean(json: dict) -> FsecRepressurizationStepBean:
    return FsecRepressurizationStepBean(
        operator=json["operator"] if "operator" in json else None,
        gasType=json["gasType"] if "gasType" in json else None,
        sensorPressure=json["sensorPressure"] if "sensorPressure" in json else None,
        computedPressure=(
            json["computedPressure"] if "computedPressure" in json else None
        ),
        versionUuid=json["versionUuid"] if "versionUuid" in json else None,
        startDate=(
            str(datetime.strptime(json["startDate"], "%Y-%m-%dT%H:%M:%S.%fZ").date())
            if "startDate" in json and json["startDate"] is not None
            else None
        ),
        estimatedEndDate=(
            str(
                datetime.strptime(
                    json["estimatedEndDate"], "%Y-%m-%dT%H:%M:%S.%fZ"
                ).date()
            )
            if "estimatedEndDate" in json and json["estimatedEndDate"] is not None
            else None
        ),
    )
