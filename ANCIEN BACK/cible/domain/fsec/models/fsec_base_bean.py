import abc
from dataclasses import dataclass
from typing import List, Optional, Union

from cible.domain.fsec.models.fsec_document_bean import FsecDocumentBean
from cible.domain.fsec.models.fsec_team_bean import FsecTeamBean
from cible.domain.fsec.models.referential.fsec_category_bean import FsecCategoryBean
from cible.domain.fsec.models.referential.fsec_rack_bean import FsecRackBean
from cible.domain.fsec.models.referential.fsec_status_bean import FsecStatusBean
from cible.domain.fsec.models.steps.fsec_airthightness_test_low_pressure_bean import (
    FsecAirthightnessTestLowPressureStepBean,
)
from cible.domain.fsec.models.steps.fsec_assembly_step_bean import FsecAssemblyStepBean
from cible.domain.fsec.models.steps.fsec_depressurization_bean import (
    FsecDepressurizationStepBean,
)
from cible.domain.fsec.models.steps.fsec_design_step_bean import FsecDesignStepBean
from cible.domain.fsec.models.steps.fsec_gas_filling_high_pressure_bean import (
    FsecGasFillingHighPressureStepBean,
)
from cible.domain.fsec.models.steps.fsec_gas_filling_low_pressure_bean import (
    FsecGasFillingLowPressureStepBean,
)
from cible.domain.fsec.models.steps.fsec_installed_step_bean import (
    FsecInstalledStepBean,
)
from cible.domain.fsec.models.steps.fsec_metrology_step_bean import (
    FsecMetrologyStepBean,
)
from cible.domain.fsec.models.steps.fsec_permeation_bean import FsecPermeationStepBean
from cible.domain.fsec.models.steps.fsec_pictures_step_bean import FsecPicturesStepBean
from cible.domain.fsec.models.steps.fsec_repressurization_bean import (
    FsecRepressurizationStepBean,
)
from cible.domain.fsec.models.steps.fsec_sealing_step_bean import FsecSealingStepBean
from cible.domain.fsec.models.steps.fsec_shot_step_bean import FsecShotStepBean
from cible.domain.fsec.models.steps.fsec_usable_step_bean import FsecUsableStepBean


@dataclass
class FsecBaseBean:
    versionUuid: str
    fsecUuid: str
    status: FsecStatusBean
    category: FsecCategoryBean
    lastUpdated: str = None
    createdAt: str = None
    isActive: bool = True
    designStep: FsecDesignStepBean = None
    sealingStep: FsecSealingStepBean = None
    usableStep: FsecUsableStepBean = None
    installedStep: FsecInstalledStepBean = None
    shotStep: FsecShotStepBean = None
    rack: FsecRackBean = None
    depressurizationFailed: bool = None

    # Attributs à définir dans les classes enfants
    metrologyStep: Union[None, FsecMetrologyStepBean, List[FsecMetrologyStepBean]] = (
        None
    )
    picturesStep: Union[None, FsecPicturesStepBean, List[FsecPicturesStepBean]] = None
    assemblyStep: Union[None, FsecAssemblyStepBean, List[FsecAssemblyStepBean]] = None

    toBeDuplicated: Optional[bool] = None

    # GAS RELATED FIELDS
    airthightnessTestLowPressureStep: FsecAirthightnessTestLowPressureStepBean = None
    permeationStep: FsecPermeationStepBean = None
    depressurizationStep: FsecDepressurizationStepBean = None
    repressurizationStep: FsecRepressurizationStepBean = None
    gasFillingLowPressureStep: FsecGasFillingLowPressureStepBean = None
    gasFillingHighPressureStep: FsecGasFillingHighPressureStepBean = None

    @abc.abstractmethod
    def _apply_to_steps(
        self,
        steps: Union[None, any, List[any]],
        items: list[any],
        apply_to_step: callable,
    ) -> None:
        return

    def set_documents(self, documents: list[FsecDocumentBean]):
        filtered_items = [
            document
            for document in documents
            if document.fsecVersionUuid == self.versionUuid
        ]

        """Applique les documents aux différentes étapes"""
        self.designStep.set_documents(documents)
        self.usableStep.set_documents(documents)
        self.installedStep.set_documents(documents)

        # Appliquer aux autres étapes
        self._apply_to_steps(
            self.metrologyStep,
            filtered_items,
            (lambda step, docs: step.set_documents(docs)),
        )
        self._apply_to_steps(
            self.picturesStep,
            filtered_items,
            (lambda step, docs: step.set_documents(docs)),
        )

    def set_team(self, teams: list[FsecTeamBean]):
        filtered_items = [
            team for team in teams if team.fsecVersionUuid == self.versionUuid
        ]

        """Applique l'équipe aux différentes étapes"""
        self.designStep.set_team(teams)
        self.usableStep.set_team(teams)

        # Appliquer aux autres étapes
        self._apply_to_steps(
            self.metrologyStep, filtered_items, lambda step, team: step.set_team(team)
        )
        self._apply_to_steps(
            self.picturesStep, filtered_items, lambda step, team: step.set_team(team)
        )
        self._apply_to_steps(
            self.assemblyStep, filtered_items, lambda step, team: step.set_team(team)
        )
