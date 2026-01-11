"""Entité PICTURES_STEP - Étape de photos."""
import uuid

from django.db import models

from cible.repository.fsec.models.fsec_entity import FsecEntity


class PicturesStepEntity(models.Model):
    """Entité représentant une étape de photos."""

    class Meta:
        app_label = "cible"
        db_table = "PICTURES_STEP"

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fsec_version_id = models.ForeignKey(
        FsecEntity,
        on_delete=models.CASCADE,
        db_column="fsec_version_id",
        related_name="pictures_steps",
        to_field="version_uuid",
    )

    # Champs métier spécifiques à Pictures
    last_updated = models.DateField(null=True, blank=True)
    comments = models.TextField(max_length=4000, null=True, blank=True)

    # Champs communs à tous les steps
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    completed_by = models.UUIDField(null=True, blank=True)
    is_validated = models.BooleanField(default=False)
