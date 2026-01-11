"""Entité AIRTIGHTNESS_TEST_LP_STEP - Test d'étanchéité basse pression."""
import uuid

from django.db import models

from cible.repository.fsec.models.fsec_entity import FsecEntity


class AirtightnessTestLpStepEntity(models.Model):
    """Entité représentant un test d'étanchéité basse pression."""

    class Meta:
        app_label = "cible"
        db_table = "AIRTIGHTNESS_TEST_LP_STEP"

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fsec_version_id = models.ForeignKey(
        FsecEntity,
        on_delete=models.CASCADE,
        db_column="fsec_version_id",
        related_name="airtightness_test_lp_steps",
        to_field="version_uuid",
    )
    leak_rate_dtri = models.CharField(max_length=200, null=True, blank=True)
    gas_type = models.CharField(max_length=200, null=True, blank=True)
    experiment_pressure = models.FloatField(null=True, blank=True)
    airtightness_test_duration = models.FloatField(null=True, blank=True)
    operator = models.CharField(max_length=200, null=True, blank=True)
    date_of_fulfilment = models.DateField(null=True, blank=True)
