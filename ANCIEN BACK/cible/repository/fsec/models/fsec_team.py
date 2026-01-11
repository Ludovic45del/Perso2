import uuid

from django.db import models

from cible.repository.fsec.models.fsec import FsecEntity
from cible.repository.fsec.models.referential.fsec_role import FsecRoleEntity


class FsecTeamEntity(models.Model):
    class Meta:
        app_label = "cible"
        db_table = "FSEC_TEAMS"
        verbose_name_plural = "Fsec_Teams"

    def __str__(self):
        return f"{self.name}: {self.role.label}"

    objects = models.Manager()

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.ForeignKey(FsecRoleEntity, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=50, null=True)
    fsec = models.ForeignKey(FsecEntity, on_delete=models.CASCADE)
