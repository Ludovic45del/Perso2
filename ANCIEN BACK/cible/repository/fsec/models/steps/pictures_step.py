from django.db import models

from cible.repository.fsec.models.steps.base_step import BaseStep


class PicturesStepEntity(BaseStep):
    class Meta:
        app_label = "cible"
        db_table = "PICTURES_STEP"
        verbose_name_plural = "Fsec_Pictures"

    objects = models.Manager()

    last_updated = models.DateField(auto_now=True)
    comments = models.TextField(max_length=4000, blank=True, null=True)
