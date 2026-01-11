"""
Campaign Repository Interface.

This module defines the abstract interface for Campaign repository operations.
"""

import abc
from typing import List, Optional
from uuid import UUID

from ..models.campaign_bean import CampaignBean


class ICampaignRepository(abc.ABC):
    """
    Abstract interface for Campaign repository.

    This interface defines all database operations for Campaign entities.
    Implementations should handle all database-specific logic.
    """

    @abc.abstractmethod
    def create(self, bean: CampaignBean) -> CampaignBean:
        """
        Create a new campaign.

        Args:
            bean: Campaign data to create

        Returns:
            Created campaign with generated UUID

        Raises:
            ConflictException: If code already exists
        """
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_uuid(self, uuid: UUID) -> Optional[CampaignBean]:
        """
        Get a campaign by its UUID.

        Args:
            uuid: Campaign UUID

        Returns:
            Campaign if found, None otherwise
        """
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_code(self, code: str) -> Optional[CampaignBean]:
        """
        Get a campaign by its unique code.

        Args:
            code: Campaign code

        Returns:
            Campaign if found, None otherwise
        """
        raise NotImplementedError

    @abc.abstractmethod
    def get_all(self) -> List[CampaignBean]:
        """
        Get all campaigns.

        Returns:
            List of all campaigns
        """
        raise NotImplementedError

    @abc.abstractmethod
    def get_active(self) -> List[CampaignBean]:
        """
        Get all active campaigns.

        Returns:
            List of active campaigns
        """
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, bean: CampaignBean) -> CampaignBean:
        """
        Update an existing campaign.

        Args:
            bean: Campaign data to update (must have UUID)

        Returns:
            Updated campaign

        Raises:
            NotFoundException: If campaign not found
            ConflictException: If new code conflicts with existing campaign
        """
        raise NotImplementedError

    @abc.abstractmethod
    def delete(self, uuid: UUID) -> bool:
        """
        Delete a campaign.

        Args:
            uuid: Campaign UUID

        Returns:
            True if deleted, False if not found

        Raises:
            ConflictException: If campaign has associated FSECs
        """
        raise NotImplementedError

    @abc.abstractmethod
    def exists_by_code(self, code: str) -> bool:
        """
        Check if a campaign with the given code exists.

        Args:
            code: Campaign code to check

        Returns:
            True if exists, False otherwise
        """
        raise NotImplementedError
