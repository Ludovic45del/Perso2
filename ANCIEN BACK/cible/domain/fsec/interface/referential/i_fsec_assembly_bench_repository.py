import abc

from cible.domain.fsec.models.referential.fsec_assembly_bench_bean import (
    FsecAssemblyBenchBean,
)


class IFsecAssemblyBenchRepository:

    @abc.abstractmethod
    def get_all_benches(self) -> list[FsecAssemblyBenchBean]:
        raise NotImplementedError
