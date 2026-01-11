"""Référentiel CAMPAIGN_INSTALLATIONS - Installations de campagne."""
from django.db import models


class CampaignInstallationsEntity(models.Model):
    """Entité représentant les installations (LMJ, Omega, etc.)."""

    class Meta:
        app_label = "cible"
        db_table = "CAMPAIGN_INSTALLATIONS"

    id = models.AutoField(primary_key=True)
    label = models.CharField(max_length=40)
    color = models.CharField(max_length=40)
