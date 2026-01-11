from datetime import datetime

from cible.domain.fsec.models.steps.fsec_depressurization_bean import (
    FsecDepressurizationStepBean,
)
from cible.repository.fsec.models.steps.depressurization import DepressurizationEntity


def depressurization_mapper_bean_to_entity(
    fsec_depressurization_step_bean: FsecDepressurizationStepBean,
) -> DepressurizationEntity:
    return DepressurizationEntity(
        operator=fsec_depressurization_step_bean.operator,
        date_of_fulfilment=fsec_depressurization_step_bean.dateOfFulfilment,
        pressure_gauge=fsec_depressurization_step_bean.pressureGauge,
        enclosure_pressure_measured=(
            fsec_depressurization_step_bean.enclosurePressureMeasured
        ),
        start_time=fsec_depressurization_step_bean.startTime,
        end_time=fsec_depressurization_step_bean.endTime,
        observations=fsec_depressurization_step_bean.observations,
        depressurization_time_before_firing=(
            fsec_depressurization_step_bean.depressurizationTimeBeforeFiring
        ),
        computed_pressure_before_firing=(
            fsec_depressurization_step_bean.computedPressureBeforeFiring
        ),
        fsec_version=fsec_depressurization_step_bean.versionUuid,
    )


def depressurization_mapper_entity_to_bean(
    depressurization_entity: DepressurizationEntity,
) -> FsecDepressurizationStepBean:
    return FsecDepressurizationStepBean(
        operator=depressurization_entity.operator,
        dateOfFulfilment=str(depressurization_entity.date_of_fulfilment),
        pressureGauge=depressurization_entity.pressure_gauge,
        enclosurePressureMeasured=depressurization_entity.enclosure_pressure_measured,
        startTime=str(depressurization_entity.start_time),
        endTime=str(depressurization_entity.end_time),
        observations=depressurization_entity.observations,
        depressurizationTimeBeforeFiring=(
            depressurization_entity.depressurization_time_before_firing
        ),
        computedPressureBeforeFiring=(
            depressurization_entity.computed_pressure_before_firing
        ),
        versionUuid=str(depressurization_entity.fsec_version),
    )


def depressurization_api_to_bean(json: dict) -> FsecDepressurizationStepBean:
    return FsecDepressurizationStepBean(
        operator=json["operator"] if "operator" in json else None,
        pressureGauge=json["pressureGauge"] if "pressureGauge" in json else None,
        observations=(
            str(json["observations"]).strip() if "observations" in json else None
        ),
        depressurizationTimeBeforeFiring=(
            json["depressurizationTimeBeforeFiring"]
            if "depressurizationTimeBeforeFiring" in json
            else None
        ),
        computedPressureBeforeFiring=(
            json["computedPressureBeforeFiring"]
            if "computedPressureBeforeFiring" in json
            else None
        ),
        enclosurePressureMeasured=(
            json["enclosurePressureMeasured"]
            if "enclosurePressureMeasured" in json
            else None
        ),
        versionUuid=json["versionUuid"] if "versionUuid" in json else None,
        startTime=(
            str(datetime.strptime(json["startTime"], "%Y-%m-%dT%H:%M:%S.%fZ"))
            if "startTime" in json and json["startTime"] is not None
            else None
        ),
        endTime=(
            str(datetime.strptime(json["endTime"], "%Y-%m-%dT%H:%M:%S.%fZ"))
            if "endTime" in json and json["endTime"] is not None
            else None
        ),
        dateOfFulfilment=(
            str(
                datetime.strptime(
                    json["dateOfFulfilment"], "%Y-%m-%dT%H:%M:%S.%fZ"
                ).date()
            )
            if "dateOfFulfilment" in json and json["dateOfFulfilment"] is not None
            else None
        ),
    )
