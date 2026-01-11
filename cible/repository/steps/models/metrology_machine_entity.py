"""Référentiel METROLOGY_MACHINE - Machines de métrologie."""
from django.db import models


class MetrologyMachineEntity(models.Model):
    """Entité représentant les machines de métrologie."""

    class Meta:
        app_label = "cible"
        db_table = "METROLOGY_MACHINE"

    id = models.AutoField(primary_key=True)
    label = models.CharField(max_length=40)
    color = models.CharField(max_length=40)
