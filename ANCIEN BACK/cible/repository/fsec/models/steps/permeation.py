from django.db import models

from cible.repository.fsec.models.steps.base_step import BaseStep


class PermeationEntity(BaseStep):
    class Meta:
        app_label = "cible"
        db_table = "PERMEATION_STEP"
        verbose_name_plural = "Permeations"

    objects = models.Manager()

    gas_type = models.TextField(max_length=200, blank=True, null=True)
    target_pressure = models.FloatField(blank=True, null=True)
    operator = models.TextField(max_length=200, blank=True, null=True)
    start_date = models.DateTimeField(blank=True, null=True)
    estimated_end_date = models.DateTimeField(blank=True, null=True)
    sensor_pressure = models.FloatField(blank=True, null=True)
    computed_shot_pressure = models.FloatField(blank=True, null=True)
