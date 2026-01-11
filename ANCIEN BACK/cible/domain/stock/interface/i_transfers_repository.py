import abc

from cible.domain.stock.models.transfers_bean import TransfersBean


class ITransfersRepository:

    @abc.abstractmethod
    def get_all_transfers(self) -> list[TransfersBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def create_transfers(self, transfers_bean: TransfersBean) -> list[TransfersBean]:
        raise NotImplementedError
