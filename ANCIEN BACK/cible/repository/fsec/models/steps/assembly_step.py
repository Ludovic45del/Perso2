from django.db import models

from cible.repository.fsec.models.referential.fsec_assembly_bench import (
    FsecAssemblyBenchEntity,
)
from cible.repository.fsec.models.steps.base_step import BaseStep


class AssemblyStepEntity(BaseStep):
    class Meta:
        app_label = "cible"
        db_table = "ASSEMBLY_STEP"
        verbose_name_plural = "Fsec_Assemblies"

    objects = models.Manager()

    hydrometric_temperature = models.FloatField()
    start_date = models.DateField(default=None, blank=True, null=True)
    end_date = models.DateField(default=None, blank=True, null=True)
    comments = models.TextField(max_length=4000, blank=True, null=True)
    assembly_bench = models.ManyToManyField(
        FsecAssemblyBenchEntity,
        blank=True,
    )
