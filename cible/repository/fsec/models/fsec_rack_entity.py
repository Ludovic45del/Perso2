"""Référentiel FSEC_RACK - Racks de stockage FSEC."""
from django.db import models


class FsecRackEntity(models.Model):
    """Entité représentant les racks de stockage FSEC."""

    class Meta:
        app_label = "cible"
        db_table = "FSEC_RACK"

    id = models.AutoField(primary_key=True)
    label = models.CharField(max_length=40)
    color = models.CharField(max_length=40)
    is_full = models.BooleanField(default=False)
