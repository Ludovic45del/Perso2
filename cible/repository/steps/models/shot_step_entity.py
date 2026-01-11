"""Entité SHOT_STEP - Étape de tir."""
import uuid

from django.db import models

from cible.repository.fsec.models.fsec_entity import FsecEntity


class ShotStepEntity(models.Model):
    """Entité représentant une étape de tir."""

    class Meta:
        app_label = "cible"
        db_table = "SHOT_STEP"

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fsec_version_id = models.ForeignKey(
        FsecEntity,
        on_delete=models.CASCADE,
        db_column="fsec_version_id",
        related_name="shot_steps",
        to_field="version_uuid",
    )

    # Champs métier spécifiques à Shot
    shot_date = models.DateField(null=True, blank=True)
    shot_reference = models.CharField(max_length=100, null=True, blank=True)
    shot_parameters = models.JSONField(default=dict, null=True, blank=True)
    shot_successful = models.BooleanField(default=False)
    result_summary = models.TextField(null=True, blank=True)

    # Champs communs à tous les steps
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    completed_by = models.UUIDField(null=True, blank=True)
    is_validated = models.BooleanField(default=False)
