"""Référentiel FSEC_DOCUMENT_SUBTYPES - Sous-types de documents FSEC."""
from django.db import models

from cible.repository.fsec.models.fsec_document_types_entity import (
    FsecDocumentTypesEntity,
)


class FsecDocumentSubtypesEntity(models.Model):
    """Entité représentant les sous-types de documents FSEC."""

    class Meta:
        app_label = "cible"
        db_table = "FSEC_DOCUMENT_SUBTYPES"

    id = models.AutoField(primary_key=True)
    type_id = models.ForeignKey(
        FsecDocumentTypesEntity,
        on_delete=models.CASCADE,
        db_column="type_id",
        related_name="subtypes",
    )
    label = models.CharField(max_length=40)
