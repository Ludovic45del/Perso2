from datetime import datetime

from cible.domain.fsec.models.steps.fsec_airthightness_test_low_pressure_bean import (
    FsecAirthightnessTestLowPressureStepBean,
)
from cible.repository.fsec.models.steps.airtightness_test_low_pressure import (
    AirtightnessTestLowPressureEntity,
)


def airtightness_test_low_mapper_bean_to_entity(
    fsec_airthightness_test_low_pressure_step_bean: FsecAirthightnessTestLowPressureStepBean,
) -> AirtightnessTestLowPressureEntity:
    return AirtightnessTestLowPressureEntity(
        leak_rate_dtri=fsec_airthightness_test_low_pressure_step_bean.leakRateDtri,
        gas_type=fsec_airthightness_test_low_pressure_step_bean.gasType,
        experiment_pressure=(
            fsec_airthightness_test_low_pressure_step_bean.experimentPressure
        ),
        airtightness_test_duration=(
            fsec_airthightness_test_low_pressure_step_bean.airtightnessTestDuration
        ),
        operator=fsec_airthightness_test_low_pressure_step_bean.operator,
        date_of_fulfilment=(
            fsec_airthightness_test_low_pressure_step_bean.dateOfFulfilment
        ),
        fsec_version=fsec_airthightness_test_low_pressure_step_bean.versionUuid,
    )


def airtightness_test_low_mapper_entity_to_bean(
    airtightness_test_low_pressure_entity: AirtightnessTestLowPressureEntity,
) -> FsecAirthightnessTestLowPressureStepBean:
    return FsecAirthightnessTestLowPressureStepBean(
        leakRateDtri=airtightness_test_low_pressure_entity.leak_rate_dtri,
        gasType=airtightness_test_low_pressure_entity.gas_type,
        experimentPressure=airtightness_test_low_pressure_entity.experiment_pressure,
        airtightnessTestDuration=(
            airtightness_test_low_pressure_entity.airtightness_test_duration
        ),
        operator=airtightness_test_low_pressure_entity.operator,
        dateOfFulfilment=str(airtightness_test_low_pressure_entity.date_of_fulfilment),
        versionUuid=str(airtightness_test_low_pressure_entity.fsec_version),
    )


def airtightness_test_low_pressure_api_to_bean(
    json: dict,
) -> FsecAirthightnessTestLowPressureStepBean:
    return FsecAirthightnessTestLowPressureStepBean(
        leakRateDtri=json["leakRateDtri"] if "leakRateDtri" in json else None,
        gasType=json["gasType"] if "gasType" in json else None,
        experimentPressure=(
            json["experimentPressure"] if "experimentPressure" in json else None
        ),
        airtightnessTestDuration=(
            json["airtightnessTestDuration"]
            if "airtightnessTestDuration" in json
            else None
        ),
        operator=json["operator"] if "operator" in json else None,
        dateOfFulfilment=(
            str(
                datetime.strptime(
                    json["dateOfFulfilment"], "%Y-%m-%dT%H:%M:%S.%fZ"
                ).date()
            )
            if "dateOfFulfilment" in json and json["dateOfFulfilment"] is not None
            else None
        ),
        versionUuid=json["versionUuid"] if "versionUuid" in json else None,
    )
