"""Repository CampaignTeams - Implémentation ICampaignTeamsRepository."""
from typing import List, Optional

from django.db import transaction

from cible.domain.campaign.interface.campaign_repository import (
    ICampaignTeamsRepository,
)
from cible.domain.campaign.models.campaign_teams_bean import CampaignTeamsBean
from cible.mapper.campaign.campaign_teams_mapper import (
    campaign_teams_mapper_bean_to_entity,
    campaign_teams_mapper_entity_to_bean,
)
from cible.repository.campaign.models.campaign_teams_entity import CampaignTeamsEntity


class CampaignTeamsRepository(ICampaignTeamsRepository):
    """Implémentation du repository CampaignTeams."""

    @transaction.atomic
    def create(self, bean: CampaignTeamsBean) -> CampaignTeamsBean:
        """Crée un nouveau membre d'équipe."""
        entity = campaign_teams_mapper_bean_to_entity(bean)
        entity.save()
        return campaign_teams_mapper_entity_to_bean(entity)

    def get_by_uuid(self, uuid: str) -> Optional[CampaignTeamsBean]:
        """Récupère un membre d'équipe par son UUID."""
        try:
            entity = CampaignTeamsEntity.objects.get(uuid=uuid)
            return campaign_teams_mapper_entity_to_bean(entity)
        except CampaignTeamsEntity.DoesNotExist:
            return None

    def get_by_campaign_uuid(self, campaign_uuid: str) -> List[CampaignTeamsBean]:
        """Récupère tous les membres d'une équipe de campagne."""
        entities = CampaignTeamsEntity.objects.filter(campaign_uuid_id=campaign_uuid)
        return [campaign_teams_mapper_entity_to_bean(entity) for entity in entities]

    @transaction.atomic
    def update(self, bean: CampaignTeamsBean) -> CampaignTeamsBean:
        """Met à jour un membre d'équipe."""
        entity = CampaignTeamsEntity.objects.get(uuid=bean.uuid)
        entity.campaign_uuid_id = bean.campaign_uuid
        entity.role_id_id = bean.role_id
        entity.name = bean.name
        entity.save()
        return campaign_teams_mapper_entity_to_bean(entity)

    @transaction.atomic
    def delete(self, uuid: str) -> bool:
        """Supprime un membre d'équipe par son UUID."""
        try:
            entity = CampaignTeamsEntity.objects.get(uuid=uuid)
            entity.delete()
            return True
        except CampaignTeamsEntity.DoesNotExist:
            return False
