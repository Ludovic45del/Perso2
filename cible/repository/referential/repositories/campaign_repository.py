"""
Campaign Repository Implementation.

This module implements the ICampaignRepository interface using Django ORM.
"""

from typing import List, Optional
from uuid import UUID

from cible.domain.referential.interface.campaign_repository import ICampaignRepository
from cible.domain.referential.models.campaign_bean import CampaignBean
from cible.mapper.referential.campaign_mapper import (
    campaign_mapper_bean_to_entity,
    campaign_mapper_entity_to_bean,
)
from ..models.campaign_entity import CampaignEntity


class CampaignRepository(ICampaignRepository):
    """
    Django ORM implementation of ICampaignRepository.

    This repository handles all database operations for Campaign entities
    using Django's ORM.
    """

    def create(self, bean: CampaignBean) -> CampaignBean:
        """Create a new campaign."""
        entity = campaign_mapper_bean_to_entity(bean)
        entity.save()
        return campaign_mapper_entity_to_bean(entity)

    def get_by_uuid(self, uuid: UUID) -> Optional[CampaignBean]:
        """Get a campaign by UUID."""
        try:
            entity = CampaignEntity.objects.get(uuid=uuid)
            return campaign_mapper_entity_to_bean(entity)
        except CampaignEntity.DoesNotExist:
            return None

    def get_by_code(self, code: str) -> Optional[CampaignBean]:
        """Get a campaign by code."""
        try:
            entity = CampaignEntity.objects.get(code=code)
            return campaign_mapper_entity_to_bean(entity)
        except CampaignEntity.DoesNotExist:
            return None

    def get_all(self) -> List[CampaignBean]:
        """Get all campaigns."""
        entities = CampaignEntity.objects.all()
        return [campaign_mapper_entity_to_bean(entity) for entity in entities]

    def get_active(self) -> List[CampaignBean]:
        """Get all active campaigns."""
        entities = CampaignEntity.objects.filter(is_active=True)
        return [campaign_mapper_entity_to_bean(entity) for entity in entities]

    def update(self, bean: CampaignBean) -> CampaignBean:
        """Update an existing campaign."""
        try:
            # Get existing entity
            existing = CampaignEntity.objects.get(uuid=bean.uuid)

            # Update fields
            existing.name = bean.name
            existing.year = bean.year
            existing.code = bean.code
            existing.description = bean.description
            existing.start_date = bean.start_date
            existing.end_date = bean.end_date
            existing.is_active = bean.is_active

            existing.save()
            return campaign_mapper_entity_to_bean(existing)

        except CampaignEntity.DoesNotExist:
            raise ValueError(f"Campaign with UUID {bean.uuid} not found")

    def delete(self, uuid: UUID) -> bool:
        """Delete a campaign."""
        try:
            entity = CampaignEntity.objects.get(uuid=uuid)
            entity.delete()
            return True
        except CampaignEntity.DoesNotExist:
            return False

    def exists_by_code(self, code: str) -> bool:
        """Check if a campaign with the given code exists."""
        return CampaignEntity.objects.filter(code=code).exists()
