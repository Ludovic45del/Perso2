"""Repository RepressurizationStep - Implémentation."""
from typing import Optional

from django.db import transaction

from cible.domain.steps.interface.steps_repository import (
    IRepressurizationStepRepository,
)
from cible.domain.steps.models.repressurization_step_bean import (
    RepressurizationStepBean,
)
from cible.mapper.steps.repressurization_step_mapper import (
    repressurization_step_mapper_bean_to_entity,
    repressurization_step_mapper_entity_to_bean,
)
from cible.repository.steps.models.repressurization_step_entity import (
    RepressurizationStepEntity,
)


class RepressurizationStepRepository(IRepressurizationStepRepository):
    """Implémentation du repository RepressurizationStep."""

    @transaction.atomic
    def create(self, bean: RepressurizationStepBean) -> RepressurizationStepBean:
        """Crée une nouvelle étape de repressurisation."""
        entity = repressurization_step_mapper_bean_to_entity(bean)
        entity.save()
        return repressurization_step_mapper_entity_to_bean(entity)

    def get_by_uuid(self, uuid: str) -> Optional[RepressurizationStepBean]:
        """Récupère une étape de repressurisation par son UUID."""
        try:
            entity = RepressurizationStepEntity.objects.get(uuid=uuid)
            return repressurization_step_mapper_entity_to_bean(entity)
        except RepressurizationStepEntity.DoesNotExist:
            return None

    def get_by_fsec_version_id(
        self, fsec_version_id: str
    ) -> Optional[RepressurizationStepBean]:
        """Récupère l'étape de repressurisation d'un FSEC (single)."""
        try:
            entity = RepressurizationStepEntity.objects.get(
                fsec_version_id_id=fsec_version_id
            )
            return repressurization_step_mapper_entity_to_bean(entity)
        except RepressurizationStepEntity.DoesNotExist:
            return None

    @transaction.atomic
    def update(self, bean: RepressurizationStepBean) -> RepressurizationStepBean:
        """Met à jour une étape de repressurisation."""
        entity = RepressurizationStepEntity.objects.get(uuid=bean.uuid)
        entity.fsec_version_id_id = bean.fsec_version_id
        entity.operator = bean.operator
        entity.gas_type = bean.gas_type
        entity.start_date = bean.start_date
        entity.estimated_end_date = bean.estimated_end_date
        entity.sensor_pressure = bean.sensor_pressure
        entity.computed_pressure = bean.computed_pressure
        entity.save()
        return repressurization_step_mapper_entity_to_bean(entity)

    @transaction.atomic
    def delete(self, uuid: str) -> bool:
        """Supprime une étape de repressurisation par son UUID."""
        try:
            entity = RepressurizationStepEntity.objects.get(uuid=uuid)
            entity.delete()
            return True
        except RepressurizationStepEntity.DoesNotExist:
            return False
