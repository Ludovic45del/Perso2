from cible.domain.fsec.interface.referential.i_fsec_rack_repository import (
    IFsecRackRepository,
)
from cible.domain.fsec.models.referential.fsec_rack_bean import FsecRackBean


def get_all_racks_available(
    repository: IFsecRackRepository,
) -> list[FsecRackBean]:
    return repository.get_all_racks_available()
