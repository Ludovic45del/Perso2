from django.db import models

from cible.repository.fsec.models.steps.base_step import BaseStep


class RepressurizationEntity(BaseStep):
    class Meta:
        app_label = "cible"
        db_table = "REPRESSURIZATION_STEP"
        verbose_name_plural = "Repressurizations"

    objects = models.Manager()

    operator = models.TextField(max_length=200, blank=True, null=True)
    gas_type = models.TextField(max_length=200, blank=True, null=True)
    start_date = models.DateTimeField(blank=True, null=True)
    estimated_end_date = models.DateTimeField(blank=True, null=True)
    sensor_pressure = models.FloatField(blank=True, null=True)
    computed_pressure = models.FloatField(blank=True, null=True)
