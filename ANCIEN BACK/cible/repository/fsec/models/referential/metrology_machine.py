from django.db import models


class MetrologyMachineEntity(models.Model):
    class Meta:
        app_label = "cible"
        db_table = "METROLOGY_MACHINE"
        verbose_name_plural = "Fsec_Metrology_Machines"

    def __str__(self):
        return f"{self.label}"

    objects = models.Manager()

    id = models.IntegerField(primary_key=True, editable=False)
    label = models.CharField(max_length=40)
    color = models.CharField(max_length=40)
