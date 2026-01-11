from datetime import datetime

from cible.domain.fsec.models.steps.fsec_permeation_bean import FsecPermeationStepBean
from cible.repository.fsec.models.steps.permeation import PermeationEntity


def permeation_mapper_bean_to_entity(
    fsec_permeation_step_bean: FsecPermeationStepBean,
) -> PermeationEntity:
    return PermeationEntity(
        operator=fsec_permeation_step_bean.operator,
        gas_type=fsec_permeation_step_bean.gasType,
        sensor_pressure=fsec_permeation_step_bean.sensorPressure,
        target_pressure=fsec_permeation_step_bean.targetPressure,
        computed_shot_pressure=fsec_permeation_step_bean.computedShotPressure,
        start_date=fsec_permeation_step_bean.startDate,
        estimated_end_date=fsec_permeation_step_bean.estimatedEndDate,
        fsec_version=fsec_permeation_step_bean.versionUuid,
    )


def permeation_mapper_entity_to_bean(
    permeation_entity: PermeationEntity,
) -> FsecPermeationStepBean:
    return FsecPermeationStepBean(
        operator=permeation_entity.operator,
        gasType=permeation_entity.gas_type,
        sensorPressure=permeation_entity.sensor_pressure,
        targetPressure=permeation_entity.target_pressure,
        computedShotPressure=permeation_entity.computed_shot_pressure,
        startDate=str(permeation_entity.start_date),
        estimatedEndDate=str(permeation_entity.estimated_end_date),
        versionUuid=str(permeation_entity.fsec_version),
    )


def permeation_api_to_bean(json: dict) -> FsecPermeationStepBean:
    return FsecPermeationStepBean(
        operator=json["operator"] if "operator" in json else None,
        gasType=json["gasType"] if "gasType" in json else None,
        sensorPressure=json["sensorPressure"] if "sensorPressure" in json else None,
        targetPressure=json["targetPressure"] if "targetPressure" in json else None,
        computedShotPressure=(
            json["computedShotPressure"] if "computedShotPressure" in json else None
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
