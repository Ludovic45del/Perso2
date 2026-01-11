from django.db import models

from cible.repository.fsec.models.referential.fsec_document_type import (
    FsecDocumentTypeEntity,
)


class FsecDocumentSubtypeEntity(models.Model):
    class Meta:
        app_label = "cible"
        db_table = "FSEC_DOCUMENT_SUBTYPES"
        verbose_name_plural = "Fsec_Document_Subtypes"

    def __str__(self):
        return f"{self.label}"

    objects = models.Manager()

    id = models.AutoField(primary_key=True)
    label = models.CharField(max_length=40)
    type = models.ForeignKey(
        FsecDocumentTypeEntity, on_delete=models.CASCADE, related_name="subtypes"
    )
