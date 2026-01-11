import abc
from dataclasses import dataclass

from cible.domain.fsec.models.referential.fsec_status_bean import FsecStatusBean
from cible.domain.fsec.models.steps.fsec_base_step_bean import FsecBaseStep


@dataclass
class FsecDepressurizationStepBean(FsecBaseStep):
    operator: str
    dateOfFulfilment: str
    pressureGauge: float
    enclosurePressureMeasured: float
    startTime: str
    endTime: str
    observations: str
    depressurizationTimeBeforeFiring: float
    computedPressureBeforeFiring: float

    @abc.abstractmethod
    def get_next_step(self) -> FsecStatusBean | None:
        raise NotImplementedError

    @abc.abstractmethod
    def get_previous_step(self) -> FsecStatusBean | None:
        raise NotImplementedError

    @abc.abstractmethod
    def is_valid(self) -> bool:
        raise NotImplementedError
