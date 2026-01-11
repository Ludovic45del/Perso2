"""Entité FSEC_DOCUMENTS - Documents FSEC."""
import uuid

from django.db import models

from cible.repository.fsec.models.fsec_document_subtypes_entity import (
    FsecDocumentSubtypesEntity,
)
from cible.repository.fsec.models.fsec_entity import FsecEntity


class StepType(models.TextChoices):
    """Enum des types de steps pour filtrer les teams/documents."""

    DESIGN = "DESIGN", "Design"
    ASSEMBLY = "ASSEMBLY", "Assemblage"
    METROLOGY = "METROLOGY", "Métrologie"
    SEALING = "SEALING", "Scellement"
    PICTURES = "PICTURES", "Photos"
    USABLE = "USABLE", "Utilisable"
    INSTALLED = "INSTALLED", "Installé"


class FsecDocumentsEntity(models.Model):
    """Entité représentant les documents FSEC."""

    class Meta:
        app_label = "cible"
        db_table = "FSEC_DOCUMENTS"

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fsec_id = models.ForeignKey(
        FsecEntity,
        on_delete=models.CASCADE,
        db_column="fsec_id",
        related_name="documents",
        to_field="version_uuid",
    )
    subtype_id = models.ForeignKey(
        FsecDocumentSubtypesEntity,
        on_delete=models.PROTECT,
        db_column="subtype_id",
        related_name="documents",
    )
    name = models.CharField(max_length=100)
    path = models.CharField(max_length=500)
    date = models.DateField(null=True, blank=True)
    # Nouveaux champs pour liaison par step
    step_type = models.CharField(
        max_length=20,
        choices=StepType.choices,
        default=StepType.DESIGN,
        db_column="step_type",
    )
    step_uuid = models.UUIDField(null=True, blank=True, db_column="step_uuid")

