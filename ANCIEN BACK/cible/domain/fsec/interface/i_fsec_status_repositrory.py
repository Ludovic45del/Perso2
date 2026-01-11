import abc

from cible.domain.fsec.models.referential.fsec_status_bean import FsecStatusBean


class IFsecStatusRepository:

    @abc.abstractmethod
    def get_fsec_status(self, category: str) -> list[FsecStatusBean]:
        raise NotImplementedError
