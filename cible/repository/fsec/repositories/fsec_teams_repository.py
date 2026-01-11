"""Repository FsecTeams - Implémentation IFsecTeamsRepository."""
from typing import List, Optional

from django.db import transaction

from cible.domain.fsec.interface.fsec_repository import IFsecTeamsRepository
from cible.domain.fsec.models.fsec_teams_bean import FsecTeamsBean
from cible.mapper.fsec.fsec_teams_mapper import (
    fsec_teams_mapper_bean_to_entity,
    fsec_teams_mapper_entity_to_bean,
)
from cible.repository.fsec.models.fsec_teams_entity import FsecTeamsEntity


class FsecTeamsRepository(IFsecTeamsRepository):
    """Implémentation du repository FsecTeams."""

    @transaction.atomic
    def create(self, bean: FsecTeamsBean) -> FsecTeamsBean:
        """Crée un nouveau membre d'équipe."""
        entity = fsec_teams_mapper_bean_to_entity(bean)
        entity.save()
        return fsec_teams_mapper_entity_to_bean(entity)

    def get_by_uuid(self, uuid: str) -> Optional[FsecTeamsBean]:
        """Récupère un membre d'équipe par son UUID."""
        try:
            entity = FsecTeamsEntity.objects.select_related(
                'fsec_id', 'role_id'
            ).get(uuid=uuid)
            return fsec_teams_mapper_entity_to_bean(entity)
        except FsecTeamsEntity.DoesNotExist:
            return None

    def get_by_fsec_id(self, fsec_id: str) -> List[FsecTeamsBean]:
        """Récupère tous les membres d'une équipe FSEC."""
        entities = FsecTeamsEntity.objects.select_related(
            'fsec_id', 'role_id'
        ).filter(fsec_id_id=fsec_id)
        return [fsec_teams_mapper_entity_to_bean(entity) for entity in entities]

    @transaction.atomic
    def update(self, bean: FsecTeamsBean) -> FsecTeamsBean:
        """Met à jour un membre d'équipe."""
        entity = FsecTeamsEntity.objects.select_related(
            'fsec_id', 'role_id'
        ).get(uuid=bean.uuid)
        entity.fsec_id_id = bean.fsec_id
        entity.role_id_id = bean.role_id
        entity.name = bean.name
        entity.save()
        return fsec_teams_mapper_entity_to_bean(entity)

    @transaction.atomic
    def delete(self, uuid: str) -> bool:
        """Supprime un membre d'équipe par son UUID."""
        try:
            entity = FsecTeamsEntity.objects.get(uuid=uuid)
            entity.delete()
            return True
        except FsecTeamsEntity.DoesNotExist:
            return False
