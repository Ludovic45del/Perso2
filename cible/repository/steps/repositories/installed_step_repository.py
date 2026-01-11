"""Repository InstalledStep - Implémentation IInstalledStepRepository."""
from typing import List, Optional

from django.db import transaction

from cible.domain.steps.interface.steps_repository import IInstalledStepRepository
from cible.domain.steps.models.installed_step_bean import InstalledStepBean
from cible.mapper.steps.installed_step_mapper import (
    installed_step_mapper_bean_to_entity,
    installed_step_mapper_entity_to_bean,
)
from cible.repository.steps.models.installed_step_entity import InstalledStepEntity


class InstalledStepRepository(IInstalledStepRepository):
    """Implémentation du repository InstalledStep."""

    @transaction.atomic
    def create(self, bean: InstalledStepBean) -> InstalledStepBean:
        """Crée une nouvelle étape installée (tir/pression)."""
        entity = installed_step_mapper_bean_to_entity(bean)
        entity.save()
        return installed_step_mapper_entity_to_bean(entity)

    def get_by_uuid(self, uuid: str) -> Optional[InstalledStepBean]:
        """Récupère une étape par son UUID."""
        try:
            entity = InstalledStepEntity.objects.get(uuid=uuid)
            return installed_step_mapper_entity_to_bean(entity)
        except InstalledStepEntity.DoesNotExist:
            return None

    def get_by_fsec_version_id(self, fsec_version_id: str) -> List[InstalledStepBean]:
        """Récupère toutes les étapes d'un FSEC."""
        entities = InstalledStepEntity.objects.filter(fsec_version_id_id=fsec_version_id)
        return [installed_step_mapper_entity_to_bean(entity) for entity in entities]

    @transaction.atomic
    def update(self, bean: InstalledStepBean) -> InstalledStepBean:
        """Met à jour une étape."""
        entity = InstalledStepEntity.objects.get(uuid=bean.uuid)
        entity.fsec_version_id_id = bean.fsec_version_id
        entity.shooting_date = bean.shooting_date
        entity.preshooting_pressure = bean.preshooting_pressure
        entity.experience_srxx = bean.experience_srxx
        entity.save()
        return installed_step_mapper_entity_to_bean(entity)

    @transaction.atomic
    def delete(self, uuid: str) -> bool:
        """Supprime une étape par son UUID."""
        try:
            entity = InstalledStepEntity.objects.get(uuid=uuid)
            entity.delete()
            return True
        except InstalledStepEntity.DoesNotExist:
            return False
