"""Repository PermeationStep - Implémentation."""
from typing import Optional

from django.db import transaction

from cible.domain.steps.interface.steps_repository import IPermeationStepRepository
from cible.domain.steps.models.permeation_step_bean import PermeationStepBean
from cible.mapper.steps.permeation_step_mapper import (
    permeation_step_mapper_bean_to_entity,
    permeation_step_mapper_entity_to_bean,
)
from cible.repository.steps.models.permeation_step_entity import PermeationStepEntity


class PermeationStepRepository(IPermeationStepRepository):
    """Implémentation du repository PermeationStep."""

    @transaction.atomic
    def create(self, bean: PermeationStepBean) -> PermeationStepBean:
        """Crée une nouvelle étape de perméation."""
        entity = permeation_step_mapper_bean_to_entity(bean)
        entity.save()
        return permeation_step_mapper_entity_to_bean(entity)

    def get_by_uuid(self, uuid: str) -> Optional[PermeationStepBean]:
        """Récupère une étape de perméation par son UUID."""
        try:
            entity = PermeationStepEntity.objects.get(uuid=uuid)
            return permeation_step_mapper_entity_to_bean(entity)
        except PermeationStepEntity.DoesNotExist:
            return None

    def get_by_fsec_version_id(
        self, fsec_version_id: str
    ) -> Optional[PermeationStepBean]:
        """Récupère l'étape de perméation d'un FSEC (single)."""
        try:
            entity = PermeationStepEntity.objects.get(
                fsec_version_id_id=fsec_version_id
            )
            return permeation_step_mapper_entity_to_bean(entity)
        except PermeationStepEntity.DoesNotExist:
            return None

    @transaction.atomic
    def update(self, bean: PermeationStepBean) -> PermeationStepBean:
        """Met à jour une étape de perméation."""
        entity = PermeationStepEntity.objects.get(uuid=bean.uuid)
        entity.fsec_version_id_id = bean.fsec_version_id
        entity.gas_type = bean.gas_type
        entity.target_pressure = bean.target_pressure
        entity.operator = bean.operator
        entity.start_date = bean.start_date
        entity.estimated_end_date = bean.estimated_end_date
        entity.sensor_pressure = bean.sensor_pressure
        entity.computed_shot_pressure = bean.computed_shot_pressure
        entity.save()
        return permeation_step_mapper_entity_to_bean(entity)

    @transaction.atomic
    def delete(self, uuid: str) -> bool:
        """Supprime une étape de perméation par son UUID."""
        try:
            entity = PermeationStepEntity.objects.get(uuid=uuid)
            entity.delete()
            return True
        except PermeationStepEntity.DoesNotExist:
            return False
