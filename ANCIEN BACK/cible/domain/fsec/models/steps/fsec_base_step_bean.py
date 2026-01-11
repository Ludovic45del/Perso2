import abc
from dataclasses import dataclass

from cible.domain.fsec.models.referential.fsec_status_bean import FsecStatusBean


@dataclass
class FsecBaseStep:
    versionUuid: str

    @abc.abstractmethod
    def get_next_step(self) -> FsecStatusBean | None:
        raise NotImplementedError

    @abc.abstractmethod
    def get_previous_step(self) -> FsecStatusBean | None:
        raise NotImplementedError

    @abc.abstractmethod
    def is_valid(self) -> bool:
        raise NotImplementedError
