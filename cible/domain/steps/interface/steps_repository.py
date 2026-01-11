"""Interfaces Steps - Repositories abstraits pour les étapes FSEC."""
import abc
from typing import List, Optional

from cible.domain.steps.models.airtightness_test_lp_step_bean import (
    AirtightnessTestLpStepBean,
)
from cible.domain.steps.models.assembly_step_bean import AssemblyStepBean
from cible.domain.steps.models.depressurization_step_bean import (
    DepressurizationStepBean,
)
from cible.domain.steps.models.gas_filling_bp_step_bean import GasFillingBpStepBean
from cible.domain.steps.models.gas_filling_hp_step_bean import GasFillingHpStepBean
from cible.domain.steps.models.metrology_step_bean import MetrologyStepBean
from cible.domain.steps.models.permeation_step_bean import PermeationStepBean
from cible.domain.steps.models.pictures_step_bean import PicturesStepBean
from cible.domain.steps.models.repressurization_step_bean import (
    RepressurizationStepBean,
)
from cible.domain.steps.models.sealing_step_bean import SealingStepBean
from cible.domain.steps.models.design_step_bean import DesignStepBean
from cible.domain.steps.models.usable_step_bean import UsableStepBean
from cible.domain.steps.models.installed_step_bean import InstalledStepBean
from cible.domain.steps.models.shot_step_bean import ShotStepBean


class IDesignStepRepository(abc.ABC):
    """Interface abstraite pour le repository DesignStep."""

    @abc.abstractmethod
    def create(self, bean: DesignStepBean) -> DesignStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_uuid(self, uuid: str) -> Optional[DesignStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_fsec_version_id(self, fsec_version_id: str) -> List[DesignStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, bean: DesignStepBean) -> DesignStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def delete(self, uuid: str) -> bool:
        raise NotImplementedError


class IAssemblyStepRepository(abc.ABC):
    """Interface abstraite pour le repository AssemblyStep."""

    @abc.abstractmethod
    def create(self, bean: AssemblyStepBean) -> AssemblyStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_uuid(self, uuid: str) -> Optional[AssemblyStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_fsec_version_id(self, fsec_version_id: str) -> List[AssemblyStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, bean: AssemblyStepBean) -> AssemblyStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def delete(self, uuid: str) -> bool:
        raise NotImplementedError


class IMetrologyStepRepository(abc.ABC):
    """Interface abstraite pour le repository MetrologyStep."""

    @abc.abstractmethod
    def create(self, bean: MetrologyStepBean) -> MetrologyStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_uuid(self, uuid: str) -> Optional[MetrologyStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_fsec_version_id(self, fsec_version_id: str) -> List[MetrologyStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, bean: MetrologyStepBean) -> MetrologyStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def delete(self, uuid: str) -> bool:
        raise NotImplementedError


class ISealingStepRepository(abc.ABC):
    """Interface abstraite pour le repository SealingStep."""

    @abc.abstractmethod
    def create(self, bean: SealingStepBean) -> SealingStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_uuid(self, uuid: str) -> Optional[SealingStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_fsec_version_id(self, fsec_version_id: str) -> Optional[SealingStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, bean: SealingStepBean) -> SealingStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def delete(self, uuid: str) -> bool:
        raise NotImplementedError


class IPicturesStepRepository(abc.ABC):
    """Interface abstraite pour le repository PicturesStep."""

    @abc.abstractmethod
    def create(self, bean: PicturesStepBean) -> PicturesStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_uuid(self, uuid: str) -> Optional[PicturesStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_fsec_version_id(self, fsec_version_id: str) -> List[PicturesStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, bean: PicturesStepBean) -> PicturesStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def delete(self, uuid: str) -> bool:
        raise NotImplementedError


class IAirtightnessTestLpStepRepository(abc.ABC):
    """Interface abstraite pour le repository AirtightnessTestLpStep."""

    @abc.abstractmethod
    def create(self, bean: AirtightnessTestLpStepBean) -> AirtightnessTestLpStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_uuid(self, uuid: str) -> Optional[AirtightnessTestLpStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_fsec_version_id(
        self, fsec_version_id: str
    ) -> Optional[AirtightnessTestLpStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, bean: AirtightnessTestLpStepBean) -> AirtightnessTestLpStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def delete(self, uuid: str) -> bool:
        raise NotImplementedError


class IGasFillingBpStepRepository(abc.ABC):
    """Interface abstraite pour le repository GasFillingBpStep."""

    @abc.abstractmethod
    def create(self, bean: GasFillingBpStepBean) -> GasFillingBpStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_uuid(self, uuid: str) -> Optional[GasFillingBpStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_fsec_version_id(
        self, fsec_version_id: str
    ) -> Optional[GasFillingBpStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, bean: GasFillingBpStepBean) -> GasFillingBpStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def delete(self, uuid: str) -> bool:
        raise NotImplementedError


class IGasFillingHpStepRepository(abc.ABC):
    """Interface abstraite pour le repository GasFillingHpStep."""

    @abc.abstractmethod
    def create(self, bean: GasFillingHpStepBean) -> GasFillingHpStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_uuid(self, uuid: str) -> Optional[GasFillingHpStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_fsec_version_id(
        self, fsec_version_id: str
    ) -> Optional[GasFillingHpStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, bean: GasFillingHpStepBean) -> GasFillingHpStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def delete(self, uuid: str) -> bool:
        raise NotImplementedError


class IPermeationStepRepository(abc.ABC):
    """Interface abstraite pour le repository PermeationStep."""

    @abc.abstractmethod
    def create(self, bean: PermeationStepBean) -> PermeationStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_uuid(self, uuid: str) -> Optional[PermeationStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_fsec_version_id(
        self, fsec_version_id: str
    ) -> Optional[PermeationStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, bean: PermeationStepBean) -> PermeationStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def delete(self, uuid: str) -> bool:
        raise NotImplementedError


class IDepressurizationStepRepository(abc.ABC):
    """Interface abstraite pour le repository DepressurizationStep."""

    @abc.abstractmethod
    def create(self, bean: DepressurizationStepBean) -> DepressurizationStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_uuid(self, uuid: str) -> Optional[DepressurizationStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_fsec_version_id(
        self, fsec_version_id: str
    ) -> Optional[DepressurizationStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, bean: DepressurizationStepBean) -> DepressurizationStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def delete(self, uuid: str) -> bool:
        raise NotImplementedError


class IRepressurizationStepRepository(abc.ABC):
    """Interface abstraite pour le repository RepressurizationStep."""

    @abc.abstractmethod
    def create(self, bean: RepressurizationStepBean) -> RepressurizationStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_uuid(self, uuid: str) -> Optional[RepressurizationStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_fsec_version_id(
        self, fsec_version_id: str
    ) -> Optional[RepressurizationStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, bean: RepressurizationStepBean) -> RepressurizationStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def delete(self, uuid: str) -> bool:
        raise NotImplementedError


class IUsableStepRepository(abc.ABC):
    """Interface abstraite pour le repository UsableStep."""

    @abc.abstractmethod
    def create(self, bean: UsableStepBean) -> UsableStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_uuid(self, uuid: str) -> Optional[UsableStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_fsec_version_id(self, fsec_version_id: str) -> List[UsableStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, bean: UsableStepBean) -> UsableStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def delete(self, uuid: str) -> bool:
        raise NotImplementedError


class IInstalledStepRepository(abc.ABC):
    """Interface abstraite pour le repository InstalledStep."""

    @abc.abstractmethod
    def create(self, bean: InstalledStepBean) -> InstalledStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_uuid(self, uuid: str) -> Optional[InstalledStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_fsec_version_id(self, fsec_version_id: str) -> List[InstalledStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, bean: InstalledStepBean) -> InstalledStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def delete(self, uuid: str) -> bool:
        raise NotImplementedError


class IShotStepRepository(abc.ABC):
    """Interface abstraite pour le repository ShotStep."""

    @abc.abstractmethod
    def create(self, bean: ShotStepBean) -> ShotStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_uuid(self, uuid: str) -> Optional[ShotStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_fsec_version_id(self, fsec_version_id: str) -> List[ShotStepBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, bean: ShotStepBean) -> ShotStepBean:
        raise NotImplementedError

    @abc.abstractmethod
    def delete(self, uuid: str) -> bool:
        raise NotImplementedError
