from django.db import models


class FsecRackEntity(models.Model):

    class Meta:
        app_label = "cible"
        db_table = "FSEC_RACK"
        verbose_name_plural = "Fsec_Racks"

    def __str__(self):
        return f"{self.label}"

    objects = models.Manager()

    id = models.IntegerField(primary_key=True, editable=False)
    label = models.CharField(max_length=40)
    color = models.CharField(max_length=40)
    is_full = models.BooleanField(default=False)
