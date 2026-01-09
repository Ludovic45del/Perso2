"""Repository AirtightnessTestLpStep - Implémentation."""
from typing import Optional

from django.db import transaction

from cible.domain.steps.interface.steps_repository import (
    IAirtightnessTestLpStepRepository,
)
from cible.domain.steps.models.airtightness_test_lp_step_bean import (
    AirtightnessTestLpStepBean,
)
from cible.mapper.steps.airtightness_test_lp_step_mapper import (
    airtightness_test_lp_step_mapper_bean_to_entity,
    airtightness_test_lp_step_mapper_entity_to_bean,
)
from cible.repository.steps.models.airtightness_test_lp_step_entity import (
    AirtightnessTestLpStepEntity,
)


class AirtightnessTestLpStepRepository(IAirtightnessTestLpStepRepository):
    """Implémentation du repository AirtightnessTestLpStep."""

    @transaction.atomic
    def create(self, bean: AirtightnessTestLpStepBean) -> AirtightnessTestLpStepBean:
        """Crée un nouveau test d'étanchéité."""
        entity = airtightness_test_lp_step_mapper_bean_to_entity(bean)
        entity.save()
        return airtightness_test_lp_step_mapper_entity_to_bean(entity)

    def get_by_uuid(self, uuid: str) -> Optional[AirtightnessTestLpStepBean]:
        """Récupère un test d'étanchéité par son UUID."""
        try:
            entity = AirtightnessTestLpStepEntity.objects.get(uuid=uuid)
            return airtightness_test_lp_step_mapper_entity_to_bean(entity)
        except AirtightnessTestLpStepEntity.DoesNotExist:
            return None

    def get_by_fsec_version_id(
        self, fsec_version_id: str
    ) -> Optional[AirtightnessTestLpStepBean]:
        """Récupère le test d'étanchéité d'un FSEC (single)."""
        try:
            entity = AirtightnessTestLpStepEntity.objects.get(
                fsec_version_id_id=fsec_version_id
            )
            return airtightness_test_lp_step_mapper_entity_to_bean(entity)
        except AirtightnessTestLpStepEntity.DoesNotExist:
            return None

    @transaction.atomic
    def update(self, bean: AirtightnessTestLpStepBean) -> AirtightnessTestLpStepBean:
        """Met à jour un test d'étanchéité."""
        entity = AirtightnessTestLpStepEntity.objects.get(uuid=bean.uuid)
        entity.fsec_version_id_id = bean.fsec_version_id
        entity.leak_rate_dtri = bean.leak_rate_dtri
        entity.gas_type = bean.gas_type
        entity.experiment_pressure = bean.experiment_pressure
        entity.airtightness_test_duration = bean.airtightness_test_duration
        entity.operator = bean.operator
        entity.date_of_fulfilment = bean.date_of_fulfilment
        entity.save()
        return airtightness_test_lp_step_mapper_entity_to_bean(entity)

    @transaction.atomic
    def delete(self, uuid: str) -> bool:
        """Supprime un test d'étanchéité par son UUID."""
        try:
            entity = AirtightnessTestLpStepEntity.objects.get(uuid=uuid)
            entity.delete()
            return True
        except AirtightnessTestLpStepEntity.DoesNotExist:
            return False
