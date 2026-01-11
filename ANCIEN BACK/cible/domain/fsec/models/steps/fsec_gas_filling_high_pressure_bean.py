import abc
from dataclasses import dataclass

from cible.domain.fsec.models.referential.fsec_status_bean import FsecStatusBean
from cible.domain.fsec.models.steps.fsec_base_step_bean import FsecBaseStep


@dataclass
class FsecGasFillingHighPressureStepBean(FsecBaseStep):
    leakRateDtri: str
    gasType: str
    experimentPressure: float
    operator: str
    observations: str
    dateOfFulfilment: str
    gasBase: int
    gasContainer: int

    @abc.abstractmethod
    def get_next_step(self) -> FsecStatusBean | None:
        raise NotImplementedError

    @abc.abstractmethod
    def get_previous_step(self) -> FsecStatusBean | None:
        raise NotImplementedError

    @abc.abstractmethod
    def is_valid(self) -> bool:
        raise NotImplementedError
