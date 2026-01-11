"""Entité INSTALLED_STEP - Étape installée."""
import uuid

from django.db import models

from cible.repository.fsec.models.fsec_entity import FsecEntity


class InstalledStepEntity(models.Model):
    """Entité représentant une étape installée (tir)."""

    class Meta:
        app_label = "cible"
        db_table = "INSTALLED_STEP"

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fsec_version_id = models.ForeignKey(
        FsecEntity,
        on_delete=models.CASCADE,
        db_column="fsec_version_id",
        related_name="installed_steps",
        to_field="version_uuid",
    )

    # Champs métier spécifiques à Installed
    shooting_date = models.DateField(null=True, blank=True)
    preshooting_pressure = models.FloatField(null=True, blank=True)
    experience_srxx = models.CharField(max_length=50, null=True, blank=True)

    # Champs communs à tous les steps
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    completed_by = models.UUIDField(null=True, blank=True)
    is_validated = models.BooleanField(default=False)
