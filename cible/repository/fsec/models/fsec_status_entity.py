"""Référentiel FSEC_STATUS - Statuts de FSEC."""
from django.db import models


class FsecStatusEntity(models.Model):
    """Entité représentant les statuts de FSEC."""

    class Meta:
        app_label = "cible"
        db_table = "FSEC_STATUS"

    id = models.AutoField(primary_key=True)
    label = models.CharField(max_length=40)
    color = models.CharField(max_length=40)
