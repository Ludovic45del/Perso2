"""Repository ShotStep - Implémentation IShotStepRepository."""
from typing import List, Optional

from django.db import transaction

from cible.domain.steps.interface.steps_repository import IShotStepRepository
from cible.domain.steps.models.shot_step_bean import ShotStepBean
from cible.mapper.steps.shot_step_mapper import (
    shot_step_mapper_bean_to_entity,
    shot_step_mapper_entity_to_bean,
)
from cible.repository.steps.models.shot_step_entity import ShotStepEntity


class ShotStepRepository(IShotStepRepository):
    """Implémentation du repository ShotStep."""

    @transaction.atomic
    def create(self, bean: ShotStepBean) -> ShotStepBean:
        """Crée une nouvelle étape de tir."""
        entity = shot_step_mapper_bean_to_entity(bean)
        entity.save()
        return shot_step_mapper_entity_to_bean(entity)

    def get_by_uuid(self, uuid: str) -> Optional[ShotStepBean]:
        """Récupère une étape de tir par son UUID."""
        try:
            entity = ShotStepEntity.objects.get(uuid=uuid)
            return shot_step_mapper_entity_to_bean(entity)
        except ShotStepEntity.DoesNotExist:
            return None

    def get_by_fsec_version_id(self, fsec_version_id: str) -> List[ShotStepBean]:
        """Récupère toutes les étapes de tir d'un FSEC."""
        entities = ShotStepEntity.objects.filter(fsec_version_id_id=fsec_version_id)
        return [shot_step_mapper_entity_to_bean(entity) for entity in entities]

    @transaction.atomic
    def update(self, bean: ShotStepBean) -> ShotStepBean:
        """Met à jour une étape de tir."""
        entity = ShotStepEntity.objects.get(uuid=bean.uuid)
        entity.fsec_version_id_id = bean.fsec_version_id
        entity.shot_date = bean.shot_date
        entity.shot_reference = bean.shot_reference
        entity.shot_parameters = bean.shot_parameters
        entity.shot_successful = bean.shot_successful
        entity.result_summary = bean.result_summary
        entity.started_at = bean.started_at
        entity.completed_at = bean.completed_at
        entity.completed_by = bean.completed_by
        entity.is_validated = bean.is_validated
        entity.save()
        return shot_step_mapper_entity_to_bean(entity)

    @transaction.atomic
    def delete(self, uuid: str) -> bool:
        """Supprime une étape de tir par son UUID."""
        try:
            entity = ShotStepEntity.objects.get(uuid=uuid)
            entity.delete()
            return True
        except ShotStepEntity.DoesNotExist:
            return False
