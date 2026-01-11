from django.db import models

from cible.repository.fsec.models.steps.base_step import BaseStep


class GasFillingHighPressureEntity(BaseStep):
    class Meta:
        app_label = "cible"
        db_table = "GAS_FILLING_HP_STEP"
        verbose_name_plural = "Gas_fillings_HP"

    objects = models.Manager()

    leak_rate_dtri = models.TextField(max_length=200, blank=True, null=True)
    gas_type = models.TextField(max_length=200, blank=True, null=True)
    experiment_pressure = models.FloatField(blank=True, null=True)
    operator = models.TextField(max_length=200, blank=True, null=True)
    observations = models.TextField(max_length=4000, blank=True, null=True)
    date_of_fulfilment = models.DateField(blank=True, null=True)
    gas_base = models.IntegerField(blank=True, null=True)
    gas_container = models.IntegerField(blank=True, null=True)
