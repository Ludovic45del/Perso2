"""Repository GasFillingHpStep - Implémentation."""
from typing import Optional

from django.db import transaction

from cible.domain.steps.interface.steps_repository import IGasFillingHpStepRepository
from cible.domain.steps.models.gas_filling_hp_step_bean import GasFillingHpStepBean
from cible.mapper.steps.gas_filling_hp_step_mapper import (
    gas_filling_hp_step_mapper_bean_to_entity,
    gas_filling_hp_step_mapper_entity_to_bean,
)
from cible.repository.steps.models.gas_filling_hp_step_entity import (
    GasFillingHpStepEntity,
)


class GasFillingHpStepRepository(IGasFillingHpStepRepository):
    """Implémentation du repository GasFillingHpStep."""

    @transaction.atomic
    def create(self, bean: GasFillingHpStepBean) -> GasFillingHpStepBean:
        """Crée un nouveau remplissage gaz HP."""
        entity = gas_filling_hp_step_mapper_bean_to_entity(bean)
        entity.save()
        return gas_filling_hp_step_mapper_entity_to_bean(entity)

    def get_by_uuid(self, uuid: str) -> Optional[GasFillingHpStepBean]:
        """Récupère un remplissage gaz HP par son UUID."""
        try:
            entity = GasFillingHpStepEntity.objects.get(uuid=uuid)
            return gas_filling_hp_step_mapper_entity_to_bean(entity)
        except GasFillingHpStepEntity.DoesNotExist:
            return None

    def get_by_fsec_version_id(
        self, fsec_version_id: str
    ) -> Optional[GasFillingHpStepBean]:
        """Récupère le remplissage gaz HP d'un FSEC (single)."""
        try:
            entity = GasFillingHpStepEntity.objects.get(
                fsec_version_id_id=fsec_version_id
            )
            return gas_filling_hp_step_mapper_entity_to_bean(entity)
        except GasFillingHpStepEntity.DoesNotExist:
            return None

    @transaction.atomic
    def update(self, bean: GasFillingHpStepBean) -> GasFillingHpStepBean:
        """Met à jour un remplissage gaz HP."""
        entity = GasFillingHpStepEntity.objects.get(uuid=bean.uuid)
        entity.fsec_version_id_id = bean.fsec_version_id
        entity.leak_rate_dtri = bean.leak_rate_dtri
        entity.gas_type = bean.gas_type
        entity.experiment_pressure = bean.experiment_pressure
        entity.operator = bean.operator
        entity.date_of_fulfilment = bean.date_of_fulfilment
        entity.gas_base = bean.gas_base
        entity.gas_container = bean.gas_container
        entity.observations = bean.observations
        entity.save()
        return gas_filling_hp_step_mapper_entity_to_bean(entity)

    @transaction.atomic
    def delete(self, uuid: str) -> bool:
        """Supprime un remplissage gaz HP par son UUID."""
        try:
            entity = GasFillingHpStepEntity.objects.get(uuid=uuid)
            entity.delete()
            return True
        except GasFillingHpStepEntity.DoesNotExist:
            return False
