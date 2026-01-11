from cible.domain.fsec.interface.referential.i_metrology_machine_repository import (
    IMetrologyMachineRepository,
)
from cible.domain.fsec.models.referential.metrology_machine_bean import (
    MetrologyMachineBean,
)


def get_all_machines(
    repository: IMetrologyMachineRepository,
) -> list[MetrologyMachineBean]:
    return repository.get_all_machines()
