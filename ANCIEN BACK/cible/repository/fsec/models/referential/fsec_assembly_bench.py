from django.db import models


class FsecAssemblyBenchEntity(models.Model):
    class Meta:
        app_label = "cible"
        db_table = "ASSEMBLY_BENCH"
        verbose_name_plural = "Fsec_Asssembly_Benches"

    def __str__(self):
        return f"{self.label}"

    objects = models.Manager()

    id = models.IntegerField(primary_key=True, editable=False)
    label = models.CharField(max_length=40)
    color = models.CharField(max_length=40)
