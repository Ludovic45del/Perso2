from cible.domain.fsec.interface.i_fsec_status_repositrory import IFsecStatusRepository
from cible.domain.fsec.models.referential.fsec_status_bean import FsecStatusBean


def get_fsec_status(
    repository: IFsecStatusRepository, category: str
) -> list[FsecStatusBean]:
    return repository.get_fsec_status(category)
