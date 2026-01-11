"""Repository SealingStep - Implémentation ISealingStepRepository."""
from typing import Optional

from django.db import transaction

from cible.domain.steps.interface.steps_repository import ISealingStepRepository
from cible.domain.steps.models.sealing_step_bean import SealingStepBean
from cible.mapper.steps.sealing_step_mapper import (
    sealing_step_mapper_bean_to_entity,
    sealing_step_mapper_entity_to_bean,
)
from cible.repository.steps.models.sealing_step_entity import SealingStepEntity


class SealingStepRepository(ISealingStepRepository):
    """Implémentation du repository SealingStep."""

    @transaction.atomic
    def create(self, bean: SealingStepBean) -> SealingStepBean:
        """Crée une nouvelle étape de scellement."""
        entity = sealing_step_mapper_bean_to_entity(bean)
        entity.save()
        return sealing_step_mapper_entity_to_bean(entity)

    def get_by_uuid(self, uuid: str) -> Optional[SealingStepBean]:
        """Récupère une étape de scellement par son UUID."""
        try:
            entity = SealingStepEntity.objects.get(uuid=uuid)
            return sealing_step_mapper_entity_to_bean(entity)
        except SealingStepEntity.DoesNotExist:
            return None

    def get_by_fsec_version_id(self, fsec_version_id: str) -> Optional[SealingStepBean]:
        """Récupère l'étape de scellement d'un FSEC (single)."""
        try:
            entity = SealingStepEntity.objects.get(fsec_version_id_id=fsec_version_id)
            return sealing_step_mapper_entity_to_bean(entity)
        except SealingStepEntity.DoesNotExist:
            return None

    @transaction.atomic
    def update(self, bean: SealingStepBean) -> SealingStepBean:
        """Met à jour une étape de scellement."""
        entity = SealingStepEntity.objects.get(uuid=bean.uuid)
        entity.fsec_version_id_id = bean.fsec_version_id
        entity.interface_io = bean.interface_io
        entity.comments = bean.comments
        entity.save()
        return sealing_step_mapper_entity_to_bean(entity)

    @transaction.atomic
    def delete(self, uuid: str) -> bool:
        """Supprime une étape de scellement par son UUID."""
        try:
            entity = SealingStepEntity.objects.get(uuid=uuid)
            entity.delete()
            return True
        except SealingStepEntity.DoesNotExist:
            return False
