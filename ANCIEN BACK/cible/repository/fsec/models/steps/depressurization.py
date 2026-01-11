from django.db import models

from cible.repository.fsec.models.steps.base_step import BaseStep


class DepressurizationEntity(BaseStep):
    class Meta:
        app_label = "cible"
        db_table = "DEPRESSURIZATION_STEP"
        verbose_name_plural = "Depressurizations"

    objects = models.Manager()

    operator = models.TextField(max_length=200, blank=True, null=True)
    date_of_fulfilment = models.DateField(blank=True, null=True)
    pressure_gauge = models.FloatField(blank=True, null=True)
    enclosure_pressure_measured = models.FloatField(blank=True, null=True)
    start_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)
    observations = models.TextField(max_length=4000, blank=True, null=True)
    depressurization_time_before_firing = models.FloatField(blank=True, null=True)
    computed_pressure_before_firing = models.FloatField(blank=True, null=True)
