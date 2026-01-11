"""
Campaign Entity - Django Model for database persistence.

This module defines the Campaign entity which represents a test campaign
in the system.
"""

import uuid
from django.db import models


class CampaignEntity(models.Model):
    """
    Django Model representing a Campaign.

    A Campaign represents a test campaign that groups multiple FSECs.

    Attributes:
        uuid: Primary key (UUID)
        name: Campaign name
        year: Campaign year
        code: Unique campaign code
        description: Optional description
        start_date: Campaign start date
        end_date: Campaign end date
        is_active: Whether the campaign is currently active
        created_at: Creation timestamp
        updated_at: Last update timestamp
    """

    uuid = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    name = models.CharField(
        max_length=100,
        help_text="Campaign name"
    )

    year = models.IntegerField(
        help_text="Campaign year"
    )

    code = models.CharField(
        max_length=50,
        unique=True,
        help_text="Unique campaign code"
    )

    description = models.TextField(
        blank=True,
        null=True,
        help_text="Campaign description"
    )

    start_date = models.DateField(
        blank=True,
        null=True,
        help_text="Campaign start date"
    )

    end_date = models.DateField(
        blank=True,
        null=True,
        help_text="Campaign end date"
    )

    is_active = models.BooleanField(
        default=True,
        help_text="Whether the campaign is active"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = "cible"
        db_table = "ref_campaign"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["code"]),
            models.Index(fields=["year"]),
            models.Index(fields=["is_active"]),
        ]

    def __str__(self):
        return f"{self.code} - {self.name} ({self.year})"
