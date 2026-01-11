from dataclasses import dataclass

from cible.domain.fsec.models.fsec_base_bean import FsecBaseBean
from cible.domain.fsec.models.steps.fsec_airthightness_test_low_pressure_bean import (
    FsecAirthightnessTestLowPressureStepBean,
)
from cible.domain.fsec.models.steps.fsec_assembly_step_bean import FsecAssemblyStepBean
from cible.domain.fsec.models.steps.fsec_depressurization_bean import (
    FsecDepressurizationStepBean,
)
from cible.domain.fsec.models.steps.fsec_gas_filling_high_pressure_bean import (
    FsecGasFillingHighPressureStepBean,
)
from cible.domain.fsec.models.steps.fsec_gas_filling_low_pressure_bean import (
    FsecGasFillingLowPressureStepBean,
)
from cible.domain.fsec.models.steps.fsec_metrology_step_bean import (
    FsecMetrologyStepBean,
)
from cible.domain.fsec.models.steps.fsec_permeation_bean import FsecPermeationStepBean
from cible.domain.fsec.models.steps.fsec_pictures_step_bean import FsecPicturesStepBean
from cible.domain.fsec.models.steps.fsec_repressurization_bean import (
    FsecRepressurizationStepBean,
)


@dataclass
class FsecActiveBean(FsecBaseBean):
    assemblyStep: FsecAssemblyStepBean = None
    metrologyStep: FsecMetrologyStepBean = None
    picturesStep: FsecPicturesStepBean = None

    # GAS RELATED FIELDS
    airthightnessTestLowPressureStep: FsecAirthightnessTestLowPressureStepBean = None
    permeationStep: FsecPermeationStepBean = None
    depressurizationStep: FsecDepressurizationStepBean = None
    repressurizationStep: FsecRepressurizationStepBean = None
    gasFillingLowPressureStep: FsecGasFillingLowPressureStepBean = None
    gasFillingHighPressureStep: FsecGasFillingHighPressureStepBean = None

    def _apply_to_steps(self, step: any, items: list[any], apply_to_step: callable):
        if not step:
            return

        if step.versionUuid == self.versionUuid:
            apply_to_step(step, items)
