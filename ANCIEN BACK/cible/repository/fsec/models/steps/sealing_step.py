from django.db import models

from cible.repository.fsec.models.steps.base_step import BaseStep


class SealingStepEntity(BaseStep):
    class Meta:
        app_label = "cible"
        db_table = "SEALING_STEP"
        verbose_name_plural = "Fsec_Sealings"

    objects = models.Manager()

    interface_io = models.TextField(max_length=50, blank=True, null=True)
    comments = models.TextField(max_length=4000, blank=True, null=True)
