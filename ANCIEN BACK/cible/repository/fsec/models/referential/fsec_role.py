from django.db import models


class FsecRoleEntity(models.Model):
    class Meta:
        app_label = "cible"
        db_table = "FSEC_ROLES"
        verbose_name_plural = "Fsec_Roles"

    def __str__(self):
        return f"{self.label}"

    objects = models.Manager()

    id = models.IntegerField(primary_key=True, editable=False)
    label = models.CharField(max_length=40)
