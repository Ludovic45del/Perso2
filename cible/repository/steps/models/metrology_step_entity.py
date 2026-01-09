"""Entité METROLOGY_STEP - Étape de métrologie."""
import uuid

from django.db import models

from cible.repository.fsec.models.fsec_entity import FsecEntity
from cible.repository.steps.models.metrology_machine_entity import (
    MetrologyMachineEntity,
)


class MetrologyStepEntity(models.Model):
    """Entité représentant une étape de métrologie."""

    class Meta:
        app_label = "cible"
        db_table = "METROLOGY_STEP"

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fsec_version_id = models.ForeignKey(
        FsecEntity,
        on_delete=models.CASCADE,
        db_column="fsec_version_id",
        related_name="metrology_steps",
        to_field="version_uuid",
    )
    machine_id = models.ForeignKey(
        MetrologyMachineEntity,
        on_delete=models.PROTECT,
        db_column="machine_id",
        related_name="metrology_steps",
        null=True,
        blank=True,
    )
    date = models.DateField(null=True, blank=True)
    comments = models.TextField(max_length=4000, null=True, blank=True)
