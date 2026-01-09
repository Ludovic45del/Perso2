"""Entité REPRESSURIZATION_STEP - Étape de repressurisation."""
import uuid

from django.db import models

from cible.repository.fsec.models.fsec_entity import FsecEntity


class RepressurizationStepEntity(models.Model):
    """Entité représentant une étape de repressurisation."""

    class Meta:
        app_label = "cible"
        db_table = "REPRESSURIZATION_STEP"

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fsec_version_id = models.ForeignKey(
        FsecEntity,
        on_delete=models.CASCADE,
        db_column="fsec_version_id",
        related_name="repressurization_steps",
        to_field="version_uuid",
    )
    operator = models.CharField(max_length=200, null=True, blank=True)
    gas_type = models.CharField(max_length=200, null=True, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    estimated_end_date = models.DateTimeField(null=True, blank=True)
    sensor_pressure = models.FloatField(null=True, blank=True)
    computed_pressure = models.FloatField(null=True, blank=True)
