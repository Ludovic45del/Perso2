"""Repository UsableStep - Implémentation IUsableStepRepository."""
from typing import List, Optional

from django.db import transaction

from cible.domain.steps.interface.steps_repository import IUsableStepRepository
from cible.domain.steps.models.usable_step_bean import UsableStepBean
from cible.mapper.steps.usable_step_mapper import (
    usable_step_mapper_bean_to_entity,
    usable_step_mapper_entity_to_bean,
)
from cible.repository.steps.models.usable_step_entity import UsableStepEntity


class UsableStepRepository(IUsableStepRepository):
    """Implémentation du repository UsableStep."""

    @transaction.atomic
    def create(self, bean: UsableStepBean) -> UsableStepBean:
        """Crée une nouvelle étape utilisable/livrable."""
        entity = usable_step_mapper_bean_to_entity(bean)
        entity.save()
        return usable_step_mapper_entity_to_bean(entity)

    def get_by_uuid(self, uuid: str) -> Optional[UsableStepBean]:
        """Récupère une étape par son UUID."""
        try:
            entity = UsableStepEntity.objects.get(uuid=uuid)
            return usable_step_mapper_entity_to_bean(entity)
        except UsableStepEntity.DoesNotExist:
            return None

    def get_by_fsec_version_id(self, fsec_version_id: str) -> List[UsableStepBean]:
        """Récupère toutes les étapes d'un FSEC."""
        entities = UsableStepEntity.objects.filter(fsec_version_id_id=fsec_version_id)
        return [usable_step_mapper_entity_to_bean(entity) for entity in entities]

    @transaction.atomic
    def update(self, bean: UsableStepBean) -> UsableStepBean:
        """Met à jour une étape."""
        entity = UsableStepEntity.objects.get(uuid=bean.uuid)
        entity.fsec_version_id_id = bean.fsec_version_id
        entity.delivery_date = bean.delivery_date
        entity.save()
        return usable_step_mapper_entity_to_bean(entity)

    @transaction.atomic
    def delete(self, uuid: str) -> bool:
        """Supprime une étape par son UUID."""
        try:
            entity = UsableStepEntity.objects.get(uuid=uuid)
            entity.delete()
            return True
        except UsableStepEntity.DoesNotExist:
            return False
