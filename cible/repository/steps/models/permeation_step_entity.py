"""Entité PERMEATION_STEP - Étape de perméation."""
import uuid

from django.db import models

from cible.repository.fsec.models.fsec_entity import FsecEntity


class PermeationStepEntity(models.Model):
    """Entité représentant une étape de perméation."""

    class Meta:
        app_label = "cible"
        db_table = "PERMEATION_STEP"

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fsec_version_id = models.ForeignKey(
        FsecEntity,
        on_delete=models.CASCADE,
        db_column="fsec_version_id",
        related_name="permeation_steps",
        to_field="version_uuid",
    )
    gas_type = models.CharField(max_length=200, null=True, blank=True)
    target_pressure = models.FloatField(null=True, blank=True)
    operator = models.CharField(max_length=200, null=True, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    estimated_end_date = models.DateTimeField(null=True, blank=True)
    sensor_pressure = models.FloatField(null=True, blank=True)
    computed_shot_pressure = models.FloatField(null=True, blank=True)
