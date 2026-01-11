from cible.domain.stock.interface.i_transfers_repository import ITransfersRepository
from cible.domain.stock.models.transfers_bean import TransfersBean


def get_all_transfers(repository: ITransfersRepository) -> list[TransfersBean]:
    return repository.get_all_transfers()


def create_transfers(
    repository: ITransfersRepository, transfers_bean: TransfersBean
) -> list[TransfersBean]:
    return repository.create_transfers(transfers_bean)
