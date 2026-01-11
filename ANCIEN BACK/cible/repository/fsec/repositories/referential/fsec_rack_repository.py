from django.shortcuts import get_object_or_404

from cible.domain.fsec.interface.referential.i_fsec_rack_repository import (
    IFsecRackRepository,
)
from cible.domain.fsec.models.referential.fsec_rack_bean import FsecRackBean
from cible.mapper.fsec.fsec_mapper import fsec_rack_mapper_entity_to_bean
from cible.repository.fsec.models.fsec import FsecEntity
from cible.repository.fsec.models.referential.fsec_rack import FsecRackEntity


class FsecRackRepository(IFsecRackRepository):

    def update_rack(self, rack: FsecRackBean) -> FsecRackBean:
        try:
            existing_rack = get_object_or_404(FsecRackEntity, pk=rack.id)

            existing_rack.is_full = rack.isFull

            existing_rack.save()
            return fsec_rack_mapper_entity_to_bean(existing_rack)

        except Exception:
            raise ValueError(f"Erreur lors de la mise à jour du rack : {rack.label}")

    def get_rack_occupancy(self, rack_id) -> int:
        racks = FsecEntity.objects.filter(rack_id=rack_id, is_active=True)
        return len(racks)

    def get_all_racks_available(self) -> list[FsecRackBean]:
        racks = FsecRackEntity.objects.filter(is_full=False)
        if len(racks) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: fsec_rack_mapper_entity_to_bean(x),
                    racks,
                )
            )
