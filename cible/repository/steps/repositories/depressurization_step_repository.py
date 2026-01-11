"""Repository DepressurizationStep - Implémentation."""
from typing import Optional

from django.db import transaction

from cible.domain.steps.interface.steps_repository import (
    IDepressurizationStepRepository,
)
from cible.domain.steps.models.depressurization_step_bean import (
    DepressurizationStepBean,
)
from cible.mapper.steps.depressurization_step_mapper import (
    depressurization_step_mapper_bean_to_entity,
    depressurization_step_mapper_entity_to_bean,
)
from cible.repository.steps.models.depressurization_step_entity import (
    DepressurizationStepEntity,
)


class DepressurizationStepRepository(IDepressurizationStepRepository):
    """Implémentation du repository DepressurizationStep."""

    @transaction.atomic
    def create(self, bean: DepressurizationStepBean) -> DepressurizationStepBean:
        """Crée une nouvelle étape de dépressurisation."""
        entity = depressurization_step_mapper_bean_to_entity(bean)
        entity.save()
        return depressurization_step_mapper_entity_to_bean(entity)

    def get_by_uuid(self, uuid: str) -> Optional[DepressurizationStepBean]:
        """Récupère une étape de dépressurisation par son UUID."""
        try:
            entity = DepressurizationStepEntity.objects.get(uuid=uuid)
            return depressurization_step_mapper_entity_to_bean(entity)
        except DepressurizationStepEntity.DoesNotExist:
            return None

    def get_by_fsec_version_id(
        self, fsec_version_id: str
    ) -> Optional[DepressurizationStepBean]:
        """Récupère l'étape de dépressurisation d'un FSEC (single)."""
        try:
            entity = DepressurizationStepEntity.objects.get(
                fsec_version_id_id=fsec_version_id
            )
            return depressurization_step_mapper_entity_to_bean(entity)
        except DepressurizationStepEntity.DoesNotExist:
            return None

    @transaction.atomic
    def update(self, bean: DepressurizationStepBean) -> DepressurizationStepBean:
        """Met à jour une étape de dépressurisation."""
        entity = DepressurizationStepEntity.objects.get(uuid=bean.uuid)
        entity.fsec_version_id_id = bean.fsec_version_id
        entity.operator = bean.operator
        entity.date_of_fulfilment = bean.date_of_fulfilment
        entity.pressure_gauge = bean.pressure_gauge
        entity.enclosure_pressure_measured = bean.enclosure_pressure_measured
        entity.start_time = bean.start_time
        entity.end_time = bean.end_time
        entity.observations = bean.observations
        entity.depressurization_time_before_firing = (
            bean.depressurization_time_before_firing
        )
        entity.computed_pressure_before_firing = bean.computed_pressure_before_firing
        entity.save()
        return depressurization_step_mapper_entity_to_bean(entity)

    @transaction.atomic
    def delete(self, uuid: str) -> bool:
        """Supprime une étape de dépressurisation par son UUID."""
        try:
            entity = DepressurizationStepEntity.objects.get(uuid=uuid)
            entity.delete()
            return True
        except DepressurizationStepEntity.DoesNotExist:
            return False
