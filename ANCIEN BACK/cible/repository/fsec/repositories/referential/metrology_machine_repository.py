from cible.domain.fsec.interface.referential.i_metrology_machine_repository import (
    IMetrologyMachineRepository,
)
from cible.domain.fsec.models.referential.metrology_machine_bean import (
    MetrologyMachineBean,
)
from cible.mapper.fsec.steps.metrology_step_mapper import (
    metrology_machine_mapper_entity_to_bean,
)
from cible.repository.fsec.models.referential.metrology_machine import (
    MetrologyMachineEntity,
)


class MetrologyMachineRepository(IMetrologyMachineRepository):

    def get_all_machines(self) -> list[MetrologyMachineBean]:
        machines = MetrologyMachineEntity.objects.all()
        if len(machines) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: metrology_machine_mapper_entity_to_bean(x),
                    machines,
                )
            )
