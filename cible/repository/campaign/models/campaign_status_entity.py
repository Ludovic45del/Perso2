"""Référentiel CAMPAIGN_STATUS - Statuts de campagne."""
from django.db import models


class CampaignStatusEntity(models.Model):
    """Entité représentant les statuts de campagne."""

    class Meta:
        app_label = "cible"
        db_table = "CAMPAIGN_STATUS"

    id = models.AutoField(primary_key=True)
    label = models.CharField(max_length=40)
    color = models.CharField(max_length=40)
