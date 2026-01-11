import uuid

from django.db import transaction
from django.shortcuts import get_object_or_404

from cible.domain.stock.interface.i_consumables_repository import IConsumablesRepository
from cible.domain.stock.models.consumables_glues_bean import ConsumablesGluesBean
from cible.domain.stock.models.other_consumables_bean import OtherConsumablesBean
from cible.mapper.stock.consumables_glues_mapper import (
    consumables_glues_mapper_bean_to_entity,
    consumables_glues_mapper_entity_to_bean,
)
from cible.mapper.stock.other_consumables_mapper import (
    other_consumables_mapper_bean_to_entity,
    other_consumables_mapper_entity_to_bean,
)
from cible.repository.stock.models.consumables.consumables_glues import (
    ConsumablesGluesEntity,
)
from cible.repository.stock.models.consumables.other_consumables import (
    OtherConsumablesEntity,
)


class ConsumablesRepository(IConsumablesRepository):

    def get_all_consumables_glues(self) -> list[ConsumablesGluesBean]:
        benches = ConsumablesGluesEntity.objects.all()
        if len(benches) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: consumables_glues_mapper_entity_to_bean(x),
                    benches,
                )
            )

    def get_all_other_consumables(self) -> list[OtherConsumablesBean]:
        benches = OtherConsumablesEntity.objects.all()
        if len(benches) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: other_consumables_mapper_entity_to_bean(x),
                    benches,
                )
            )

    @transaction.atomic
    def delete_consumables_glues(self, object_uuid: str) -> list[ConsumablesGluesBean]:
        consumables_glues = get_object_or_404(ConsumablesGluesEntity, uuid=object_uuid)
        consumables_glues.delete()

        updated_list = ConsumablesGluesEntity.objects.all()

        if len(updated_list) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: consumables_glues_mapper_entity_to_bean(x),
                    updated_list,
                )
            )

    @transaction.atomic
    def delete_other_consumables(self, object_uuid: str) -> list[OtherConsumablesBean]:
        other_consumables = get_object_or_404(OtherConsumablesEntity, uuid=object_uuid)
        other_consumables.delete()

        updated_list = OtherConsumablesEntity.objects.all()

        if len(updated_list) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: other_consumables_mapper_entity_to_bean(x),
                    updated_list,
                )
            )

    @transaction.atomic
    def create_consumables_glues(
        self, consumables_glues_bean: ConsumablesGluesBean
    ) -> list[ConsumablesGluesBean]:
        consumables_glues_entity = consumables_glues_mapper_bean_to_entity(
            consumables_glues_bean
        )
        consumables_glues_entity.uuid = uuid.uuid4()
        consumables_glues_entity.save()

        updated_list = ConsumablesGluesEntity.objects.all()

        if len(updated_list) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: consumables_glues_mapper_entity_to_bean(x),
                    updated_list,
                )
            )

    @transaction.atomic
    def create_other_consumables(
        self, other_consumables_bean: OtherConsumablesBean
    ) -> list[OtherConsumablesBean]:
        other_consumables_entity = other_consumables_mapper_bean_to_entity(
            other_consumables_bean
        )
        other_consumables_entity.uuid = uuid.uuid4()
        other_consumables_entity.save()

        updated_list = OtherConsumablesEntity.objects.all()

        if len(updated_list) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: other_consumables_mapper_entity_to_bean(x),
                    updated_list,
                )
            )

    @transaction.atomic
    def create_consumables_glues_from_excel_sheet(
        self, consumables_glues_bean: ConsumablesGluesBean
    ) -> None:
        consumables_glues_entity = consumables_glues_mapper_bean_to_entity(
            consumables_glues_bean
        )
        consumables_glues_entity.uuid = uuid.uuid4()
        consumables_glues_entity.save()

    @transaction.atomic
    def create_other_consumables_from_excel_sheet(
        self, other_consumables_bean: OtherConsumablesBean
    ) -> None:
        other_consumables_entity = other_consumables_mapper_bean_to_entity(
            other_consumables_bean
        )
        other_consumables_entity.uuid = uuid.uuid4()
        other_consumables_entity.save()

    @transaction.atomic
    def add_additional_comment_to_consumables_glues(
        self, comment: str, object_uuid: str
    ) -> None:
        consumables_glues_entity = ConsumablesGluesEntity.objects.get(uuid=object_uuid)

        consumables_glues_entity.additional_comment = comment
        consumables_glues_entity.save()

    @transaction.atomic
    def add_additional_comment_to_other_consumables(
        self, comment: str, object_uuid: str
    ) -> None:
        other_consumables_entity = OtherConsumablesEntity.objects.get(uuid=object_uuid)

        other_consumables_entity.additional_comment = comment
        other_consumables_entity.save()
