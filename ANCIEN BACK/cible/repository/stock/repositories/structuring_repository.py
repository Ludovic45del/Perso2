import uuid

from django.db import transaction
from django.shortcuts import get_object_or_404

from cible.domain.stock.interface.i_structuring_repository import IStructuringRepository
from cible.domain.stock.models.special_structuring_bean import SpecialStructuringBean
from cible.domain.stock.models.structuring_bean import StructuringBean
from cible.mapper.stock.special_structuring_mapper import (
    special_structuring_mapper_bean_to_entity,
    special_structuring_mapper_entity_to_bean,
)
from cible.mapper.stock.structuring_mapper import (
    structuring_mapper_bean_to_entity,
    structuring_mapper_entity_to_bean,
)
from cible.repository.fsec.models.fsec import FsecEntity
from cible.repository.stock.models.structuring.special_structuring import (
    SpecialStructuringEntity,
)
from cible.repository.stock.models.structuring.structuring import StructuringEntity


class StructuringRepository(IStructuringRepository):

    def get_all_structuring(self) -> list[StructuringBean]:
        benches = StructuringEntity.objects.all()
        if len(benches) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: structuring_mapper_entity_to_bean(x),
                    benches,
                )
            )

    def get_all_special_structuring(self) -> list[SpecialStructuringBean]:
        benches = SpecialStructuringEntity.objects.all()
        if len(benches) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: special_structuring_mapper_entity_to_bean(x),
                    benches,
                )
            )

    def delete_structuring(self, object_uuid: str) -> list[StructuringBean]:
        structuring = get_object_or_404(StructuringEntity, uuid=object_uuid)
        structuring.delete()

        updated_list = StructuringEntity.objects.all()

        if len(updated_list) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: structuring_mapper_entity_to_bean(x),
                    updated_list,
                )
            )

    def delete_special_structuring(
        self, object_uuid: str
    ) -> list[SpecialStructuringBean]:
        special_structuring = get_object_or_404(
            SpecialStructuringEntity, uuid=object_uuid
        )
        special_structuring.delete()

        updated_list = SpecialStructuringEntity.objects.all()

        if len(updated_list) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: special_structuring_mapper_entity_to_bean(x),
                    updated_list,
                )
            )

    @transaction.atomic
    def create_structuring(
        self, structuring_bean: StructuringBean
    ) -> list[StructuringBean]:
        structuring_entity = structuring_mapper_bean_to_entity(structuring_bean)
        structuring_entity.uuid = uuid.uuid4()
        structuring_entity.save()

        updated_list = StructuringEntity.objects.all()

        if len(updated_list) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: structuring_mapper_entity_to_bean(x),
                    updated_list,
                )
            )

    @transaction.atomic
    def create_special_structuring(
        self, special_structuring_bean: SpecialStructuringBean
    ) -> list[SpecialStructuringBean]:
        special_structuring_entity = special_structuring_mapper_bean_to_entity(
            special_structuring_bean
        )
        special_structuring_entity.uuid = uuid.uuid4()
        special_structuring_entity.save()

        updated_list = SpecialStructuringEntity.objects.all()

        if len(updated_list) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: special_structuring_mapper_entity_to_bean(x),
                    updated_list,
                )
            )

    @transaction.atomic
    def create_structuring_from_excel_sheet(
        self, structuring_bean: StructuringBean
    ) -> None:
        structuring_entity = structuring_mapper_bean_to_entity(structuring_bean)
        structuring_entity.uuid = uuid.uuid4()

        if structuring_bean.fsec:
            fsec = FsecEntity.objects.get(name=structuring_bean.fsec)
            structuring_entity.fsec = fsec

        structuring_entity.save()

    @transaction.atomic
    def create_special_structuring_from_excel_sheet(
        self, special_structuring_bean: SpecialStructuringBean
    ) -> None:
        special_structuring_entity = special_structuring_mapper_bean_to_entity(
            special_structuring_bean
        )
        special_structuring_entity.uuid = uuid.uuid4()

        if special_structuring_bean.fsec:
            fsec = FsecEntity.objects.get(name=special_structuring_bean.fsec)
            special_structuring_entity.fsec = fsec

        special_structuring_entity.save()

    @transaction.atomic
    def add_additional_comment_to_structuring(
        self, comment: str, object_uuid: str
    ) -> None:
        structuring_entity = StructuringEntity.objects.get(uuid=object_uuid)

        structuring_entity.additional_comment = comment
        structuring_entity.save()

    @transaction.atomic
    def add_additional_comment_to_special_structuring(
        self, comment: str, object_uuid: str
    ) -> None:
        special_structuring_entity = SpecialStructuringEntity.objects.get(
            uuid=object_uuid
        )

        special_structuring_entity.additional_comment = comment
        special_structuring_entity.save()
