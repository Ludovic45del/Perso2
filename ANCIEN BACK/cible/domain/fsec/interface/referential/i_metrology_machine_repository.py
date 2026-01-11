import abc

from cible.domain.fsec.models.referential.metrology_machine_bean import (
    MetrologyMachineBean,
)


class IMetrologyMachineRepository:

    @abc.abstractmethod
    def get_all_machines(self) -> list[MetrologyMachineBean]:
        raise NotImplementedError
