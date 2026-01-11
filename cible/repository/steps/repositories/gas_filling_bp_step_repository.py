"""Repository GasFillingBpStep - Implémentation."""
from typing import Optional

from django.db import transaction

from cible.domain.steps.interface.steps_repository import IGasFillingBpStepRepository
from cible.domain.steps.models.gas_filling_bp_step_bean import GasFillingBpStepBean
from cible.mapper.steps.gas_filling_bp_step_mapper import (
    gas_filling_bp_step_mapper_bean_to_entity,
    gas_filling_bp_step_mapper_entity_to_bean,
)
from cible.repository.steps.models.gas_filling_bp_step_entity import (
    GasFillingBpStepEntity,
)


class GasFillingBpStepRepository(IGasFillingBpStepRepository):
    """Implémentation du repository GasFillingBpStep."""

    @transaction.atomic
    def create(self, bean: GasFillingBpStepBean) -> GasFillingBpStepBean:
        """Crée un nouveau remplissage gaz BP."""
        entity = gas_filling_bp_step_mapper_bean_to_entity(bean)
        entity.save()
        return gas_filling_bp_step_mapper_entity_to_bean(entity)

    def get_by_uuid(self, uuid: str) -> Optional[GasFillingBpStepBean]:
        """Récupère un remplissage gaz BP par son UUID."""
        try:
            entity = GasFillingBpStepEntity.objects.get(uuid=uuid)
            return gas_filling_bp_step_mapper_entity_to_bean(entity)
        except GasFillingBpStepEntity.DoesNotExist:
            return None

    def get_by_fsec_version_id(
        self, fsec_version_id: str
    ) -> Optional[GasFillingBpStepBean]:
        """Récupère le remplissage gaz BP d'un FSEC (single)."""
        try:
            entity = GasFillingBpStepEntity.objects.get(
                fsec_version_id_id=fsec_version_id
            )
            return gas_filling_bp_step_mapper_entity_to_bean(entity)
        except GasFillingBpStepEntity.DoesNotExist:
            return None

    @transaction.atomic
    def update(self, bean: GasFillingBpStepBean) -> GasFillingBpStepBean:
        """Met à jour un remplissage gaz BP."""
        entity = GasFillingBpStepEntity.objects.get(uuid=bean.uuid)
        entity.fsec_version_id_id = bean.fsec_version_id
        entity.leak_rate_dtri = bean.leak_rate_dtri
        entity.gas_type = bean.gas_type
        entity.experiment_pressure = bean.experiment_pressure
        entity.leak_test_duration = bean.leak_test_duration
        entity.operator = bean.operator
        entity.date_of_fulfilment = bean.date_of_fulfilment
        entity.gas_base = bean.gas_base
        entity.gas_container = bean.gas_container
        entity.observations = bean.observations
        entity.save()
        return gas_filling_bp_step_mapper_entity_to_bean(entity)

    @transaction.atomic
    def delete(self, uuid: str) -> bool:
        """Supprime un remplissage gaz BP par son UUID."""
        try:
            entity = GasFillingBpStepEntity.objects.get(uuid=uuid)
            entity.delete()
            return True
        except GasFillingBpStepEntity.DoesNotExist:
            return False
