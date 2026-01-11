from cible.domain.fsec.interface.referential.i_fsec_assembly_bench_repository import (
    IFsecAssemblyBenchRepository,
)
from cible.domain.fsec.models.referential.fsec_assembly_bench_bean import (
    FsecAssemblyBenchBean,
)


def get_all_benches(
    repository: IFsecAssemblyBenchRepository,
) -> list[FsecAssemblyBenchBean]:
    return repository.get_all_benches()
