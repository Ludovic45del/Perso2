"""Repository CampaignDocuments - Implémentation ICampaignDocumentsRepository."""
from typing import List, Optional

from django.db import transaction

from cible.domain.campaign.interface.campaign_repository import (
    ICampaignDocumentsRepository,
)
from cible.domain.campaign.models.campaign_documents_bean import CampaignDocumentsBean
from cible.mapper.campaign.campaign_documents_mapper import (
    campaign_documents_mapper_bean_to_entity,
    campaign_documents_mapper_entity_to_bean,
)
from cible.repository.campaign.models.campaign_documents_entity import (
    CampaignDocumentsEntity,
)


class CampaignDocumentsRepository(ICampaignDocumentsRepository):
    """Implémentation du repository CampaignDocuments."""

    @transaction.atomic
    def create(self, bean: CampaignDocumentsBean) -> CampaignDocumentsBean:
        """Crée un nouveau document."""
        entity = campaign_documents_mapper_bean_to_entity(bean)
        entity.save()
        return campaign_documents_mapper_entity_to_bean(entity)

    def get_by_uuid(self, uuid: str) -> Optional[CampaignDocumentsBean]:
        """Récupère un document par son UUID."""
        try:
            entity = CampaignDocumentsEntity.objects.get(uuid=uuid)
            return campaign_documents_mapper_entity_to_bean(entity)
        except CampaignDocumentsEntity.DoesNotExist:
            return None

    def get_by_campaign_uuid(self, campaign_uuid: str) -> List[CampaignDocumentsBean]:
        """Récupère tous les documents d'une campagne."""
        entities = CampaignDocumentsEntity.objects.filter(
            campaign_uuid_id=campaign_uuid
        )
        return [
            campaign_documents_mapper_entity_to_bean(entity) for entity in entities
        ]

    @transaction.atomic
    def update(self, bean: CampaignDocumentsBean) -> CampaignDocumentsBean:
        """Met à jour un document."""
        entity = CampaignDocumentsEntity.objects.get(uuid=bean.uuid)
        entity.campaign_uuid_id = bean.campaign_uuid
        entity.subtype_id_id = bean.subtype_id
        entity.file_type_id_id = bean.file_type_id
        entity.name = bean.name
        entity.path = bean.path
        entity.date = bean.date
        entity.save()
        return campaign_documents_mapper_entity_to_bean(entity)

    @transaction.atomic
    def delete(self, uuid: str) -> bool:
        """Supprime un document par son UUID."""
        try:
            entity = CampaignDocumentsEntity.objects.get(uuid=uuid)
            entity.delete()
            return True
        except CampaignDocumentsEntity.DoesNotExist:
            return False
