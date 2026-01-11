"""Repository DesignStep - Implémentation IDesignStepRepository."""
from typing import List, Optional

from django.db import transaction

from cible.domain.steps.interface.steps_repository import IDesignStepRepository
from cible.domain.steps.models.design_step_bean import DesignStepBean
from cible.mapper.steps.design_step_mapper import (
    design_step_mapper_bean_to_entity,
    design_step_mapper_entity_to_bean,
)
from cible.repository.steps.models.design_step_entity import DesignStepEntity


class DesignStepRepository(IDesignStepRepository):
    """Implémentation du repository DesignStep."""

    @transaction.atomic
    def create(self, bean: DesignStepBean) -> DesignStepBean:
        """Crée une nouvelle étape de design."""
        entity = design_step_mapper_bean_to_entity(bean)
        entity.save()
        return design_step_mapper_entity_to_bean(entity)

    def get_by_uuid(self, uuid: str) -> Optional[DesignStepBean]:
        """Récupère une étape de design par son UUID."""
        try:
            entity = DesignStepEntity.objects.get(uuid=uuid)
            return design_step_mapper_entity_to_bean(entity)
        except DesignStepEntity.DoesNotExist:
            return None

    def get_by_fsec_version_id(self, fsec_version_id: str) -> List[DesignStepBean]:
        """Récupère toutes les étapes de design d'un FSEC."""
        entities = DesignStepEntity.objects.filter(fsec_version_id_id=fsec_version_id)
        return [design_step_mapper_entity_to_bean(entity) for entity in entities]

    @transaction.atomic
    def update(self, bean: DesignStepBean) -> DesignStepBean:
        """Met à jour une étape de design."""
        entity = DesignStepEntity.objects.get(uuid=bean.uuid)
        entity.fsec_version_id_id = bean.fsec_version_id
        entity.comments = bean.comments
        entity.save()
        return design_step_mapper_entity_to_bean(entity)

    @transaction.atomic
    def delete(self, uuid: str) -> bool:
        """Supprime une étape de design par son UUID."""
        try:
            entity = DesignStepEntity.objects.get(uuid=uuid)
            entity.delete()
            return True
        except DesignStepEntity.DoesNotExist:
            return False
