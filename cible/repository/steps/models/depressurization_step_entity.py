"""Entité DEPRESSURIZATION_STEP - Étape de dépressurisation."""
import uuid

from django.db import models

from cible.repository.fsec.models.fsec_entity import FsecEntity


class DepressurizationStepEntity(models.Model):
    """Entité représentant une étape de dépressurisation."""

    class Meta:
        app_label = "cible"
        db_table = "DEPRESSURIZATION_STEP"

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fsec_version_id = models.ForeignKey(
        FsecEntity,
        on_delete=models.CASCADE,
        db_column="fsec_version_id",
        related_name="depressurization_steps",
        to_field="version_uuid",
    )
    operator = models.CharField(max_length=200, null=True, blank=True)
    date_of_fulfilment = models.DateField(null=True, blank=True)
    pressure_gauge = models.FloatField(null=True, blank=True)
    enclosure_pressure_measured = models.FloatField(null=True, blank=True)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    observations = models.TextField(max_length=4000, null=True, blank=True)
    depressurization_time_before_firing = models.FloatField(null=True, blank=True)
    computed_pressure_before_firing = models.FloatField(null=True, blank=True)
