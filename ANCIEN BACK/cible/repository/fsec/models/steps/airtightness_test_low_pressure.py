from django.db import models

from cible.repository.fsec.models.steps.base_step import BaseStep


class AirtightnessTestLowPressureEntity(BaseStep):
    class Meta:
        app_label = "cible"
        db_table = "AIRTIGHTNESS_TEST_LP_STEP"
        verbose_name_plural = "Airtightness_tests"

    objects = models.Manager()

    leak_rate_dtri = models.TextField(max_length=200, blank=True, null=True)
    gas_type = models.TextField(max_length=200, blank=True, null=True)
    experiment_pressure = models.FloatField(blank=True, null=True)
    airtightness_test_duration = models.FloatField(blank=True, null=True)
    operator = models.TextField(max_length=200, blank=True, null=True)
    date_of_fulfilment = models.DateField(blank=True, null=True)
