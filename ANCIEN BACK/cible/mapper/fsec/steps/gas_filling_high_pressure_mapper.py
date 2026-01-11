from datetime import datetime

from cible.domain.fsec.models.steps.fsec_gas_filling_high_pressure_bean import (
    FsecGasFillingHighPressureStepBean,
)
from cible.repository.fsec.models.steps.gas_filling_high_pressure import (
    GasFillingHighPressureEntity,
)


def gas_filling_high_pressure_mapper_bean_to_entity(
    fsec_depressurization_step_bean: FsecGasFillingHighPressureStepBean,
) -> GasFillingHighPressureEntity:
    return GasFillingHighPressureEntity(
        operator=fsec_depressurization_step_bean.operator,
        gas_base=fsec_depressurization_step_bean.gasBase,
        gas_type=fsec_depressurization_step_bean.gasType,
        gas_container=fsec_depressurization_step_bean.gasContainer,
        experiment_pressure=fsec_depressurization_step_bean.experimentPressure,
        leak_rate_dtri=fsec_depressurization_step_bean.leakRateDtri,
        date_of_fulfilment=fsec_depressurization_step_bean.dateOfFulfilment,
        fsec_version=fsec_depressurization_step_bean.versionUuid,
        observations=fsec_depressurization_step_bean.observations,
    )


def gas_filling_high_pressure_mapper_entity_to_bean(
    gas_filling_high_pressure_entity: GasFillingHighPressureEntity,
) -> FsecGasFillingHighPressureStepBean:
    return FsecGasFillingHighPressureStepBean(
        operator=gas_filling_high_pressure_entity.operator,
        gasBase=gas_filling_high_pressure_entity.gas_base,
        gasType=gas_filling_high_pressure_entity.gas_type,
        gasContainer=gas_filling_high_pressure_entity.gas_container,
        experimentPressure=gas_filling_high_pressure_entity.experiment_pressure,
        leakRateDtri=gas_filling_high_pressure_entity.leak_rate_dtri,
        versionUuid=str(gas_filling_high_pressure_entity.fsec_version),
        dateOfFulfilment=str(gas_filling_high_pressure_entity.date_of_fulfilment),
        observations=gas_filling_high_pressure_entity.observations,
    )


def gas_filling_high_pressure_api_to_bean(
    json: dict,
) -> FsecGasFillingHighPressureStepBean:
    return FsecGasFillingHighPressureStepBean(
        operator=json["operator"] if "operator" in json else None,
        gasBase=json["gasBase"] if "gasBase" in json else None,
        gasType=json["gasType"] if "gasType" in json else None,
        gasContainer=json["gasContainer"] if "gasContainer" in json else None,
        experimentPressure=(
            json["experimentPressure"] if "experimentPressure" in json else None
        ),
        leakRateDtri=json["leakRateDtri"] if "leakRateDtri" in json else None,
        versionUuid=json["versionUuid"] if "versionUuid" in json else None,
        dateOfFulfilment=(
            str(
                datetime.strptime(
                    json["dateOfFulfilment"], "%Y-%m-%dT%H:%M:%S.%fZ"
                ).date()
            )
            if "dateOfFulfilment" in json and json["dateOfFulfilment"] is not None
            else None
        ),
        observations=(
            str(json["observations"]).strip() if "observations" in json else None
        ),
    )
