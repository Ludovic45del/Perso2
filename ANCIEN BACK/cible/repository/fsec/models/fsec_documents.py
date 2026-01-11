import uuid

from django.db import models

from cible.repository.fsec.models.fsec import FsecEntity
from cible.repository.fsec.models.referential.fsec_document_subtype import (
    FsecDocumentSubtypeEntity,
)


class FsecDocumentEntity(models.Model):
    class Meta:
        app_label = "cible"
        db_table = "FSEC_DOCUMENTS"
        verbose_name_plural = "Fsec_Documents"

    def __str__(self):
        return f"{self.name}: {self.type.label} - {self.subtype.label}"

    objects = models.Manager()

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fsec = models.ForeignKey(FsecEntity, on_delete=models.CASCADE)
    subtype = models.ForeignKey(FsecDocumentSubtypeEntity, on_delete=models.CASCADE)

    name = models.CharField(max_length=50, null=True)
    path = models.CharField(max_length=256, null=True)
    date = models.DateTimeField(default=None, blank=True, null=True)

    @property
    def type(self):
        return self.subtype.type if self.subtype else None
