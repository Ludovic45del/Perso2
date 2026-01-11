import abc

from cible.domain.fsec.models.referential.fsec_rack_bean import FsecRackBean


class IFsecRackRepository:

    @abc.abstractmethod
    def get_all_racks_available(self) -> list[FsecRackBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_rack_occupancy(self, rack_id) -> int:
        raise NotImplementedError

    @abc.abstractmethod
    def update_rack(self, rack: FsecRackBean) -> FsecRackBean:
        raise NotImplementedError
