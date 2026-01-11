import uuid

from django.db import transaction

from cible.domain.stock.interface.i_transfers_repository import ITransfersRepository
from cible.domain.stock.models.transfers_bean import TransfersBean
from cible.mapper.stock.transfers_mapper import (
    transfers_mapper_bean_to_entity,
    transfers_mapper_entity_to_bean,
)
from cible.repository.stock.models.transfers import TransfersEntity


class TransfersRepository(ITransfersRepository):

    def get_all_transfers(self) -> list[TransfersBean]:
        benches = TransfersEntity.objects.all()
        if len(benches) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: transfers_mapper_entity_to_bean(x),
                    benches,
                )
            )

    @transaction.atomic
    def create_transfers(self, transfers_bean: TransfersBean) -> list[TransfersBean]:
        transfers_entity = transfers_mapper_bean_to_entity(transfers_bean)
        transfers_entity.uuid = uuid.uuid4()
        transfers_entity.save()

        updated_list = TransfersEntity.objects.all()

        if len(updated_list) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: transfers_mapper_entity_to_bean(x),
                    updated_list,
                )
            )
