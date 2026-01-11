from datetime import datetime

from cible.domain.fsec.models.steps.fsec_gas_filling_low_pressure_bean import (
    FsecGasFillingLowPressureStepBean,
)
from cible.repository.fsec.models.steps.gas_filling_low_pressure import (
    GasFillingLowPressureEntity,
)


def gas_filling_low_pressure_mapper_bean_to_entity(
    fsec_gas_filling_low_pressure_step_bean: FsecGasFillingLowPressureStepBean,
) -> GasFillingLowPressureEntity:
    return GasFillingLowPressureEntity(
        leak_rate_dtri=fsec_gas_filling_low_pressure_step_bean.leakRateDtri,
        gas_type=fsec_gas_filling_low_pressure_step_bean.gasType,
        experiment_pressure=fsec_gas_filling_low_pressure_step_bean.experimentPressure,
        leak_test_duration=fsec_gas_filling_low_pressure_step_bean.leakTestDuration,
        operator=fsec_gas_filling_low_pressure_step_bean.operator,
        gas_base=fsec_gas_filling_low_pressure_step_bean.gasBase,
        gas_container=fsec_gas_filling_low_pressure_step_bean.gasContainer,
        date_of_fulfilment=fsec_gas_filling_low_pressure_step_bean.dateOfFulfilment,
        fsec_version=fsec_gas_filling_low_pressure_step_bean.versionUuid,
        observations=fsec_gas_filling_low_pressure_step_bean.observations,
    )


def gas_filling_low_pressure_mapper_entity_to_bean(
    gas_filling_low_pressure_entity: GasFillingLowPressureEntity,
) -> FsecGasFillingLowPressureStepBean:
    return FsecGasFillingLowPressureStepBean(
        operator=gas_filling_low_pressure_entity.operator,
        gasBase=gas_filling_low_pressure_entity.gas_base,
        gasType=gas_filling_low_pressure_entity.gas_type,
        gasContainer=gas_filling_low_pressure_entity.gas_container,
        experimentPressure=gas_filling_low_pressure_entity.experiment_pressure,
        leakRateDtri=gas_filling_low_pressure_entity.leak_rate_dtri,
        leakTestDuration=gas_filling_low_pressure_entity.leak_test_duration,
        versionUuid=str(gas_filling_low_pressure_entity.fsec_version),
        observations=gas_filling_low_pressure_entity.observations,
        dateOfFulfilment=str(gas_filling_low_pressure_entity.date_of_fulfilment),
    )


def gas_filling_low_pressure_api_to_bean(
    json: dict,
) -> FsecGasFillingLowPressureStepBean:
    return FsecGasFillingLowPressureStepBean(
        operator=json["operator"] if "operator" in json else None,
        gasBase=json["gasBase"] if "gasBase" in json else None,
        gasType=json["gasType"] if "gasType" in json else None,
        gasContainer=json["gasContainer"] if "gasContainer" in json else None,
        experimentPressure=(
            json["experimentPressure"] if "experimentPressure" in json else None
        ),
        leakRateDtri=json["leakRateDtri"] if "leakRateDtri" in json else None,
        leakTestDuration=(
            json["leakTestDuration"] if "leakTestDuration" in json else None
        ),
        versionUuid=json["versionUuid"] if "versionUuid" in json else None,
        observations=(
            str(json["observations"]).strip() if "observations" in json else None
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
