"""
Campaign Bean - Domain Model.

This module defines the Campaign bean which represents a campaign
in the domain layer (business logic).
"""

from dataclasses import dataclass
from datetime import date, datetime
from typing import Optional
from uuid import UUID


@dataclass
class CampaignBean:
    """
    Domain model for Campaign.

    This is a pure Python dataclass with no dependencies on Django or database.
    Used in the business logic layer.

    Attributes:
        uuid: Unique identifier (None for new campaigns)
        name: Campaign name
        year: Campaign year
        code: Unique campaign code
        description: Optional description
        start_date: Campaign start date
        end_date: Campaign end date
        is_active: Whether the campaign is active
        created_at: Creation timestamp
        updated_at: Last update timestamp
    """

    # Primary identifier
    uuid: Optional[UUID] = None

    # Required fields
    name: str = ""
    year: int = 0
    code: str = ""

    # Optional fields
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_active: bool = True

    # Audit fields
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def __str__(self):
        return f"{self.code} - {self.name} ({self.year})"
