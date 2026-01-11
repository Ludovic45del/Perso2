"""Repository MetrologyStep - Implémentation IMetrologyStepRepository."""
from typing import List, Optional

from django.db import transaction

from cible.domain.steps.interface.steps_repository import IMetrologyStepRepository
from cible.domain.steps.models.metrology_step_bean import MetrologyStepBean
from cible.mapper.steps.metrology_step_mapper import (
    metrology_step_mapper_bean_to_entity,
    metrology_step_mapper_entity_to_bean,
)
from cible.repository.steps.models.metrology_step_entity import MetrologyStepEntity


class MetrologyStepRepository(IMetrologyStepRepository):
    """Implémentation du repository MetrologyStep."""

    @transaction.atomic
    def create(self, bean: MetrologyStepBean) -> MetrologyStepBean:
        """Crée une nouvelle étape de métrologie."""
        entity = metrology_step_mapper_bean_to_entity(bean)
        entity.save()
        return metrology_step_mapper_entity_to_bean(entity)

    def get_by_uuid(self, uuid: str) -> Optional[MetrologyStepBean]:
        """Récupère une étape de métrologie par son UUID."""
        try:
            entity = MetrologyStepEntity.objects.get(uuid=uuid)
            return metrology_step_mapper_entity_to_bean(entity)
        except MetrologyStepEntity.DoesNotExist:
            return None

    def get_by_fsec_version_id(self, fsec_version_id: str) -> List[MetrologyStepBean]:
        """Récupère toutes les étapes de métrologie d'un FSEC."""
        entities = MetrologyStepEntity.objects.filter(fsec_version_id_id=fsec_version_id)
        return [metrology_step_mapper_entity_to_bean(entity) for entity in entities]

    @transaction.atomic
    def update(self, bean: MetrologyStepBean) -> MetrologyStepBean:
        """Met à jour une étape de métrologie."""
        entity = MetrologyStepEntity.objects.get(uuid=bean.uuid)
        entity.fsec_version_id_id = bean.fsec_version_id
        entity.machine_id_id = bean.machine_id
        entity.date = bean.date
        entity.comments = bean.comments
        entity.save()
        return metrology_step_mapper_entity_to_bean(entity)

    @transaction.atomic
    def delete(self, uuid: str) -> bool:
        """Supprime une étape de métrologie par son UUID."""
        try:
            entity = MetrologyStepEntity.objects.get(uuid=uuid)
            entity.delete()
            return True
        except MetrologyStepEntity.DoesNotExist:
            return False
