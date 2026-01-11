from cible.domain.fsec.interface.referential.i_fsec_assembly_bench_repository import (
    IFsecAssemblyBenchRepository,
)
from cible.domain.fsec.models.referential.fsec_assembly_bench_bean import (
    FsecAssemblyBenchBean,
)
from cible.mapper.fsec.steps.assembly_step_mapper import (
    assembly_bench_mapper_entity_to_bean,
)
from cible.repository.fsec.models.referential.fsec_assembly_bench import (
    FsecAssemblyBenchEntity,
)


class FsecAssemblyBenchRepository(IFsecAssemblyBenchRepository):

    def get_all_benches(self) -> list[FsecAssemblyBenchBean]:
        benches = FsecAssemblyBenchEntity.objects.all()
        if len(benches) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: assembly_bench_mapper_entity_to_bean(x),
                    benches,
                )
            )
