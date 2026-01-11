"""Entité ASSEMBLY_STEP - Étape d'assemblage."""
import uuid

from django.db import models

from cible.repository.fsec.models.fsec_entity import FsecEntity
from cible.repository.steps.models.assembly_bench_entity import AssemblyBenchEntity


class AssemblyStepEntity(models.Model):
    """Entité représentant une étape d'assemblage."""

    class Meta:
        app_label = "cible"
        db_table = "ASSEMBLY_STEP"

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fsec_version_id = models.ForeignKey(
        FsecEntity,
        on_delete=models.CASCADE,
        db_column="fsec_version_id",
        related_name="assembly_steps",
        to_field="version_uuid",
    )

    # Champs métier spécifiques à l'Assembly
    hydrometric_temperature = models.FloatField(null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    comments = models.TextField(max_length=4000, null=True, blank=True)
    assembly_bench = models.ManyToManyField(
        AssemblyBenchEntity,
        related_name="assembly_steps",
        blank=True,
    )

    # Champs communs à tous les steps
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    completed_by = models.UUIDField(null=True, blank=True)
    is_validated = models.BooleanField(default=False)
