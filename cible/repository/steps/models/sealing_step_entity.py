"""Entité SEALING_STEP - Étape de scellement."""
import uuid

from django.db import models

from cible.repository.fsec.models.fsec_entity import FsecEntity


class SealingStepEntity(models.Model):
    """Entité représentant une étape de scellement."""

    class Meta:
        app_label = "cible"
        db_table = "SEALING_STEP"

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fsec_version_id = models.ForeignKey(
        FsecEntity,
        on_delete=models.CASCADE,
        db_column="fsec_version_id",
        related_name="sealing_steps",
        to_field="version_uuid",
    )

    # Champs métier spécifiques à Sealing
    interface_io = models.CharField(max_length=50, null=True, blank=True)
    comments = models.TextField(max_length=4000, null=True, blank=True)

    # Champs communs à tous les steps
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    completed_by = models.UUIDField(null=True, blank=True)
    is_validated = models.BooleanField(default=False)
