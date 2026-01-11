from django.db import models

from cible.repository.fsec.models.referential.metrology_machine import (
    MetrologyMachineEntity,
)
from cible.repository.fsec.models.steps.base_step import BaseStep


class MetrologyStepEntity(BaseStep):
    class Meta:
        app_label = "cible"
        db_table = "METROLOGY_STEP"
        verbose_name_plural = "Fsec_Metrologies"

    objects = models.Manager()

    machine = models.ForeignKey(
        MetrologyMachineEntity, on_delete=models.CASCADE, blank=True, null=True
    )
    date = models.DateField(default=None, blank=True, null=True)
    comments = models.TextField(max_length=4000, blank=True, null=True)
