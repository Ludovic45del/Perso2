import uuid

from django.db import models

from cible.repository.fsec.models.fsec import FsecEntity


class BaseStep(models.Model):
    class Meta:
        abstract = True

    objects = models.Manager()

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fsec_version = models.ForeignKey(FsecEntity, on_delete=models.CASCADE)
